import { TraineeRegistration } from '../types';
import { formatRegistrationDateTime } from './formatters';

export const GOOGLE_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwFnIRZkauDxLjAdcMFs7COH3iN0omBJJc_j6z-qqUlAEqpq7-jsIEfIcX2Jv7Y6awM/exec';

export interface GoogleSheetsRegistrationPayload {
  id: string;
  dateTime: string;
  fullName: string;
  phone: string;
  country: string;
  programTitle: string;
  mode: string;
  format: string;
  paymentAmount: string;
  senderAccountName: string;
  goals: string;
}

/**
 * Sends newly submitted registration data to the instructor's Google Sheet in the background.
 * Uses 'text/plain' and 'no-cors' mode to guarantee reliable delivery from the student's browser
 * without triggering CORS preflight restrictions in Google Apps Script.
 */
export async function syncRegistrationToGoogleSheets(
  reg: TraineeRegistration
): Promise<{ success: boolean; error?: string }> {
  try {
    const dtInfo = formatRegistrationDateTime(reg.registeredAt);

    const payload: GoogleSheetsRegistrationPayload = {
      id: reg.id,
      dateTime: dtInfo.fullStr,
      fullName: reg.fullName,
      phone: reg.phone,
      country: reg.country || 'Indonesia',
      programTitle: reg.programTitle,
      mode: reg.mode === 'online' ? 'Online Zoom' : 'Offline Tatap Muka (Bogor)',
      format:
        reg.offlineType === 'small-group'
          ? `Grup Kecil Offline Bogor (5 Orang - Tim ${reg.teamBatch || 1})`
          : reg.format === 'group'
          ? `Grup Kecil Online Zoom (5 Orang - Tim ${reg.teamBatch || 1})`
          : 'Bimbingan Privat (1-on-1)',
      paymentAmount: reg.paymentAmount || 'Sesuai Paket',
      senderAccountName: reg.senderAccountName || reg.fullName,
      goals: reg.goals || 'Kefasihan percakapan bahasa Arab fusha'
    };

    // Send asynchronously in background
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return { success: true };
  } catch (error) {
    console.warn('Google Sheets auto-sync notice:', error);
    return { success: false, error: String(error) };
  }
}
