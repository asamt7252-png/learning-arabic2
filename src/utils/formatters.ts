/**
 * Utility functions for date and time formatting in Indonesian and Arabic
 */

export const formatRegistrationDateTime = (isoString?: string) => {
  if (!isoString) return { dateStr: '-', timeStr: '-', dayStr: '-', fullStr: '-' };
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      return { dateStr: isoString, timeStr: '', dayStr: '', fullStr: isoString };
    }

    const daysId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthsId = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayName = daysId[d.getDay()];
    const dateNum = d.getDate();
    const monthName = monthsId[d.getMonth()];
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    const dateStr = `${dateNum} ${monthName} ${year}`;
    const timeStr = `${hours}:${minutes}:${seconds} WIB`;
    const dayStr = dayName;
    const fullStr = `${dayName}, ${dateNum} ${monthName} ${year} • Jam ${hours}:${minutes} WIB`;

    return {
      dayStr,
      dateStr,
      timeStr,
      fullStr,
      hours,
      minutes,
      raw: d
    };
  } catch {
    return { dateStr: String(isoString), timeStr: '', dayStr: '', fullStr: String(isoString) };
  }
};
