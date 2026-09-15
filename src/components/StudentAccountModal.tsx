import React from 'react';
import { X, User, Mail, Phone, BookOpen, CheckCircle, Clock, ShoppingBag, LogOut, ExternalLink } from 'lucide-react';
import { AppUser, TraineeRegistration } from '../types';

interface StudentAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser;
  registrations: TraineeRegistration[];
  onOpenCourses: () => void;
  onLogout: () => void;
}

export const StudentAccountModal: React.FC<StudentAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  registrations,
  onOpenCourses,
  onLogout
}) => {
  if (!isOpen) return null;

  // Find this student's registrations
  const myRegistrations = registrations.filter(
    r => r.email.trim().toLowerCase() === user.email.trim().toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121826] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-500/30 text-left relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-stone-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg border border-amber-400/40 shrink-0">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-stone-100 truncate">
                {user.fullName}
              </h3>
              <span className="bg-amber-400/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Peserta
              </span>
            </div>
            <p className="text-xs text-stone-400 truncate flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
              <span>{user.email}</span>
            </p>
            {user.phone && (
              <p className="text-xs text-stone-400 truncate flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                <span>{user.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Kursus & Program Saya ({myRegistrations.length})</span>
            </h4>
            <button
              onClick={() => {
                onClose();
                onOpenCourses();
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Beli Kursus Lain</span>
            </button>
          </div>

          {myRegistrations.length === 0 ? (
            <div className="bg-[#0B0F17] border border-stone-800 rounded-2xl p-6 text-center">
              <BookOpen className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-200">Belum ada kursus yang terdaftar</p>
              <p className="text-xs text-stone-400 mt-1 mb-4">
                Pilih paket kursus bahasa Arab online atau tatap muka sesuai kebutuhan Anda.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenCourses();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-stone-950 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-stone-950" />
                <span>Lihat Pilihan Kursus</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {myRegistrations.map((reg) => (
                <div 
                  key={reg.id}
                  className="p-3.5 rounded-2xl border border-stone-800 bg-[#0B0F17] hover:border-amber-500/30 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-100 truncate">
                      {reg.programTitle}
                    </p>
                    <p className="text-[11px] text-stone-400 capitalize">
                      {reg.mode === 'online' ? '🌐 Kelas Online' : '📍 Kelas Tatap Muka'} • {reg.format === 'individual' ? 'Privat 1-on-1' : 'Grup Kecil'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      reg.status === 'confirmed' || reg.status === 'active'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : reg.status === 'completed'
                        ? 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                    }`}>
                      {reg.status === 'confirmed' || reg.status === 'active' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-400" />
                      )}
                      <span>
                        {reg.status === 'new' ? 'Menunggu Konfirmasi' : 
                         reg.status === 'contacted' ? 'Dihubungi' :
                         reg.status === 'confirmed' ? 'Terkonfirmasi' :
                         reg.status === 'active' ? 'Kelas Aktif' :
                         reg.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
