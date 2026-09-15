import React from 'react';
import { Sparkles, Video, MapPin } from 'lucide-react';

interface HeroSectionProps {
  selectedMode: 'online' | 'offline';
  onSelectMode: (mode: 'online' | 'offline') => void;
  onScrollToPrograms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedMode,
  onSelectMode,
  onScrollToPrograms
}) => {
  return (
    <section className="relative overflow-hidden py-18 sm:py-26 bg-gradient-to-b from-[#0E1524] via-[#0B0F17] to-[#0B0F17] text-white border-b border-amber-500/20">
      {/* Subtle luxury ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        
        {/* Luxury Micro-Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mx-auto shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Bimbingan Privat & Eksklusif Bahasa Arab</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-100 tracking-tight leading-[1.25]">
          Belajar bahasa Arab lebih cepat dengan{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
            tutor privat
          </span>
        </h1>

        {/* The Two Mode Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pt-3">
          {/* Button 1: Saya ingin belajar online. */}
          <button
            id="hero-btn-online"
            type="button"
            onClick={() => {
              onSelectMode('online');
              onScrollToPrograms();
            }}
            className={`w-full py-4 px-6 rounded-2xl text-base sm:text-lg font-bold transition-all shadow-lg active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2.5 ${
              selectedMode === 'online'
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black ring-2 ring-amber-300/60 shadow-amber-950/60'
                : 'bg-[#131926] hover:bg-[#1A2336] text-stone-300 border border-stone-800 hover:border-amber-500/40'
            }`}
          >
            <Video className={`w-5 h-5 ${selectedMode === 'online' ? 'text-stone-950' : 'text-amber-400'}`} />
            <span>Saya ingin belajar online.</span>
          </button>

          {/* Button 2: Saya ingin belajar offline. */}
          <button
            id="hero-btn-offline"
            type="button"
            onClick={() => {
              onSelectMode('offline');
              onScrollToPrograms();
            }}
            className={`w-full py-4 px-6 rounded-2xl text-base sm:text-lg font-bold transition-all shadow-lg active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2.5 ${
              selectedMode === 'offline'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black ring-2 ring-amber-300/60 shadow-amber-950/60'
                : 'bg-[#131926] hover:bg-[#1A2336] text-stone-300 border border-stone-800 hover:border-amber-500/40'
            }`}
          >
            <MapPin className={`w-5 h-5 ${selectedMode === 'offline' ? 'text-stone-950' : 'text-amber-400'}`} />
            <span>Saya ingin belajar offline.</span>
          </button>
        </div>

      </div>
    </section>
  );
};


