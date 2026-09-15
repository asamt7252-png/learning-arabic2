import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { COMMON_MISTAKES } from '../data/initialData';

interface CommonMistakesProps {
  onOpenRegister: () => void;
}

export const CommonMistakes: React.FC<CommonMistakesProps> = ({ onOpenRegister }) => {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const revealAll = () => {
    const all: Record<string, boolean> = {};
    COMMON_MISTAKES.forEach(m => { all[m.id] = true; });
    setRevealedIds(all);
  };

  return (
    <div id="mistakes-section" className="py-16 bg-[#0B0F17] border-b border-stone-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Koreksi Kalimat & Panduan Kefasihan Fusha</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-100 tracking-tight">
            Seri «Qul wa Lā Taqul» (قُلْ وَلَا تَقُلْ)
          </h2>
          <p className="mt-2 text-stone-400 text-sm sm:text-base">
            Koreksi kesalahan berbahasa Arab yang lazim terjadi dalam percakapan sehari-hari maupun tulisan resmi, lengkap dengan alasan gramatikal dan mu'jam standarnya.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={revealAll}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-[#121826] border border-amber-500/30 hover:border-amber-500/60 px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Buka Penjelasan Kaidah Semua Kalimat
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {COMMON_MISTAKES.map((item) => {
            const isRevealed = !!revealedIds[item.id];

            return (
              <div
                key={item.id}
                id={`mistake-card-${item.id}`}
                className="bg-[#121826] rounded-2xl border border-stone-800 shadow-lg hover:border-amber-500/40 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Versus header */}
                  <div className="space-y-3 pb-4 border-b border-stone-800">
                    {/* Wrong */}
                    <div className="flex items-start gap-3 bg-red-950/40 p-3.5 rounded-xl border border-red-800/50">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                          Jangan Katakan:
                        </span>
                        <span className="text-base sm:text-lg font-bold text-stone-200 line-through decoration-red-400 font-['Amiri',serif]">
                          «{item.wrong}»
                        </span>
                      </div>
                    </div>

                    {/* Correct */}
                    <div className="flex items-start gap-3 bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                          Tetapi Katakanlah:
                        </span>
                        <span className="text-base sm:text-lg font-bold text-stone-100 font-['Amiri',serif]">
                          «{item.correct}»
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Reason Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-stone-400 hover:text-amber-400 py-1 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span>Mengapa keliru menurut kaidah bahasa Arab?</span>
                      </span>
                      {isRevealed ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
                    </button>

                    {isRevealed && (
                      <div className="mt-3 p-4 bg-[#0B0F17] rounded-xl border border-stone-800 text-xs text-stone-300 space-y-2 animate-in fade-in duration-200 text-left">
                        <p className="leading-relaxed">
                          <span className="font-bold text-stone-100">Alasan Kaidah: </span>
                          {item.reason}
                        </p>
                        <div className="pt-2 border-t border-stone-800 text-stone-300">
                          <span className="font-bold text-amber-400">Contoh Kalimat Fusha: </span>
                          <span className="font-['Amiri',serif] text-sm text-stone-100 block mt-1" dir="rtl">
                            «{item.example}»
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer hint */}
                <div className="px-6 py-2.5 bg-[#0e1420] border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Modul Bimbingan Osama Alkhatib</span>
                  <span className="text-amber-400 font-semibold">Kaidah Standar</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-[#121826] rounded-2xl border border-amber-500/30 p-8 shadow-xl">
          <h3 className="text-xl font-bold text-stone-100">
            Ingin Menguasai Tata Bahasa & Bicara Arab Tanpa Khawatir Salah?
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
            Bergabunglah dalam program bimbingan intensif bersama Osama Alkhatib untuk bimbingan langsung, praktik berbicara, dan perbaikan kaidah bertahap.
          </p>
          <button
            onClick={onOpenRegister}
            className="mt-5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black px-7 py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-950/50 cursor-pointer"
          >
            Daftar Kursus Bahasa Arab Sekarang
          </button>
        </div>

      </div>
    </div>
  );
};
