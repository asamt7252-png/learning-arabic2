import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

interface InstructorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const InstructorLoginModal: React.FC<InstructorLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Owner credentials requested by user:
    // Email: osama7252t@gmail.com
    // Password (uppercase): OSAMA20007
    const validEmail = 'osama7252t@gmail.com';
    const validPassword = 'OSAMA20007';

    setTimeout(() => {
      setIsLoading(false);
      if (cleanEmail === validEmail && cleanPass === validPassword) {
        onLoginSuccess();
        setEmail('');
        setPassword('');
        setError('');
      } else {
        if (cleanEmail !== validEmail) {
          setError('Alamat Gmail tidak terdaftar sebagai pemilik sistem kursus ini.');
        } else if (cleanPass !== validPassword) {
          setError('Kata sandi salah. Pastikan menggunakan huruf besar (UPPERCASE) sesuai akun pemilik.');
        } else {
          setError('Email atau kata sandi tidak sesuai.');
        }
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121826] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-amber-500/30 text-left relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-950 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-amber-500/40 shrink-0">
            <span className="font-['Amiri',serif] text-2xl text-amber-400">أ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Akses Khusus Pemilik</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h3 className="text-lg font-black text-stone-100 leading-tight">
              Login Instruktur (Owner)
            </h3>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Alamat Akun Gmail Pemilik
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="owner-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Gmail Anda"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F17] border border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-100 focus:bg-[#0E1524] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder-stone-500"
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="owner-login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-11 py-2.5 bg-[#0B0F17] border border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-100 focus:bg-[#0E1524] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder-stone-500"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-stone-400" />}
              </button>
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              Catatan: Kata sandi sensitif terhadap huruf besar/kapital.
            </span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-400 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              id="owner-submit-login-btn"
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-stone-950 rounded-xl text-xs font-black shadow-lg shadow-amber-950/50 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-950" />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk sebagai Instruktur'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
