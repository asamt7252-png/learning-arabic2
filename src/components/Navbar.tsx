import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { AppUser } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'coach-dashboard';
  setActiveTab: (tab: 'home' | 'coach-dashboard') => void;
  onOpenRegister?: () => void;
  newRegistrationsCount: number;
  currentUser: AppUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  newRegistrationsCount,
  currentUser,
  onLogout
}) => {
  const isOwner = currentUser?.role === 'instructor';
  const isStudent = currentUser?.role === 'student';

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg shadow-black/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-bold text-xl shadow-md shadow-amber-950/40 border border-amber-300/40 group-hover:scale-105 transition-transform">
              <span className="font-['Amiri',serif] font-black text-2xl">أ</span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black text-stone-100 tracking-tight block leading-tight">
                Kursus Bahasa Arab
              </span>
              <p className="text-xs text-amber-400 font-semibold tracking-wide">
                (Privat & Grup Kecil)
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Authenticated Owner State (Hidden completely from regular visitors) */}
            {isOwner && (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-coach-dashboard"
                  onClick={() => setActiveTab(activeTab === 'coach-dashboard' ? 'home' : 'coach-dashboard')}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    activeTab === 'coach-dashboard'
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-black shadow-md shadow-amber-900/30'
                      : 'bg-[#141B2B] text-amber-300 border-amber-500/30 hover:bg-[#1A2338]'
                  }`}
                  title="Panel Instruktur Osama Alkhatib"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Panel Instruktur</span>
                  <span className="sm:hidden">Instruktur</span>
                  {newRegistrationsCount > 0 && (
                    <span className="bg-amber-400 text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                      {newRegistrationsCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-coach-logout-btn"
                  onClick={onLogout}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-800/40 transition-colors"
                  title="Keluar dari akun instruktur (Logout)"
                  aria-label="Logout Instruktur"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};


