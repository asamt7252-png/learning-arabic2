import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, User, Phone, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { AppUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const OWNER_EMAIL = 'osama7252t@gmail.com';
  const OWNER_PASSWORD = 'OSAMA20007';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    setTimeout(() => {
      setIsLoading(false);

      // Check if it's the Owner's official Gmail
      if (cleanEmail === OWNER_EMAIL) {
        if (cleanPassword === OWNER_PASSWORD) {
          const ownerUser: AppUser = {
            id: 'owner-osama',
            fullName: 'Osama Alkhatib',
            email: OWNER_EMAIL,
            role: 'instructor',
            phone: '0859-7164-1149'
          };
          onLoginSuccess(ownerUser);
          onClose();
          resetForm();
          return;
        } else {
          setError('Kata sandi untuk akun ini tidak sesuai. Pastikan menggunakan huruf besar (UPPERCASE).');
          return;
        }
      }

      // Regular Student Authentication
      if (mode === 'login') {
        // Find in local saved users or accept valid credentials
        if (cleanPassword.length < 4) {
          setError('Kata sandi minimal 4 karakter.');
          return;
        }

        // Check stored users if any
        let registeredUsers: Array<{ fullName: string; email: string; phone: string }> = [];
        try {
          const saved = localStorage.getItem('alfasih_registered_users');
          if (saved) registeredUsers = JSON.parse(saved);
        } catch (err) {
          console.error(err);
        }

        const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
        const studentUser: AppUser = {
          id: `student-${Date.now()}`,
          fullName: existing ? existing.fullName : (fullName.trim() || cleanEmail.split('@')[0]),
          email: cleanEmail,
          role: 'student',
          phone: existing ? existing.phone : (phone.trim() || '')
        };

        onLoginSuccess(studentUser);
        onClose();
        resetForm();
      } else {
        // Register Mode
        if (!fullName.trim()) {
          setError('Mohon isi nama lengkap Anda.');
          return;
        }
        if (cleanPassword.length < 4) {
          setError('Kata sandi minimal 4 karakter.');
          return;
        }

        const newStudentUser: AppUser = {
          id: `student-${Date.now()}`,
          fullName: fullName.trim(),
          email: cleanEmail,
          role: 'student',
          phone: phone.trim(),
          registeredAt: new Date().toISOString()
        };

        // Save to registered users
        try {
          const saved = localStorage.getItem('alfasih_registered_users');
          const list = saved ? JSON.parse(saved) : [];
          list.push({
            fullName: fullName.trim(),
            email: cleanEmail,
            phone: phone.trim()
          });
          localStorage.setItem('alfasih_registered_users', JSON.stringify(list));
        } catch (err) {
          console.error(err);
        }

        onLoginSuccess(newStudentUser);
        onClose();
        resetForm();
      }
    }, 350);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121826] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-500/30 text-left relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-stone-950 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-amber-500/40 shrink-0">
            <span className="font-['Amiri',serif] text-2xl text-amber-400">أ</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-stone-100 leading-tight">
              {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {mode === 'login' 
                ? 'Gunakan akun Gmail Anda untuk melanjutkan & membeli kursus'
                : 'Buat akun untuk memulai pendaftaran kursus bahasa Arab'}
            </p>
          </div>
        </div>

        {/* Mode Toggle (Masuk / Daftar) */}
        <div className="flex bg-[#0B0F17] p-1 rounded-2xl mb-5 border border-stone-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Masuk (Sign In)
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Daftar Baru (Register)
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="auth-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap Anda..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F17] border border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-100 placeholder-stone-500 focus:bg-[#0E1524] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Alamat Email / Gmail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namaanda@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F17] border border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-100 placeholder-stone-500 focus:bg-[#0E1524] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="auth-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F17] border border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-100 placeholder-stone-500 focus:bg-[#0E1524] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-11 py-2.5 bg-[#0B0F17] border border-stone-700 rounded-xl text-xs sm:text-sm font-medium text-stone-100 placeholder-stone-500 focus:bg-[#0E1524] focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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
          </div>

          <div className="pt-3">
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] text-stone-950 rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-stone-950" />
              <span>{isLoading ? 'Memproses...' : mode === 'login' ? 'Masuk ke Akun' : 'Daftar Sekarang'}</span>
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-5 pt-4 border-t border-stone-800 text-center">
          <p className="text-xs text-stone-400">
            {mode === 'login' ? (
              <>
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Daftar akun di sini
                </button>
              </>
            ) : (
              <>
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Masuk di sini
                </button>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};
