import React from 'react';
import { Users, Clock, Sparkles, Bell } from 'lucide-react';

interface RegularClassBannerProps {
  onPreRegisterInterest?: () => void;
}

export const RegularClassBanner: React.FC<RegularClassBannerProps> = ({
  onPreRegisterInterest
}) => {
  return (
    <section className="py-10 bg-gradient-to-b from-stone-50 to-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-indigo-800 relative overflow-hidden">
          {/* Subtle decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-indigo-800/40 pointer-events-none blur-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-600/50 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Segera Hadir • قَرِيبًا جِدًّا</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Kelas Reguler (فصل عادي / جماعي)
                </h3>
                <p className="text-xs sm:text-sm text-indigo-200 mt-1 font-medium">
                  Program belajar bahasa Arab berkelompok dengan kurikulum terstruktur dan biaya yang lebih terjangkau.
                </p>
              </div>

              <p className="text-xs text-stone-200 leading-relaxed max-w-xl">
                Sedang dipersiapkan untuk Anda yang ingin belajar bersama rekan-rekan dalam suasana interaktif, jadwal tetap, latihan rutin muhadatsah, dan evaluasi berkala.
              </p>
            </div>

            {/* Status / CTA Badge */}
            <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
              <div className="px-4 py-2 rounded-xl bg-indigo-800/90 border border-indigo-700 text-indigo-200 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Tahap Persiapan Akhir</span>
              </div>
              <p className="text-[11px] text-indigo-300/80 text-left md:text-right">
                Pendaftaran akan diumumkan segera
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
