import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Copy, 
  Check, 
  Users, 
  Phone,
  AlertCircle,
  Calendar,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { ProgramTrack, ProgramFormat, TraineeLevel, TraineeRegistration, AppUser } from '../types';
import { formatRegistrationDateTime } from '../utils/formatters';
import { syncRegistrationToGoogleSheets } from '../utils/googleSheets';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: ProgramTrack[];
  registrations: TraineeRegistration[];
  preselectedProgramId?: string;
  onAddRegistration: (newReg: TraineeRegistration) => void;
  currentUser?: AppUser | null;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  programs,
  registrations,
  preselectedProgramId,
  onAddRegistration,
  currentUser
}) => {
  // Step State: 1 = Input Informasi, 2 = Konfirmasi Pembayaran, 3 = Mualamat / WhatsApp
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Input Information (auto prefill if user is logged in)
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || ''); // Student's own WhatsApp number
  const [email, setEmail] = useState(currentUser?.email || '');
  const [country, setCountry] = useState('Indonesia');
  const [currentLevel, setCurrentLevel] = useState<TraineeLevel>('intermediate');
  const [goals, setGoals] = useState('');

  // Synchronize when currentUser changes or modal opens
  useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setFullName(currentUser.fullName);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser, isOpen]);

  // Fixed Program based on preselected or test recommendation
  const [programId, setProgramId] = useState(preselectedProgramId || programs[0]?.id || '');

  // Step 2: Payment Confirmation
  const [paymentProofImage, setPaymentProofImage] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isCopiedBCA, setIsCopiedBCA] = useState(false);
  const [isTransferConfirmed, setIsTransferConfirmed] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Final submitted registration
  const [submittedReg, setSubmittedReg] = useState<TraineeRegistration | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopiedMsg, setIsCopiedMsg] = useState(false);
  const [hasOpenedWhatsApp, setHasOpenedWhatsApp] = useState(false);

  // Helper to construct the complete official WhatsApp registration message
  const buildRegistrationWhatsAppMessage = (
    reg: TraineeRegistration,
    prog: ProgramTrack,
    dtInfo: { dayStr: string; dateStr: string; timeStr: string; fullStr: string }
  ) => {
    return `Assalamu'alaikum Warahmatullahi Wabarakatuh, Ustadz Osama Alkhatib,

Saya ingin menyelesaikan dan mengonfirmasi pendaftaran kursus privat bahasa Arab melalui website resmi:

📋 *DETAIL PENDAFTARAN PESERTA:*
• No. Registrasi   : ${reg.id}
• Nama Lengkap     : ${reg.fullName}
• No. WhatsApp     : ${reg.phone}
• Alamat Email     : ${reg.email}
• Domisili/Kota    : ${reg.country}
• Waktu Mendaftar  : ${dtInfo.dayStr}, ${dtInfo.dateStr} (Pukul ${dtInfo.timeStr})

📚 *PROGRAM & KELAS YANG DIPILIH:*
• Program Kursus   : ${reg.programTitle}
• Biaya Program    : ${reg.paymentAmount || prog.priceDisplay}
• Mode Belajar     : ${reg.mode === 'online' ? 'Online via Zoom Meeting' : 'Offline Tatap Muka Langsung (Bogor)'}
${reg.offlineType === 'small-group' 
  ? `• Format Kelas     : Grup Kecil Tatap Muka Bogor (5 Peserta - Tim ${reg.teamBatch || 1})\n` 
  : reg.format === 'group' 
  ? `• Format Kelas     : Grup Kecil Online Zoom (Kuota 5 Peserta - Tim ${reg.teamBatch || 1})\n• Ketentuan Kelas  : Kelas dimulai serentak setelah kuota 5 peserta lengkap\n` 
  : `• Format Kelas     : Bimbingan Intensif Privat (1-on-1)\n`}
💳 *INFORMASI PEMBAYARAN:*
• Sistem Bayar     : Transfer Bank BCA (1971260489 a.n. Osama Alkhatib Muhammad)
• Rekening Pengirim: a.n. ${reg.senderAccountName || reg.fullName}
• Bukti Transfer   : Foto bukti transfer pembayaran sudah saya lampirkan di pesan WhatsApp ini

Mohon segera diverifikasi dan kita koordinasikan hari serta jam belajarnya, Ustadz. Jazakumullah khairan katsiran.`;
  };

  useEffect(() => {
    if (preselectedProgramId) {
      setProgramId(preselectedProgramId);
    }
  }, [preselectedProgramId]);

  if (!isOpen) return null;

  // Selected Program (locked, no dropdown)
  const chosenProg = programs.find(p => p.id === programId) || programs[0];
  const isOfflineSmallGroup = chosenProg?.id === 'offline-small-group' || chosenProg?.offlineType === 'small-group';
  const isOnlineSmallGroup = chosenProg?.id === 'online-7-small-group' || chosenProg?.id === 'online-9-small-group' || chosenProg?.format === 'group';
  const isSmallGroupChosen = isOfflineSmallGroup || isOnlineSmallGroup;

  // Offline Small Group calculation
  const offlineSmallGroupRegistrations = registrations.filter(
    r => r.programId === 'offline-small-group' || r.offlineType === 'small-group'
  );
  const totalOfflineSmallGroupCount = offlineSmallGroupRegistrations.length;
  const currentOfflineBatch = totalOfflineSmallGroupCount < 5 ? 1 : 2;
  const filledInOfflineBatch = currentOfflineBatch === 1 ? totalOfflineSmallGroupCount : (totalOfflineSmallGroupCount - 5);
  const remainingInOfflineBatch = Math.max(0, 5 - filledInOfflineBatch);
  const isOfflineBatchesFull = totalOfflineSmallGroupCount >= 10;

  // Online Small Group calculation (5 members per batch)
  const onlineSmallGroupRegistrations = registrations.filter(
    r => r.programId === 'online-7-small-group' || r.programId === 'online-9-small-group' || (r.mode === 'online' && r.format === 'group')
  );
  const totalOnlineSmallGroupCount = onlineSmallGroupRegistrations.length;
  const currentOnlineBatch = Math.floor(totalOnlineSmallGroupCount / 5) + 1;
  const filledInOnlineBatch = totalOnlineSmallGroupCount % 5;
  const remainingInOnlineBatch = filledInOnlineBatch === 0 && totalOnlineSmallGroupCount > 0 ? 0 : (5 - filledInOnlineBatch);

  // Copy BCA account number
  const handleCopyBCA = () => {
    navigator.clipboard.writeText('1971260489');
    setIsCopiedBCA(true);
    setTimeout(() => setIsCopiedBCA(false), 2000);
  };

  // Image Upload Handler (with canvas optimization for high-res smartphone receipts)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('File yang dipilih harus berupa gambar (JPG, PNG, atau WEBP).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg('Ukuran file foto maksimal adalah 12MB.');
      return;
    }

    setImageFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      // Optimize image size so it fits cleanly in localStorage without quality loss
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPaymentProofImage(compressedDataUrl);
        } else {
          setPaymentProofImage(rawDataUrl);
        }
      };
      img.onerror = () => {
        setPaymentProofImage(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPaymentProofImage('');
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step 1 Validation -> proceed to Step 2
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Mohon masukkan nama lengkap Anda.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      setErrorMsg('Mohon masukkan nomor WhatsApp aktif Anda untuk koordinasi belajar.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Mohon masukkan alamat email yang valid untuk pengiriman materi.');
      return;
    }

    if (isOfflineSmallGroup && isOfflineBatchesFull) {
      setErrorMsg('Maaf, kuota pendaftaran untuk grup tatap muka offline saat ini sudah terpenuhi.');
      return;
    }

    setErrorMsg('');
    setCurrentStep(2);
  };

  // Step 2 Validation -> complete registration & proceed to Step 3 with automatic WhatsApp redirect
  const handleConfirmPaymentAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentProofImage) {
      setErrorMsg('Mohon lampirkan foto bukti transfer pembayaran Anda.');
      return;
    }

    const newId = `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const newRegistration: TraineeRegistration = {
      id: newId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim() || 'Indonesia',
      programId: chosenProg.id,
      programTitle: chosenProg.title,
      mode: chosenProg.mode,
      format: isSmallGroupChosen ? 'group' : 'individual',
      offlineType: chosenProg.offlineType,
      teamBatch: isOfflineSmallGroup ? currentOfflineBatch : isOnlineSmallGroup ? currentOnlineBatch : undefined,
      currentLevel,
      goals: goals.trim() || 'Meningkatkan kefasihan berbicara bahasa Arab fusha',
      preferredTime: 'Ditentukan bersama pengajar setelah pendaftaran',
      status: 'confirmed',
      registeredAt: nowIso,
      coachNotes: isOnlineSmallGroup 
        ? `Peserta Grup Kecil Online Tim ${currentOnlineBatch} (7 Sesi Zoom - Rp 350.000/orang). Menunggu kuota 5 peserta lengkap.` 
        : isOfflineSmallGroup 
        ? `Peserta Tim ${currentOfflineBatch} Offline Bogor.` 
        : 'Pendaftaran peserta bimbingan privat.',
      paymentMethod: 'Transfer Bank BCA (1971260489 a.n. Osama Alkhatib Muhammad)',
      senderAccountName: fullName.trim(),
      paymentStatus: 'pending',
      paymentAmount: chosenProg.priceDisplay,
      paymentDate: nowIso,
      paymentProofImage
    };

    onAddRegistration(newRegistration);
    setSubmittedReg(newRegistration);
    setErrorMsg('');
    setCurrentStep(3);

    // Automatically sync student registration directly to Google Sheets in background
    syncRegistrationToGoogleSheets(newRegistration);

    // Direct and mandatory automatic redirection to WhatsApp on user submit
    const dtInfo = formatRegistrationDateTime(nowIso);
    const msg = buildRegistrationWhatsAppMessage(newRegistration, chosenProg, dtInfo);
    setHasOpenedWhatsApp(true);
    window.open(`https://wa.me/6285971641149?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Close & Reset
  const handleClose = () => {
    if (currentStep === 3 && !hasOpenedWhatsApp) {
      const confirmLeave = confirm(
        'PERHATIAN: Anda belum mengirim konfirmasi ke WhatsApp Ustadz. Pendaftaran Anda belum dapat diproses atau dijadwalkan sebelum pesan terkirim. Tetap ingin menutup jendela?'
      );
      if (!confirmLeave) return;
    }
    setCurrentStep(1);
    setSubmittedReg(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setPaymentProofImage('');
    setImageFileName('');
    setGoals('');
    setErrorMsg('');
    setHasOpenedWhatsApp(false);
    setIsCopiedMsg(false);
    onClose();
  };

  // Step 3: Open WhatsApp with prepared message
  const handleWhatsAppContact = () => {
    if (!submittedReg) return;
    const dtInfo = formatRegistrationDateTime(submittedReg.registeredAt);
    const msg = buildRegistrationWhatsAppMessage(submittedReg, chosenProg, dtInfo);
    setHasOpenedWhatsApp(true);
    window.open(`https://wa.me/6285971641149?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Copy registration message to clipboard
  const handleCopyMessage = () => {
    if (!submittedReg) return;
    const dtInfo = formatRegistrationDateTime(submittedReg.registeredAt);
    const msg = buildRegistrationWhatsAppMessage(submittedReg, chosenProg, dtInfo);
    navigator.clipboard.writeText(msg);
    setIsCopiedMsg(true);
    setTimeout(() => setIsCopiedMsg(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#121826] rounded-3xl max-w-xl w-full shadow-2xl border border-amber-500/30 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Title and Step Indicators */}
        <div className="bg-gradient-to-r from-[#0B0F17] via-[#121826] to-[#0B0F17] text-white px-6 pt-5 pb-4 border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-['Amiri',serif] text-xl font-bold shadow-md shadow-amber-950/40">
                أ
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-stone-100">
                  Pendaftaran Bimbingan Bahasa Arab
                </h3>
                <p className="text-xs text-amber-400/90 font-['Amiri',serif]">
                  تسجيل دورة اللغة العربية الفصحى
                </p>
              </div>
            </div>
            <button
              id="close-registration-modal"
              onClick={handleClose}
              className="text-stone-400 hover:text-stone-100 p-1.5 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Stage Stepper */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-800/80 text-xs">
            {/* Stage 1 */}
            <div className={`flex items-center gap-1.5 font-bold ${
              currentStep === 1 
                ? 'text-amber-400' 
                : currentStep > 1 
                ? 'text-stone-300' 
                : 'text-stone-600'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                currentStep === 1 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black shadow-xs' 
                  : currentStep > 1 
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40' 
                  : 'bg-stone-900 text-stone-600 border border-stone-800'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className="truncate">1. Informasi</span>
            </div>

            {/* Stage 2 */}
            <div className={`flex items-center gap-1.5 font-bold ${
              currentStep === 2 
                ? 'text-amber-400' 
                : currentStep > 2 
                ? 'text-stone-300' 
                : 'text-stone-600'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                currentStep === 2 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black shadow-xs' 
                  : currentStep > 2 
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40' 
                  : 'bg-stone-900 text-stone-600 border border-stone-800'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span className="truncate">2. Pembayaran</span>
            </div>

            {/* Stage 3 */}
            <div className={`flex items-center gap-1.5 font-bold ${
              currentStep === 3 
                ? 'text-emerald-400' 
                : 'text-stone-500'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                currentStep === 3 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-stone-950 font-black shadow-xs' 
                  : 'bg-stone-900 text-stone-600 border border-stone-800'
              }`}>
                3
              </span>
              <span className="truncate">3. WhatsApp (Wajib)</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[78vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAHAP 1: إدخال المعلومات (Input Informasi Peserta) */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-4 text-left">
              
              {/* Mandatory WhatsApp Notice Banner */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5 shadow-sm">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-300">
                    Konfirmasi Wajib via WhatsApp Resmi
                  </div>
                  <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                    Setelah mengisi data & bukti transfer, Anda <strong>wajib mengirimkan pesan konfirmasi pendaftaran melalui WhatsApp</strong> ke nomor resmi <strong>+62 859-7164-1149</strong> sebagai satu-satunya syarat sah pendaftaran.
                  </p>
                </div>
              </div>

              {/* Notice: Day and Time Determined with Teacher After Registration */}
              <div className="p-3.5 bg-[#0B0F17] border border-amber-500/30 rounded-xl text-xs text-stone-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Jadwal dan Waktu Belajar Ditentukan Bersama Pengajar</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Hari dan jam pelaksanaan bimbingan belajar akan disepakati langsung bersama pengajar melalui WhatsApp setelah proses pendaftaran ini selesai.
                </p>
              </div>

              {/* Selected Program Package Card (LOCKED - NO DROPDOWN - WITH PRICE) */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Paket Bimbingan yang Dipilih
                </label>
                <div className="p-4 rounded-xl bg-[#0B0F17] border border-amber-500/40 text-stone-100 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-stone-100">
                        {chosenProg.title}
                      </h4>
                      <p className="text-xs text-amber-400/90 font-['Amiri',serif]">
                        {chosenProg.subtitle}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {chosenProg.mode === 'online' ? 'Online via Zoom Meeting' : 'Offline Tatap Muka Langsung (Bogor)'} • {chosenProg.totalSessions} Pertemuan (@{chosenProg.sessionDurationMinutes} Menit)
                      </p>
                    </div>

                    {/* Prominent Price */}
                    <div className="text-left sm:text-right bg-[#121826] sm:bg-transparent p-2 sm:p-0 rounded-lg border sm:border-0 border-stone-800">
                      <span className="text-[11px] text-stone-400 block">Biaya Paket:</span>
                      <span className="text-lg font-black text-amber-400 block leading-tight">
                        {chosenProg.priceDisplay}
                      </span>
                      {chosenProg.discountText && (
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          {chosenProg.discountText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Small Group Slot Alert if applicable */}
                  {isOnlineSmallGroup && (
                    <div className="mt-3 text-xs bg-amber-950/40 text-amber-200 p-2.5 rounded-lg border border-amber-500/30 space-y-1 font-bold">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>Format Belajar: Grup Kecil Online (Kuota 5 Peserta)</span>
                        </span>
                        <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                          {filledInOnlineBatch} / 5 Terisi (Batch {currentOnlineBatch})
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300 font-normal leading-relaxed">
                        ⚠️ <strong>Ketentuan:</strong> Kelas batch {currentOnlineBatch} akan dimulai setelah kuota 5 orang terpenuhi. Tersisa <strong>{remainingInOnlineBatch} kursi lagi</strong>.
                      </p>
                    </div>
                  )}

                  {isOfflineSmallGroup && (
                    <div className="mt-3 text-xs bg-amber-950/40 text-amber-200 p-2.5 rounded-lg border border-amber-500/30 flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Format Belajar: Grup Kecil Tatap Muka Bogor (Kuota 5 Peserta)</span>
                      </span>
                      <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                        {filledInOfflineBatch} / 5 Terisi (Batch {currentOfflineBatch})
                      </span>
                    </div>
                  )}

                  {/* Offline Notice if applicable */}
                  {chosenProg?.mode === 'offline' && !isSmallGroupChosen && (
                    <p className="mt-2.5 text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/30">
                      📍 Khusus untuk wilayah <strong>Bogor dan sekitarnya</strong>.
                    </p>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Nama Lengkap Peserta <span className="text-amber-400">*</span>
                </label>
                <input
                  id="reg-fullname-input"
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Rian Pratama"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-[#0B0F17] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-100 placeholder:text-stone-500"
                />
              </div>

              {/* Nomor WhatsApp Peserta */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-300">
                    Nomor WhatsApp Anda <span className="text-amber-400">*</span>
                  </label>
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>Untuk koordinasi & jadwal</span>
                  </span>
                </div>
                <input
                  id="reg-phone-input"
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890 atau +6281234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/60 bg-[#0B0F17] focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm font-medium text-stone-100 placeholder:text-stone-500"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Pastikan nomor WhatsApp Anda aktif untuk penentuan jadwal bimbingan.
                </p>
              </div>

              {/* Email and City */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Alamat Email <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="reg-email-input"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-[#0B0F17] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-100 placeholder:text-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Kota / Domisili
                  </label>
                  <input
                    id="reg-country-input"
                    type="text"
                    placeholder="Contoh: Bogor, Jakarta, Depok, dll."
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-[#0B0F17] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-100 placeholder:text-stone-500"
                  />
                </div>
              </div>

              {/* Level & Schedule Note */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Tingkat Kemampuan Saat Ini
                  </label>
                  <select
                    id="reg-level-select"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value as TraineeLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-stone-100 bg-[#0B0F17]"
                  >
                    <option value="beginner">Dari Nol (Pemula Mutlak)</option>
                    <option value="intermediate">Dasar / Menengah (Perlu kelancaran bicara)</option>
                    <option value="advanced">Lanjutan (Fokus kaidah & balaghah)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Hari & Waktu Belajar
                  </label>
                  <div className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-[#0B0F17] text-xs text-amber-300 font-medium">
                    Ditentukan bersama pengajar setelah pendaftaran
                  </div>
                </div>
              </div>

              {/* Target / Goals */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Target atau Kendala Bahasa Arab yang Ingin Diatasi (Opsional)
                </label>
                <textarea
                  id="reg-goals-input"
                  rows={2}
                  placeholder="Misal: Ingin lancar percakapan fusha, membenarkan kaidah nahwu, persiapan studi, dll."
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-[#0B0F17] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-100 placeholder:text-stone-500"
                />
              </div>

              {/* Submit to Step 2 Button */}
              <div className="pt-2">
                <button
                  id="proceed-to-payment-btn"
                  type="submit"
                  disabled={isOfflineSmallGroup && isOfflineBatchesFull}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 ${
                    isOfflineSmallGroup && isOfflineBatchesFull
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                      : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 active:scale-98 text-stone-950 cursor-pointer'
                  }`}
                >
                  <span>Lanjut ke Pembayaran ({chosenProg.priceDisplay})</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
              </div>

            </form>
          )}

          {/* ========================================================= */}
          {/* TAHAP 2: تأكيد الدفع (Konfirmasi Pembayaran, Rekening & Gambar) */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <form onSubmit={handleConfirmPaymentAndSubmit} className="space-y-4 text-left">
              
              <div className="pb-2 border-b border-stone-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                    <span>Tahap 2: Sistem Pembayaran (Sistem Pembayaran Resmi)</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Transfer biaya paket ke rekening Bank BCA resmi di bawah dan lampirkan foto bukti transfer Anda.
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sistem Pembayaran Aktif</span>
                </span>
              </div>

              {/* Price & Package Summary Box */}
              <div className="bg-[#0B0F17] rounded-xl p-4 border border-stone-800 text-xs space-y-2">
                <div className="flex justify-between items-center text-stone-400">
                  <span>Paket Bimbingan:</span>
                  <span className="font-bold text-stone-100">{chosenProg.title}</span>
                </div>
                <div className="flex justify-between items-center text-stone-400">
                  <span>Format:</span>
                  <span className="font-semibold text-stone-200">
                    {chosenProg.mode === 'online' ? 'Online Zoom' : 'Offline Tatap Muka Bogor'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-stone-800 text-sm">
                  <span className="font-bold text-stone-200">Total Biaya Pendaftaran:</span>
                  <span className="font-black text-amber-400 text-base">{chosenProg.priceDisplay}</span>
                </div>
              </div>

              {/* Bank BCA Official Account Card (1971260489 - Osama Alkhatib) */}
              <div className="bg-[#0B0F17] border border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-stone-100">Rekening Resmi Pembayaran:</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/40">
                    Terverifikasi
                  </span>
                </div>

                {/* Account Card (BCA) */}
                <div className="bg-[#141C2E] rounded-xl p-3.5 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                      <span>Bank BCA (Bank Central Asia)</span>
                    </div>
                    <div className="font-mono text-xl font-black text-amber-400 tracking-wider my-0.5">
                      1971260489
                    </div>
                    <div className="text-xs font-semibold text-stone-300">
                      Atas Nama: <strong className="text-stone-100">Osama Alkhatib Muhammad</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyBCA}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isCopiedBCA ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin No. Rek</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Silakan transfer sesuai nominal <strong className="text-amber-400">{chosenProg.priceDisplay}</strong> ke rekening BCA di atas, lalu lampirkan foto struk / tangkapan layar bukti transfer pada kolom di bawah.
                </p>
              </div>

              {/* Upload Proof of Payment (Image File Only) */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Lampiran Foto Bukti Transfer <span className="text-amber-400">*</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="proof-image-file-input"
                />

                {!paymentProofImage ? (
                  /* Upload Zone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-700 hover:border-amber-500 rounded-2xl p-6 text-center bg-[#0B0F17] hover:bg-[#141C2E] transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-stone-200 mb-0.5">
                      Klik untuk Memilih Foto Bukti Transfer
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Mendukung format JPG, PNG, atau tangkapan layar mobile banking (Maks. 8MB)
                    </p>
                  </div>
                ) : (
                  /* Image Preview Box */
                  <div className="p-3.5 bg-[#0B0F17] border border-amber-500/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                        <ImageIcon className="w-4 h-4 text-amber-400" />
                        <span className="truncate max-w-[200px] sm:max-w-xs">{imageFileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus & Ganti</span>
                      </button>
                    </div>

                    <div className="border border-stone-800 rounded-lg overflow-hidden bg-black/40 max-h-48 flex items-center justify-center p-1">
                      <img
                        src={paymentProofImage}
                        alt="Bukti Pembayaran"
                        className="max-h-44 object-contain rounded"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Transfer Confirmation Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="confirm-transfer-checkbox"
                  type="checkbox"
                  checked={isTransferConfirmed}
                  onChange={(e) => setIsTransferConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                />
                <label htmlFor="confirm-transfer-checkbox" className="text-xs text-stone-400 cursor-pointer">
                  Saya menyatakan telah mentransfer biaya program sebesar <strong className="text-amber-400">{chosenProg.priceDisplay}</strong> ke rekening BCA di atas dan melampirkan foto bukti transfer yang sah.
                </label>
              </div>

              {/* Action Buttons: Back to Step 1 & Proceed to Step 3 */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-3 px-4 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  id="submit-confirm-payment-btn"
                  type="submit"
                  disabled={!paymentProofImage || !isTransferConfirmed}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 active:scale-98 text-white font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer disabled:bg-stone-800 disabled:from-stone-800 disabled:to-stone-800 disabled:text-stone-600 disabled:cursor-not-allowed ring-1 ring-emerald-400/40"
                >
                  <MessageSquare className="w-4 h-4 text-white shrink-0" />
                  <span>Kirim & Buka WhatsApp Sekarang (Wajib)</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>

              <p className="text-[11px] text-center text-amber-300/90 font-medium pt-1">
                * Menekan tombol di atas akan menyelesaikan pendaftaran dan secara otomatis membuka WhatsApp resmi Ustadz (+62 859-7164-1149).
              </p>

            </form>
          )}

          {/* ========================================================= */}
          {/* TAHAP 3: Konfirmasi & WAJIB Kirim WhatsApp */}
          {/* ========================================================= */}
          {currentStep === 3 && submittedReg && (
            <div className="space-y-5 text-center py-2">
              
              <div className="w-16 h-16 bg-emerald-950/60 text-emerald-400 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-500/40 px-3 py-1 rounded-full mb-2 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Langkah Terakhir & WAJIB: Konfirmasi di WhatsApp</span>
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-stone-100">
                  Ahlan wa Sahlan, {submittedReg.fullName}!
                </h4>
                <p className="text-sm text-amber-400 font-['Amiri',serif] font-bold mt-1" dir="rtl">
                  «أَرْسِلْ رِسَالَةَ التَّأْكِيدِ عَبْرَ الوَاتْسَابِ لِتَفْعِيلِ تَسْجِيلِكَ فَوْرًا»
                </p>
                <p className="text-stone-400 text-xs sm:text-sm mt-1">
                  Data diri dan bukti pembayaran Anda telah disimpan. Sekarang selesaikan pengiriman via WhatsApp.
                </p>
              </div>

              {/* Mandatory WhatsApp Warning Alert */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-red-950/40 to-amber-950/60 border-2 border-amber-500/70 text-left space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Peringatan Wajib: Pendaftaran Belum Aktif</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Pendaftaran Anda <strong>TIDAK AKAN AKTIF</strong> dan jadwal belajar belum bisa disepakati sebelum Anda menekan tombol <strong>Kirim</strong> di aplikasi WhatsApp bersama Ustadz. WhatsApp adalah <strong>satu-satunya saluran resmi</strong> verifikasi dan penjadwalan.
                </p>
              </div>

              {/* 3 Step Instruction Guide */}
              <div className="bg-[#0B0F17] border border-stone-800 rounded-2xl p-4 text-left text-xs space-y-2.5">
                <span className="font-bold text-stone-200 block text-[11px] uppercase tracking-wider text-amber-400">
                  3 Langkah Mudah Penyelesaian:
                </span>
                <div className="space-y-2 text-stone-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Klik tombol hijau besar di bawah jika aplikasi WhatsApp belum terbuka otomatis.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Tekan tombol <strong>Kirim (Send)</strong> pada pesan teks otomatis yang telah terisi lengkap.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Lampirkan juga foto bukti transfer di obrolan WhatsApp tersebut untuk diverifikasi langsung oleh Ustadz.</span>
                  </div>
                </div>
              </div>

              {/* Main Glowing WhatsApp Action Button */}
              <div className="space-y-2.5 pt-1">
                <button
                  id="final-whatsapp-contact-btn"
                  type="button"
                  onClick={handleWhatsAppContact}
                  className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 active:scale-98 text-white font-black py-4 px-5 rounded-2xl text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/70 ring-2 ring-emerald-400/60 hover:ring-emerald-300 cursor-pointer relative"
                >
                  <MessageSquare className="w-5 h-5 text-white animate-bounce" />
                  <span className="tracking-wide">BUKA WHATSAPP & KIRIM SEKARANG (WAJIB)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Copy Text Button as Fail-Safe */}
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-xs text-stone-300 hover:text-white bg-[#0B0F17] hover:bg-stone-800 border border-stone-800 hover:border-stone-700 py-2 px-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isCopiedMsg ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">Pesan Lengkap Berhasil Disalin! Silakan tempel di WhatsApp</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-400" />
                        <span>Salin Teks Pesan WhatsApp (Jika WhatsApp Tidak Terbuka)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Registration Summary Card */}
              <div className="bg-[#0B0F17] border border-amber-500/20 rounded-2xl p-4 text-left space-y-2.5 text-xs text-stone-300">
                <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                  <span className="text-stone-400 font-medium">Nomor Registrasi:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm bg-[#121826] px-2 py-0.5 rounded border border-amber-500/30">
                    {submittedReg.id}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Paket Bimbingan:</span>
                  <span className="font-bold text-stone-100">{submittedReg.programTitle}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Biaya Paket:</span>
                  <span className="font-bold text-amber-400">{chosenProg.priceDisplay}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Nomor WhatsApp Anda:</span>
                  <span className="font-mono font-bold text-stone-100">{submittedReg.phone}</span>
                </div>

                <div className="flex justify-between items-center bg-[#141C2E] p-2 rounded-lg border border-amber-500/20">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Waktu Pendaftaran:</span>
                  </span>
                  <span className="font-bold text-amber-300 text-right">
                    {formatRegistrationDateTime(submittedReg.registeredAt).fullStr}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Sistem Pembayaran:</span>
                  <span className="font-semibold text-stone-200">Transfer Bank BCA (1971260489 a.n. Osama Alkhatib Muhammad)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Bukti Transfer:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Foto Bukti Siap Dikirim di WA</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-800">
                  <span className="text-stone-400">Jadwal Belajar:</span>
                  <span className="font-medium text-amber-400">
                    Ditentukan bersama Ustadz via WhatsApp
                  </span>
                </div>
              </div>

              {/* Close Button only after understanding */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-xs text-stone-400 hover:text-stone-200 py-2.5 rounded-xl border border-stone-800 hover:bg-stone-900/60 transition-colors cursor-pointer"
                >
                  Saya Sudah Mengirim Pesan ke WhatsApp (Selesai)
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
