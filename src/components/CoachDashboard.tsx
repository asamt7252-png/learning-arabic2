import React, { useState } from 'react';
import { 
  Users, UserCheck, Clock, Download, 
  Plus, Search, MessageSquare, Edit3, Trash2, 
  Award, X, Lock, Unlock, ShieldCheck, Key, LogOut,
  Image as ImageIcon, Eye, Maximize2, CheckCircle2,
  RotateCcw, AlertTriangle, CreditCard, Calendar, Check
} from 'lucide-react';
import { TraineeRegistration, RegistrationStatus, ProgramTrack, CoachProfile } from '../types';
import { formatRegistrationDateTime } from '../utils/formatters';

interface CoachDashboardProps {
  registrations: TraineeRegistration[];
  programs: ProgramTrack[];
  coach: CoachProfile;
  onUpdateRegistrationStatus: (id: string, newStatus: RegistrationStatus) => void;
  onUpdateRegistrationNotes: (id: string, notes: string) => void;
  onDeleteRegistration: (id: string) => void;
  onRestoreRegistration?: (id: string) => void;
  onPermanentDeleteRegistration?: (id: string) => void;
  onAddRegistration: (newReg: TraineeRegistration) => void;
  onLogout?: () => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({
  registrations,
  programs,
  coach,
  onUpdateRegistrationStatus,
  onUpdateRegistrationNotes,
  onDeleteRegistration,
  onRestoreRegistration,
  onPermanentDeleteRegistration,
  onAddRegistration,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [proofFilter, setProofFilter] = useState<'all' | 'has_proof' | 'no_proof'>('all');
  
  // Privacy & Instructor Verification State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('alfasih_coach_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinActionNotice, setPinActionNotice] = useState('');

  // Selected Trainee for Modal View / Notes Editing
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeRegistration | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Active View Tab ('active' list or 'trash' deleted list)
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');

  // Payment Proof Image Lightbox Modal
  const [previewProofTrainee, setPreviewProofTrainee] = useState<TraineeRegistration | null>(null);

  // Add Trainee Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualProgram, setManualProgram] = useState(programs[0]?.id || '');
  const [manualFormat, setManualFormat] = useState<'individual' | 'group' | 'intensive'>('individual');
  const [manualGoals, setManualGoals] = useState('');

  // Privacy Masking Helpers (Hidden for public/participants)
  const maskName = (name: string) => {
    if (!name) return '••••••';
    const words = name.trim().split(/\s+/);
    return words.map(w => {
      if (w.length <= 2) return w[0] + '*';
      return w.slice(0, 1) + '••••' + (w.length > 3 ? w.slice(-1) : '');
    }).join(' ');
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '••••••••';
    const clean = phone.replace(/[\s-]/g, '');
    if (clean.length < 7) return '••••••••';
    return clean.slice(0, 4) + ' •••• ' + clean.slice(-2);
  };

  // PIN Verification Handler
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = pinInput.trim();
    // Valid PINs: 7252, 1234, 1971
    if (trimmed === '7252' || trimmed === '1234' || trimmed === '1971') {
      setIsUnlocked(true);
      try {
        sessionStorage.setItem('alfasih_coach_unlocked', 'true');
      } catch {}
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError('');
      setPinActionNotice('');
    } else {
      setPinError('PIN yang dimasukkan salah. Silakan coba lagi.');
    }
  };

  const handleLockData = () => {
    setIsUnlocked(false);
    try {
      sessionStorage.removeItem('alfasih_coach_unlocked');
    } catch {}
    setSelectedTrainee(null);
  };

  const promptUnlock = (notice: string = '') => {
    setPinActionNotice(notice);
    setPinError('');
    setPinInput('');
    setIsPinModalOpen(true);
  };

  // Active vs Deleted Registrations
  const activeRegistrations = registrations.filter(r => !r.isDeleted);
  const deletedRegistrations = registrations.filter(r => Boolean(r.isDeleted));

  // Current list to display based on activeTab
  const currentSourceList = activeTab === 'trash' ? deletedRegistrations : activeRegistrations;

  // Filtering
  const filteredRegistrations = currentSourceList.filter(r => {
    const matchesSearch = 
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesProgram = programFilter === 'all' || r.programId === programFilter;
    const matchesProof = 
      proofFilter === 'all' || 
      (proofFilter === 'has_proof' ? Boolean(r.paymentProofImage) : !r.paymentProofImage);

    return matchesSearch && matchesStatus && matchesProgram && matchesProof;
  });

  // KPI Calculations (based on activeRegistrations)
  const totalCount = activeRegistrations.length;
  const newCount = activeRegistrations.filter(r => r.status === 'new').length;
  const activeCount = activeRegistrations.filter(r => r.status === 'active' || r.status === 'confirmed').length;
  const completedCount = activeRegistrations.filter(r => r.status === 'completed').length;
  const proofCount = activeRegistrations.filter(r => Boolean(r.paymentProofImage)).length;
  const deletedCount = deletedRegistrations.length;

  // Small Group Offline Tracking
  const smallGroupTrainees = activeRegistrations.filter(
    r => r.programId === 'offline-small-group' || r.offlineType === 'small-group'
  );
  const team1Count = smallGroupTrainees.filter(r => r.teamBatch === 1 || (!r.teamBatch && smallGroupTrainees.indexOf(r) < 5)).length;
  const team2Count = smallGroupTrainees.filter(r => r.teamBatch === 2 || (!r.teamBatch && smallGroupTrainees.indexOf(r) >= 5)).length;

  // Small Group Online Tracking (7 Sesi - 5 Orang - Rp 350.000)
  const onlineSmallGroupTrainees = activeRegistrations.filter(
    r => r.programId === 'online-7-small-group' || r.programId === 'online-9-small-group' || (r.mode === 'online' && r.format === 'group')
  );
  const totalOnlineGroupCount = onlineSmallGroupTrainees.length;
  const onlineGroupBatchNumber = Math.floor(totalOnlineGroupCount / 5) + 1;
  const onlineGroupFilledInBatch = totalOnlineGroupCount % 5;
  const onlineGroupRemainingInBatch = onlineGroupFilledInBatch === 0 && totalOnlineGroupCount > 0 ? 0 : (5 - onlineGroupFilledInBatch);
  const isOnlineBatchComplete = onlineGroupFilledInBatch === 0 && totalOnlineGroupCount > 0;

  // Open Trainee Details
  const handleOpenDetails = (trainee: TraineeRegistration) => {
    setSelectedTrainee(trainee);
    setEditingNotes(trainee.coachNotes || '');
  };

  const handleSaveNotes = () => {
    if (selectedTrainee) {
      onUpdateRegistrationNotes(selectedTrainee.id, editingNotes);
      setSelectedTrainee(prev => prev ? { ...prev, coachNotes: editingNotes } : null);
    }
  };

  // WhatsApp helper in Indonesian
  const handleOpenWhatsApp = (trainee: TraineeRegistration) => {
    if (!isUnlocked) {
      promptUnlock('Masukkan PIN Instruktur untuk menghubungi peserta via WhatsApp.');
      return;
    }
    const cleanPhone = trainee.phone.replace(/[^0-9]/g, '');
    const greeting = `Assalamu'alaikum Warahmatullahi Wabarakatuh, Halo Sdr/i ${trainee.fullName}. Saya Osama Alkhatib, instruktur bahasa Arab Anda mengenai pendaftaran di program (${trainee.programTitle}). Saya ingin mengonfirmasi kesiapan jadwal untuk sesi bimbingan pertama Anda.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`, '_blank');
  };

  // CSV Export with Indonesian headers
  const handleExportCSV = () => {
    if (!isUnlocked) {
      promptUnlock('Masukkan PIN Instruktur untuk mengunduh data ekspor CSV peserta.');
      return;
    }
    const headers = [
      'ID Pendaftaran', 
      'Nama Lengkap', 
      'Nomor WhatsApp', 
      'Email', 
      'Negara/Kota', 
      'Program', 
      'Mode Belajar', 
      'Format', 
      'Level', 
      'Status', 
      'Biaya Pembayaran (Sistem Pembayaran)', 
      'Metode Pembayaran', 
      'Rekening Pengirim', 
      'Tanggal & Waktu Daftar', 
      'Catatan Instruktur'
    ];
    const rows = registrations.map(r => [
      r.id,
      `"${r.fullName}"`,
      r.phone,
      r.email,
      `"${r.country}"`,
      `"${r.programTitle}"`,
      r.mode || 'online',
      r.format,
      r.currentLevel,
      r.status,
      r.paymentAmount ? `Rp ${r.paymentAmount.toLocaleString('id-ID')}` : '-',
      `"${r.paymentMethod || '-'}"`,
      `"${r.senderAccountName || '-'}"`,
      `"${formatRegistrationDateTime(r.registeredAt)}"`,
      `"${(r.coachNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `peserta-bahasa-arab-osama-alkhatib-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manual Add submit
  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone) return;

    const prog = programs.find(p => p.id === manualProgram) || programs[0];
    const newReg: TraineeRegistration = {
      id: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: manualName.trim(),
      phone: manualPhone.trim(),
      email: manualEmail.trim() || 'unspecified@coach.local',
      country: 'Indonesia',
      programId: prog.id,
      programTitle: prog.title,
      mode: prog.mode,
      format: manualFormat,
      currentLevel: 'intermediate',
      goals: manualGoals.trim() || 'Pendaftaran manual via instruktur',
      preferredTime: 'Sesuai kesepakatan langsung',
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
      coachNotes: 'Pendaftaran ditambahkan secara manual oleh Osama Alkhatib.'
    };

    onAddRegistration(newReg);
    setIsAddModalOpen(false);
    setManualName('');
    setManualPhone('');
    setManualEmail('');
    setManualGoals('');
  };

  return (
    <div id="coach-dashboard-root" className="py-10 bg-[#f4f6f8] min-h-screen text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Top Header */}
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-800 flex items-center justify-center text-3xl font-bold font-['Amiri',serif] shadow-sm">
              أ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black">
                  Dashboard Instruktur Bahasa Arab
                </h1>
                <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/30">
                  Panel Manajemen Peserta
                </span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm mt-1">
                Selamat datang Osama Alkhatib (أسامة الخطيب) • Kelola pendaftaran & jadwal bimbingan
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-800/90 border border-stone-700 px-3 py-2 rounded-xl text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="font-mono text-[11px] text-stone-200">osama7252t@gmail.com</span>
              <span className="text-[10px] bg-indigo-900/80 text-indigo-300 font-bold px-1.5 py-0.5 rounded border border-indigo-700/50">
                Owner
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="ml-1.5 text-stone-400 hover:text-red-400 p-1 rounded-lg hover:bg-stone-700/60 transition-colors"
                  title="Keluar dari akun instruktur (Logout)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              id="dashboard-export-csv-btn"
              onClick={handleExportCSV}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Ekspor Data (CSV)</span>
            </button>

            <button
              id="dashboard-add-trainee-btn"
              onClick={() => {
                if (!isUnlocked) {
                  promptUnlock('Masukkan PIN Instruktur untuk menambah peserta secara manual.');
                } else {
                  setIsAddModalOpen(true);
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Peserta Manual</span>
            </button>
          </div>
        </div>

        {/* Privacy & Instructor Authentication Banner */}
        <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
          isUnlocked 
            ? 'bg-indigo-50 border-indigo-300 text-indigo-950' 
            : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                isUnlocked ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {isUnlocked ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-black">
                    {isUnlocked 
                      ? 'Akses Instruktur Aktif (Mode Pemilik / Osama Alkhatib)' 
                      : 'Privasi Data Peserta Terlindungi (Sensor Aktif)'}
                  </h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked 
                      ? 'bg-indigo-200 text-indigo-900 border border-indigo-300' 
                      : 'bg-amber-200 text-amber-900 border border-amber-300'
                  }`}>
                    {isUnlocked ? 'Data Terbuka Penuh' : 'Nama, Program & Kontak Disamarkan'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  {isUnlocked 
                    ? 'Semua informasi nama lengkap, program pilihan, jenis program, dan nomor telepon peserta ditampilkan secara utuh untuk instruktur.'
                    : 'Demi menjaga privasi peserta, data nama, program, jenis program, dan nomor telepon disamarkan untuk pengunjung umum / peserta lain. Khusus instruktur, masukkan PIN untuk membuka.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {isUnlocked ? (
                <button
                  onClick={handleLockData}
                  className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kunci Data Kembali</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPinActionNotice('');
                    setPinError('');
                    setPinInput('');
                    setIsPinModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Buka Akses Instruktur (PIN)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold">Total Pendaftar</span>
              <Users className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-3xl font-black text-stone-900">{totalCount}</div>
            <span className="text-[11px] text-stone-400 mt-1 block">Peserta terdata di sistem</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-amber-700 mb-2">
              <span className="text-xs font-bold">Pendaftar Baru</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-700">{newCount}</div>
            <span className="text-[11px] text-stone-400 mt-1 block">Perlu konfirmasi WhatsApp</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-indigo-700 mb-2">
              <span className="text-xs font-bold">Peserta Terkonfirmasi/Aktif</span>
              <UserCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-indigo-700">{activeCount}</div>
            <span className="text-[11px] text-stone-400 mt-1 block">Sedang dalam program bimbingan</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-600 mb-2">
              <span className="text-xs font-bold">Lulusan Pelatihan</span>
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-stone-900">{completedCount}</div>
            <span className="text-[11px] text-stone-400 mt-1 block">Alumni program selesai</span>
          </div>
        </div>

        {/* Small Group Trackers Grid (Online & Offline) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Online Small Group Status Tracker */}
          <div className="bg-gradient-to-r from-indigo-50 to-teal-50/70 border border-indigo-300 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-800" />
                  <h3 className="text-sm font-black text-indigo-950">
                    Grup Kecil Online (7 Sesi • Kuota 5 Orang)
                  </h3>
                </div>
                <p className="text-xs text-indigo-800 mt-1">
                  Rp 350.000 / orang • Kelas dimulai setelah kuota 5 peserta lengkap.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="bg-white/95 px-3.5 py-2 rounded-xl border border-indigo-300 shadow-2xs text-center">
                  <div className="text-[10px] uppercase font-bold text-indigo-800">
                    Batch {onlineGroupBatchNumber} Aktif
                  </div>
                  <div className="text-base font-black text-indigo-950">
                    {onlineGroupFilledInBatch} / 5 <span className="text-xs font-normal text-stone-500">Kursi</span>
                  </div>
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                    isOnlineBatchComplete 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isOnlineBatchComplete 
                      ? 'Siap Dimulai (Penuh 5/5)' 
                      : `Sisa ${onlineGroupRemainingInBatch} Kursi`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Offline Small Group Status Tracker */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-800" />
                  <h3 className="text-sm font-black text-amber-950">
                    Grup Kecil Offline Bogor (Kuota 5 Peserta)
                  </h3>
                </div>
                <p className="text-xs text-amber-800 mt-1">
                  Rp 1.200.000 / orang • Pertemuan tatap muka Bogor + mutaaba'ah mingguan.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* If Team 1 is already full, show completed tag */}
                {team1Count >= 5 && (
                  <div className="bg-white/90 px-3 py-2 rounded-xl border border-indigo-300 shadow-2xs text-center">
                    <div className="text-[10px] uppercase font-bold text-indigo-800">Kelompok 1</div>
                    <div className="text-sm font-black text-indigo-950">5 / 5</div>
                    <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 bg-indigo-100 text-indigo-800">
                      Selesai
                    </span>
                  </div>
                )}

                {/* Current Active Group Pill */}
                <div className="bg-white/90 px-3.5 py-2 rounded-xl border border-amber-200 shadow-2xs text-center">
                  <div className="text-[10px] uppercase font-bold text-amber-800">
                    {team1Count < 5 ? 'Tim 1 Aktif' : 'Tim 2 Aktif'}
                  </div>
                  <div className="text-base font-black text-amber-950">
                    {team1Count < 5 ? team1Count : team2Count} / 5 <span className="text-xs font-normal text-stone-500">Kursi</span>
                  </div>
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                    (team1Count < 5 ? team1Count : team2Count) >= 5 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {(team1Count < 5 ? team1Count : team2Count) >= 5 
                      ? 'Penuh' 
                      : `Sisa ${5 - (team1Count < 5 ? team1Count : team2Count)} Slot`}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Search, Filter & Trainee Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          
          {/* Top Tab Bar: Peserta Aktif vs Tong Sampah / Arsip Terhapus */}
          <div className="border-b border-stone-200 bg-stone-100/70 px-4 sm:px-6 pt-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'active'
                    ? 'border-indigo-600 text-indigo-700 bg-white/60 rounded-t-lg shadow-2xs'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Daftar Peserta Terdaftar ({totalCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('trash')}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'trash'
                    ? 'border-red-600 text-red-700 bg-white/60 rounded-t-lg shadow-2xs'
                    : 'border-transparent text-stone-500 hover:text-red-700'
                }`}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Tong Sampah / Peserta Terhapus ({deletedCount})</span>
                {deletedCount > 0 && (
                  <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {deletedCount}
                  </span>
                )}
              </button>
            </div>

            {activeTab === 'trash' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg mb-2">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                Data terhapus dapat dipulihkan kapan saja
              </span>
            )}
          </div>

          {/* Filters Bar */}
          <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                id="search-trainees-input"
                type="text"
                placeholder="Cari nama, WhatsApp, email, atau ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="filter-status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">Semua Status</option>
                <option value="new">Pendaftar Baru</option>
                <option value="contacted">Sudah Dihubungi</option>
                <option value="confirmed">Terkonfirmasi</option>
                <option value="active">Aktif Belajar</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>

              <select
                id="filter-program-select"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">Semua Program Bimbingan</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>

              {/* Filter Foto Bukti Transfer */}
              <select
                id="filter-proof-select"
                value={proofFilter}
                onChange={(e) => setProofFilter(e.target.value as any)}
                className={`text-xs font-semibold px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                  proofFilter !== 'all' 
                    ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold' 
                    : 'bg-white border-stone-300 text-stone-700'
                }`}
              >
                <option value="all">Semua Bukti Pembayaran</option>
                <option value="has_proof">📸 Ada Foto Bukti Transfer ({proofCount})</option>
                <option value="no_proof">Belum Ada Foto Bukti</option>
              </select>

              {proofCount > 0 && proofFilter !== 'has_proof' && (
                <button
                  type="button"
                  onClick={() => setProofFilter('has_proof')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Klik untuk memfilter peserta yang sudah mengunggah foto bukti transfer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                  <span>{proofCount} Foto Bukti Menunggu</span>
                </button>
              )}

              {proofFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setProofFilter('all')}
                  className="text-xs text-stone-500 hover:text-stone-800 underline font-medium px-1"
                >
                  Reset Filter Foto
                </button>
              )}
            </div>

          </div>

          {/* Trainees Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">ID / Nama Peserta</th>
                  <th className="py-3 px-4">Program Pilihan</th>
                  <th className="py-3 px-4">Bukti Transfer (Foto)</th>
                  <th className="py-3 px-4">Format Bimbingan</th>
                  <th className="py-3 px-4">Kontak</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Tindakan Instruktur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((trainee) => {
                    const statusColors: Record<RegistrationStatus, { bg: string; text: string; label: string }> = {
                      new: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Baru' },
                      contacted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dihubungi' },
                      confirmed: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Terkonfirmasi' },
                      active: { bg: 'bg-indigo-600', text: 'text-white', label: 'Aktif' },
                      completed: { bg: 'bg-stone-200', text: 'text-stone-700', label: 'Selesai' },
                      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Batal' }
                    };

                    const currStatus = statusColors[trainee.status] || statusColors.new;

                    return (
                      <tr key={trainee.id} className="hover:bg-stone-50/80 transition-colors">
                        {/* ID and Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                            <span>{trainee.fullName}</span>
                            {trainee.isDeleted && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold border border-red-200">
                                Dihapus
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono flex flex-col gap-0.5 mt-0.5">
                            <span className="text-indigo-900 font-semibold">{trainee.id}</span>
                            <span className="text-stone-500 flex items-center gap-1 text-[10px]">
                              <Clock className="w-3 h-3 text-stone-400" />
                              {formatRegistrationDateTime(trainee.registeredAt)}
                            </span>
                          </div>
                        </td>

                        {/* Program */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-800">{trainee.programTitle}</div>
                          <div className="text-[11px] text-stone-500">{trainee.preferredTime}</div>
                          {trainee.paymentAmount ? (
                            <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 w-fit">
                              <CreditCard className="w-3 h-3 text-emerald-600" />
                              <span>Rp {trainee.paymentAmount.toLocaleString('id-ID')}</span>
                            </div>
                          ) : null}
                        </td>

                        {/* Bukti Transfer (Foto) */}
                        <td className="py-3.5 px-4">
                          {trainee.paymentProofImage ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewProofTrainee(trainee)}
                                className="relative group block w-10 h-10 rounded-lg overflow-hidden border-2 border-amber-400 bg-stone-100 shadow-xs cursor-pointer hover:border-amber-600 transition-all shrink-0"
                                title="Klik untuk memperbesar foto bukti transfer"
                              >
                                <img
                                  src={trainee.paymentProofImage}
                                  alt={`Bukti transfer ${trainee.fullName}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </button>

                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => setPreviewProofTrainee(trainee)}
                                  className="text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200/90 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1 transition-colors cursor-pointer text-left"
                                >
                                  <ImageIcon className="w-3 h-3 text-amber-700" />
                                  <span>Lihat Foto Bukti</span>
                                </button>
                                {trainee.senderAccountName && (
                                  <span className="text-[10px] text-stone-500 truncate max-w-[120px] mt-0.5">
                                    a.n {trainee.senderAccountName}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                              Belum ada foto
                            </span>
                          )}
                        </td>

                        {/* Format & Level */}
                        <td className="py-3.5 px-4">
                          {trainee.teamBatch ? (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px]">
                              👥 Tim {trainee.teamBatch} (Grup Kecil)
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold text-[11px]">
                              {trainee.format === 'individual' ? 'Privat 1-on-1' : trainee.format === 'group' ? 'Grup Interaktif' : 'Kelas Intensif'}
                            </span>
                          )}
                          {trainee.diagnosticScore !== undefined && (
                            <span className="ml-1.5 text-[11px] text-indigo-700 font-bold">
                              Skor: {trainee.diagnosticScore}%
                            </span>
                          )}
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-stone-800">{trainee.phone}</div>
                          <div className="text-[11px] text-stone-400 truncate max-w-[150px]">{trainee.email}</div>
                        </td>

                        {/* Status Select */}
                        <td className="py-3.5 px-4">
                          <select
                            value={trainee.status}
                            onChange={(e) => onUpdateRegistrationStatus(trainee.id, e.target.value as RegistrationStatus)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-none focus:ring-1 focus:ring-indigo-600 ${currStatus.bg} ${currStatus.text}`}
                          >
                            <option value="new">Baru</option>
                            <option value="contacted">Dihubungi</option>
                            <option value="confirmed">Terkonfirmasi</option>
                            <option value="active">Aktif Belajar</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Batal</option>
                          </select>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {trainee.isDeleted ? (
                              <>
                                {/* Restore Participant Button */}
                                <button
                                  onClick={() => {
                                    if (confirm(`Pulihkan kembali data peserta ${trainee.fullName}?`)) {
                                      if (onRestoreRegistration) {
                                        onRestoreRegistration(trainee.id);
                                      }
                                    }
                                  }}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                                  title="Pulihkan data peserta ini kembali ke daftar aktif"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Pulihkan</span>
                                </button>

                                {/* Permanent Delete Button */}
                                <button
                                  onClick={() => {
                                    if (confirm(`PERINGATAN: Hapus permanen data ${trainee.fullName}? Tindakan ini tidak dapat dibatalkan.`)) {
                                      if (onPermanentDeleteRegistration) {
                                        onPermanentDeleteRegistration(trainee.id);
                                      }
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-100/80 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus permanen dari sistem selamanya"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            ) : (
                              <>
                                {/* Photo Proof Direct Button */}
                                {trainee.paymentProofImage && (
                                  <button
                                    onClick={() => setPreviewProofTrainee(trainee)}
                                    className="p-1.5 text-amber-700 hover:bg-amber-100 bg-amber-50 border border-amber-300/80 rounded-lg transition-colors cursor-pointer"
                                    title="Lihat Foto Bukti Transfer Pembayaran"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}

                                {/* WhatsApp Direct */}
                                <button
                                  id={`trainee-wa-${trainee.id}`}
                                  onClick={() => handleOpenWhatsApp(trainee)}
                                  className="p-1.5 text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Kirim pesan WhatsApp sapaan langsung ke peserta"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>

                                {/* View / Notes */}
                                <button
                                  id={`trainee-notes-${trainee.id}`}
                                  onClick={() => handleOpenDetails(trainee)}
                                  className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                                  title="Buka detail & catatan instruktur"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => {
                                    if (confirm(`Apakah Anda yakin ingin menghapus data ${trainee.fullName}? Data akan dipindahkan ke Tong Sampah dan dapat dipulihkan kapan saja.`)) {
                                       onDeleteRegistration(trainee.id);
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Pindahkan ke Tong Sampah"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400 text-sm">
                      Tidak ada peserta yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Trainee Details & Coach Notes Modal */}
      {selectedTrainee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200 text-left">
            
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Detail Peserta: {selectedTrainee.fullName}
                </h3>
                <span className="text-xs text-stone-400 font-mono">{selectedTrainee.id}</span>
              </div>
              <button
                onClick={() => setSelectedTrainee(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block mb-0.5">Program Pilihan:</span>
                  <span className="font-bold text-stone-900">{selectedTrainee.programTitle}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Domisili:</span>
                  <span className="font-bold text-stone-900">{selectedTrainee.country}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Nomor WhatsApp:</span>
                  <span className="font-mono font-bold text-stone-900">{selectedTrainee.phone}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Alamat Email:</span>
                  <span className="font-mono text-stone-900 truncate block">{selectedTrainee.email}</span>
                </div>

                {/* Waktu & Tanggal Registrasi Lengkap */}
                <div className="col-span-2 bg-stone-100/80 p-2.5 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-0.5 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-stone-600" />
                    Waktu & Tanggal Pendaftaran:
                  </span>
                  <span className="font-bold text-stone-900 text-xs">
                    {formatRegistrationDateTime(selectedTrainee.registeredAt)}
                  </span>
                </div>

                {/* Sistem Pembayaran */}
                <div className="col-span-2 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-200">
                  <span className="text-indigo-950 font-black block mb-1 flex items-center gap-1.5 text-xs">
                    <CreditCard className="w-4 h-4 text-indigo-700" />
                    Sistem Pembayaran:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-500 block text-[10px]">Nominal Biaya:</span>
                      <span className="font-black text-indigo-900 text-sm">
                        {selectedTrainee.paymentAmount 
                          ? `Rp ${selectedTrainee.paymentAmount.toLocaleString('id-ID')}`
                          : 'Biaya Program Standar'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px]">Metode Pembayaran:</span>
                      <span className="font-bold text-stone-900">
                        {selectedTrainee.paymentMethod || 'Transfer Bank'}
                      </span>
                    </div>
                    {selectedTrainee.senderAccountName && (
                      <div className="col-span-2">
                        <span className="text-stone-500 block text-[10px]">Nama Pemilik Rekening Pengirim:</span>
                        <span className="font-bold text-stone-900">{selectedTrainee.senderAccountName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedTrainee.paymentProofImage ? (
                  <div className="col-span-2 bg-amber-50/80 border border-amber-300 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                        <ImageIcon className="w-4 h-4 text-amber-700" />
                        Foto Bukti Transfer Pembayaran:
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewProofTrainee(selectedTrainee)}
                        className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-white border border-amber-300 px-2.5 py-1 rounded-lg shadow-2xs hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3" />
                        Perbesar Layar Penuh
                      </button>
                    </div>
                    <div 
                      onClick={() => setPreviewProofTrainee(selectedTrainee)}
                      className="border border-amber-200 rounded-xl overflow-hidden bg-white p-2 max-h-64 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity group relative"
                      title="Klik untuk memperbesar gambar"
                    >
                      <img
                        src={selectedTrainee.paymentProofImage}
                        alt="Foto Bukti Transfer"
                        className="max-h-60 object-contain rounded-lg shadow-xs"
                      />
                      <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                        <span className="px-3 py-1.5 bg-stone-900/80 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                          <Eye className="w-3.5 h-3.5" />
                          Klik untuk Perbesar
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-amber-800 text-center mt-1.5">
                      Klik foto di atas atau tombol perbesar untuk melihat rincian bukti transfer resolusi penuh.
                    </p>
                  </div>
                ) : (
                  <div className="col-span-2 bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-center text-stone-500 text-[11px]">
                    Peserta ini belum mengunggah foto bukti transfer.
                  </div>
                )}
              </div>

              <div>
                <span className="text-stone-500 font-bold block mb-1">Target Belajar Peserta:</span>
                <p className="p-3 bg-stone-50 rounded-xl border border-stone-200 leading-relaxed text-stone-800">
                  {selectedTrainee.goals || 'Tidak ada catatan tambahan'}
                </p>
              </div>

              {/* Coach Private Notes */}
              <div>
                <label className="text-stone-800 font-bold block mb-1">
                  Catatan Bimbingan Instruktur (Khusus Pribadi Osama Alkhatib):
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Tulis catatan evaluasi makhraj, jadwal sesi, perkembangan hafalan, atau target mingguan..."
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stone-200">
              <button
                onClick={() => handleOpenWhatsApp(selectedTrainee)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Hubungi via WhatsApp</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTrainee(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    handleSaveNotes();
                    setSelectedTrainee(null);
                  }}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Manual Add Trainee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200 text-left">
            
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">
                Tambah Peserta Secara Manual
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nama Lengkap Peserta</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap peserta..."
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+62 812-XXXX-XXXX"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Program Pilihan</label>
                <select
                  value={manualProgram}
                  onChange={(e) => setManualProgram(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Format Bimbingan</label>
                <select
                  value={manualFormat}
                  onChange={(e) => setManualFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="individual">Privat 1-on-1 Intensif</option>
                  <option value="group">Grup Interaktif</option>
                  <option value="intensive">Program Kilat Ramadhan/Liburan</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Catatan Awal</label>
                <input
                  type="text"
                  placeholder="Misal: Sudah disepakati jadwal setiap Selasa malam jam 19.30 WIB"
                  value={manualGoals}
                  onChange={(e) => setManualGoals(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2 rounded-xl font-bold"
                >
                  Simpan Peserta
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Dedicated High-Resolution Payment Proof Lightbox Modal */}
      {previewProofTrainee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-stone-200 text-left animate-fadeIn">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <ImageIcon className="w-5 h-5 text-amber-700" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                    Foto Bukti Transfer: {previewProofTrainee.fullName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono mt-0.5">
                    <span>{previewProofTrainee.id}</span>
                    <span>•</span>
                    <span>{previewProofTrainee.programTitle}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProofTrainee(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 text-xs text-stone-800">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold tracking-wider">Nama Pengirim</span>
                <span className="font-bold text-stone-900 truncate block">
                  {previewProofTrainee.senderAccountName || previewProofTrainee.fullName}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold tracking-wider">Metode Bayar</span>
                <span className="font-bold text-indigo-900 truncate block">
                  {previewProofTrainee.paymentMethod || 'Transfer BCA'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold tracking-wider">Nomor WhatsApp</span>
                <span className="font-mono font-bold text-stone-900 truncate block">
                  {previewProofTrainee.phone}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold tracking-wider">Status Pembayaran</span>
                <span className={`font-bold inline-block px-2 py-0.5 rounded-md text-[11px] ${
                  previewProofTrainee.status === 'confirmed' || previewProofTrainee.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {previewProofTrainee.status === 'new' ? 'Menunggu Konfirmasi' : previewProofTrainee.status}
                </span>
              </div>
            </div>

            {/* High-Resolution Photo Viewer Card */}
            <div className="rounded-2xl border-2 border-stone-200 bg-stone-900 p-3 sm:p-4 flex items-center justify-center max-h-[58vh] overflow-hidden shadow-inner">
              {previewProofTrainee.paymentProofImage ? (
                <img
                  src={previewProofTrainee.paymentProofImage}
                  alt={`Bukti Transfer ${previewProofTrainee.fullName}`}
                  className="max-h-[52vh] max-w-full object-contain rounded-xl shadow-lg"
                />
              ) : (
                <div className="py-12 text-center text-stone-400 text-xs">
                  Tidak ada gambar bukti transfer yang tersedia.
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-stone-200">
              <div className="flex items-center gap-2">
                {previewProofTrainee.paymentProofImage && (
                  <a
                    href={previewProofTrainee.paymentProofImage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
                    <span>Buka Ukuran Asli di Tab Baru</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(previewProofTrainee)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {previewProofTrainee.status !== 'confirmed' && previewProofTrainee.status !== 'active' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateRegistrationStatus(previewProofTrainee.id, 'confirmed');
                      setPreviewProofTrainee(prev => prev ? { ...prev, status: 'confirmed' } : null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-colors shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Verifikasi Pembayaran</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewProofTrainee(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
