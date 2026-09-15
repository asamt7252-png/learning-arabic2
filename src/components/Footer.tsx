import React from 'react';
import { Mail, Phone, MapPin, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';
import { CoachProfile, AppUser } from '../types';

interface FooterProps {
  coach: CoachProfile;
  onOpenRegister: () => void;
  onSelectTab: (tab: 'home' | 'coach-dashboard') => void;
  currentUser?: AppUser | null;
  onOpenOwnerLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  coach, 
  onOpenRegister, 
  onSelectTab,
  currentUser = null,
  onOpenOwnerLogin
}) => {
  const isOwner = currentUser?.role === 'instructor';
  return (
    <footer className="bg-[#070A0F] text-white border-t border-stone-800/80 py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Brand & Coach Info */}
          <div className="md:col-span-6 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-bold text-2xl font-['Amiri',serif] shadow-md shadow-amber-950/40 border border-amber-300/40">
                أ
              </div>
              <div>
                <span className="text-lg font-black text-stone-100 block">
                  Kursus Bahasa Arab
                </span>
                <span className="text-xs text-amber-400/90 font-semibold">
                  Osama Alkhatib (أسامة الخطيب)
                </span>
              </div>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              Program pelatihan personal bersama tutor privat untuk melatih bahasa Arab dari nol, apa pun tingkat kemampuan Anda, online dan offline.
            </p>
          </div>

          {/* Quick Contact & Action */}
          <div className="md:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
            <a
              id="footer-chat-link"
              href="https://wa.me/6285971641149?text=Halo%20Osama%20Alkhatib,%20saya%20ingin%20bertanya%20dan%20mendaftar%20kursus%20bahasa%20Arab."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#121826] border border-amber-500/30 text-stone-200 hover:text-white hover:border-amber-400 text-xs font-bold transition-all shadow-md"
              title="Hubungi 0859-7164-1149"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>0859-7164-1149</span>
            </a>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p className="flex items-center gap-1">
            <span>© 2026 Osama Alkhatib. Seluruh hak cipta dilindungi.</span>
            {/* Discreet secret trigger button at the bottom for owner (instruktur / struktur) */}
            {!isOwner && onOpenOwnerLogin && (
              <button
                type="button"
                id="footer-secret-instructor-trigger"
                onClick={onOpenOwnerLogin}
                className="opacity-15 hover:opacity-100 hover:text-stone-300 transition-opacity p-1.5 text-[11px] cursor-pointer ml-1 inline-flex items-center"
                title="Akses Instruktur (Struktur)"
                aria-label="Secret Instructor Portal"
              >
                •
              </button>
            )}
          </p>

          {isOwner && (
            <button 
              id="footer-active-instructor-panel-btn"
              onClick={() => onSelectTab('coach-dashboard')}
              className="hover:text-amber-300 text-stone-400 transition-colors flex items-center gap-1.5 bg-[#121826] px-3.5 py-1.5 rounded-lg border border-amber-500/30 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Panel Instruktur (Aktif)</span>
            </button>
          )}
        </div>

      </div>
    </footer>
  );
};
