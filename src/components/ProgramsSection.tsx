import React from 'react';
import { ProgramTrack, TraineeRegistration } from '../types';
import { Video, MapPin, CheckCircle2, ArrowRight, Sparkles, AlertCircle, MessageSquare, Users } from 'lucide-react';

interface ProgramsSectionProps {
  programs: ProgramTrack[];
  registrations: TraineeRegistration[];
  selectedMode: 'online' | 'offline';
  onSelectMode: (mode: 'online' | 'offline') => void;
  onSelectProgram: (programId: string) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({
  programs,
  registrations,
  selectedMode,
  onSelectMode,
  onSelectProgram
}) => {
  const onlinePrograms = programs.filter(p => p.mode === 'online');
  const offlinePrograms = programs.filter(p => p.mode === 'offline');

  const displayedPrograms = selectedMode === 'online' ? onlinePrograms : offlinePrograms;

  // Offline Small Group Slot Tracker (Team 1 then Team 2, 5 slots per team)
  const offlineSmallGroupRegistrations = registrations.filter(
    r => r.programId === 'offline-small-group' || r.offlineType === 'small-group'
  );
  const totalOfflineSmallGroupCount = offlineSmallGroupRegistrations.length;
  
  const isOfflineBatch1 = totalOfflineSmallGroupCount < 5;
  const isOfflineBothBatchesFull = totalOfflineSmallGroupCount >= 10;
  const offlineFilledInBatch = isOfflineBatch1 ? totalOfflineSmallGroupCount : (totalOfflineSmallGroupCount - 5);
  const offlineRemainingInBatch = isOfflineBothBatchesFull ? 0 : Math.max(0, 5 - offlineFilledInBatch);
  const offlineBatchPercent = Math.min(100, Math.round((offlineFilledInBatch / 5) * 100));

  // Online Small Group Slot Tracker (5 slots per batch - must be full to start)
  const onlineSmallGroupRegistrations = registrations.filter(
    r => r.programId === 'online-7-small-group' || r.programId === 'online-9-small-group' || (r.mode === 'online' && r.format === 'group')
  );
  const totalOnlineSmallGroupCount = onlineSmallGroupRegistrations.length;
  const onlineFilledInBatch = totalOnlineSmallGroupCount % 5;
  const onlineRemainingInBatch = onlineFilledInBatch === 0 && totalOnlineSmallGroupCount > 0 ? 0 : (5 - onlineFilledInBatch);
  const onlineBatchPercent = Math.min(100, Math.round((onlineFilledInBatch / 5) * 100));

  const chatInquiryUrl = (progTitle: string) =>
    `https://wa.me/6285971641149?text=${encodeURIComponent(
      `Halo Osama Alkhatib, saya ingin bertanya tentang ${progTitle}.`
    )}`;

  return (
    <section id="programs-section" className="py-16 sm:py-20 bg-[#0B0F17] border-b border-amber-500/20 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-stone-100 tracking-tight">
            Pilihan Paket Kursus Privat
          </h2>
          <p className="text-xl font-['Amiri',serif] font-bold text-amber-400 tracking-wide" dir="rtl">
            «اخْتَرِ البَرْنَامَجَ المُنَاسِبَ لَكَ»
          </p>

          {/* Mode Switcher Segmented Control */}
          <div className="pt-3 flex justify-center">
            <div className="inline-flex p-1.5 bg-[#121826] rounded-2xl border border-stone-800 shadow-lg">
              <button
                id="toggle-mode-online"
                type="button"
                onClick={() => onSelectMode('online')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedMode === 'online'
                    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-stone-950 font-black shadow-md shadow-amber-950/40 ring-1 ring-amber-300/40'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Video className={`w-4 h-4 ${selectedMode === 'online' ? 'text-stone-950' : 'text-amber-400'}`} />
                <span>Kelas Online ({onlinePrograms.length} Paket)</span>
              </button>

              <button
                id="toggle-mode-offline"
                type="button"
                onClick={() => onSelectMode('offline')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedMode === 'offline'
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black shadow-md shadow-amber-950/40 ring-1 ring-amber-300/40'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <MapPin className={`w-4 h-4 ${selectedMode === 'offline' ? 'text-stone-950' : 'text-amber-400'}`} />
                <span>Kelas Offline ({offlinePrograms.length} Pilihan)</span>
              </button>
            </div>
          </div>

          {/* Mandatory WhatsApp Confirmation Indicator */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Semua pendaftaran program wajib dikonfirmasi langsung via WhatsApp resmi Ustadz (+62 859-7164-1149)</span>
            </div>
          </div>
        </div>

        {/* Offline Notice (Prominently Highlighted if Offline Mode is selected) */}
        {selectedMode === 'offline' && (
          <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-[#141B29] border border-amber-500/30 text-stone-200 shadow-xl max-w-4xl mx-auto space-y-2">
            <div className="flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs sm:text-sm">
                <p className="font-black text-amber-300">
                  Ketentuan Kelas Tatap Muka (Offline) & Fasilitas Tambahan:
                </p>
                <p className="text-stone-300 leading-relaxed font-normal">
                  • <strong className="text-amber-400">Wilayah:</strong> Khusus hanya untuk wilayah <strong className="underline decoration-amber-500 text-stone-100">Bogor dan sekitarnya</strong>.<br />
                  • <strong className="text-amber-400">Pendampingan:</strong> Seluruh paket offline dilengkapi <strong className="text-stone-100">materi tugas & bimbingan mingguan di grup online khusus</strong>.<br />
                  • <strong className="text-amber-400">Format:</strong> Tersedia pilihan <strong className="text-stone-100">Privat 1-on-1</strong> (Rp 1.800.000) dan <strong className="text-stone-100">Grup Kecil 5 Peserta</strong> (Rp 1.200.000 / orang).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Online Shared Specifications */}
        {selectedMode === 'online' && (
          <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-[#141B29] border border-amber-500/30 text-stone-200 shadow-xl max-w-4xl mx-auto space-y-2">
            <div className="flex items-start gap-3.5">
              <Video className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs sm:text-sm">
                <p className="font-black text-amber-300">
                  Ketentuan Kelas Online via Zoom & Pilihan Format Belajar:
                </p>
                <p className="text-stone-300 leading-relaxed font-normal">
                  • <strong className="text-amber-400">Durasi Pertemuan:</strong> 70 Menit per sesi bimbingan interaktif online via Zoom.<br />
                  • <strong className="text-amber-400">Pilihan Format:</strong> Tersedia <strong className="text-stone-100">Privat 1-on-1</strong> (belajar privat satu guru satu murid) dan <strong className="text-stone-100">Grup Kecil 5 Peserta</strong> seharga <strong className="text-amber-300">Rp 350.000 / orang</strong> untuk 7 pertemuan selama 3 pekan.<br />
                  • <strong className="text-amber-400">Ketentuan Grup Kecil:</strong> Kelas batch baru akan dimulai setelah kuota 5 peserta terpenuhi.<br />
                  • <strong className="text-amber-400">Fasilitas:</strong> Dilengkapi latihan harian rutin dan grup privat untuk rekaman & monitoring.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Programs Grid */}
        <div className={`grid gap-6 items-stretch ${
          selectedMode === 'online' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto' 
            : 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
        }`}>
          {displayedPrograms.map((prog) => {
            const isOfflineSmallGroup = prog.id === 'offline-small-group';
            const isOnlineSmallGroup = prog.id === 'online-7-small-group' || prog.id === 'online-9-small-group' || prog.format === 'group';
            const isSmallGroup = isOfflineSmallGroup || isOnlineSmallGroup;

            return (
              <div
                key={prog.id}
                id={`program-card-${prog.id}`}
                className={`bg-[#121826] rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/30 flex flex-col justify-between relative ${
                  isOnlineSmallGroup
                    ? 'border-amber-400/80 ring-2 ring-amber-400/20'
                    : prog.isPopular 
                    ? 'border-amber-400/80 ring-2 ring-amber-400/20' 
                    : isOfflineSmallGroup
                    ? 'border-amber-500/70 ring-2 ring-amber-500/20'
                    : 'border-stone-800 hover:border-amber-500/40'
                }`}
              >
                {/* Popular or Category Badge */}
                {isOnlineSmallGroup ? (
                  <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 text-[10px] font-black py-1.5 px-3 text-center uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm">
                    <Users className="w-3.5 h-3.5 text-stone-950" />
                    <span>Grup Kecil Online (Kuota 5 Orang • Rp 350.000)</span>
                  </div>
                ) : prog.isPopular ? (
                  <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 text-[10px] font-black py-1.5 px-3 text-center uppercase tracking-wider shadow-sm">
                    Eksklusif 1 Guru 1 Murid
                  </div>
                ) : isOfflineSmallGroup ? (
                  <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 text-[10px] font-black py-1.5 px-3 text-center uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm">
                    <Users className="w-3.5 h-3.5 text-stone-950" />
                    <span>Grup Kecil Offline (Kuota 5 Orang)</span>
                  </div>
                ) : null}

                {/* Card Top */}
                <div className="p-5 border-b border-stone-800/80 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md text-amber-300 bg-amber-950/70 border border-amber-500/30">
                      {prog.durationText}
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">
                      {prog.subtitle}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-stone-100 leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      {prog.totalSessions} Sesi • @{prog.sessionDurationMinutes} Menit {isSmallGroup ? '• Format 5 Peserta' : '• Privat 1-on-1'}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-2 bg-[#0B0F17] rounded-xl p-3.5 border border-stone-800">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-400">
                        {prog.priceDisplay}
                      </span>
                      {prog.originalPriceDisplay && (
                        <span className="text-xs line-through text-stone-500 font-semibold">
                          {prog.originalPriceDisplay}
                        </span>
                      )}
                    </div>
                    {prog.discountText ? (
                      <span className="inline-block mt-1.5 text-[10px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded">
                        {prog.discountText}
                      </span>
                    ) : isOnlineSmallGroup ? (
                      <span className="inline-block mt-1.5 text-[10px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded">
                        Rp 350.000 / orang
                      </span>
                    ) : isOfflineSmallGroup ? (
                      <span className="inline-block mt-1.5 text-[10px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded">
                        Harga Hemat Tim
                      </span>
                    ) : selectedMode === 'offline' ? (
                      <span className="inline-block mt-1.5 text-[10px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded">
                        Privat 1-on-1 Eksklusif
                      </span>
                    ) : null}
                  </div>

                  {/* Dynamic Slot Meter for Online Small Group (9 Sesi - Rp 350.000 - 5 Orang) */}
                  {isOnlineSmallGroup && (
                    <div className="mt-2 p-3 bg-[#161F30] rounded-xl border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Kuota Tim: 5 Peserta</span>
                        </div>
                        <span className="font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded text-[11px]">
                          {onlineFilledInBatch} / 5 Kursi
                        </span>
                      </div>

                      {/* Visual progress bar */}
                      <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${onlineBatchPercent}%` }} 
                        />
                      </div>

                      {/* Condition note matching user request */}
                      <div className="text-[11px] text-stone-300 font-medium leading-tight">
                        <span className="text-amber-200 block">
                          ⚠️ <strong>Syarat:</strong> Harus lengkap 5 orang untuk memulai kelas.
                        </span>
                        <span className="text-stone-300 font-bold block mt-1">
                          Tersisa {onlineRemainingInBatch} kursi lagi untuk memulai batch ini.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Single-Team Slot Meter for Small Group Offline */}
                  {isOfflineSmallGroup && (
                    <div className="mt-2 p-3 bg-[#161F30] rounded-xl border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Kuota Grup: 5 Peserta</span>
                        </div>
                        <span className="font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded text-[11px]">
                          {offlineFilledInBatch} / 5 Kursi
                        </span>
                      </div>

                      {/* Visual progress bar */}
                      <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${offlineBatchPercent}%` }} 
                        />
                      </div>

                      {/* Slot info note */}
                      <div className="text-[11px] text-stone-300 font-medium leading-tight">
                        {isOfflineBothBatchesFull ? (
                          <span className="text-red-400 font-bold">
                            ⚠️ Kuota pendaftaran grup saat ini telah penuh!
                          </span>
                        ) : (
                          <span>
                            Tersisa <strong className="text-amber-300 font-extrabold">{offlineRemainingInBatch} kursi lagi</strong> sebelum pendaftaran grup ditutup.
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-stone-800/80">
                      <ul className="space-y-2">
                        {prog.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs text-stone-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-stone-800/80 flex items-center gap-2">
                    <button
                      id={`enroll-btn-${prog.id}`}
                      type="button"
                      disabled={isOfflineSmallGroup && isOfflineBothBatchesFull}
                      onClick={() => onSelectProgram(prog.id)}
                      className={`flex-1 font-black py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-98 cursor-pointer ${
                        isOfflineSmallGroup && isOfflineBothBatchesFull
                          ? 'bg-stone-800 text-stone-600 cursor-not-allowed border border-stone-700'
                          : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black shadow-amber-950/40'
                      }`}
                    >
                      <span>
                        {isOfflineSmallGroup && isOfflineBothBatchesFull 
                          ? 'Kuota Grup Penuh' 
                          : isOnlineSmallGroup
                          ? 'Daftar Grup Online (5 Orang)'
                          : isOfflineSmallGroup
                          ? 'Daftar Grup Kecil'
                          : 'Daftar Paket'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Icon Chat button */}
                    <a
                      id={`chat-icon-${prog.id}`}
                      href={chatInquiryUrl(prog.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl text-amber-400 bg-[#0B0F17] hover:bg-[#1A2336] transition-colors border border-stone-800 hover:border-amber-500/40 shrink-0"
                      title="Tanya seputar paket ini"
                      aria-label="Kirim Pesan"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

