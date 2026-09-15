import React, { useState } from 'react';
import { Sparkles, Bot, Send, Loader2 } from 'lucide-react';

export const AiFaqSection: React.FC = () => {
  const [userQuery, setUserQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<{ query: string; response: string } | null>(null);

  // Smart Context-Aware Answer Engine
  const generateAiAnswer = (query: string) => {
    const q = query.toLowerCase().trim();

    if (!q) return;
    setIsAnswering(true);

    setTimeout(() => {
      let reply = '';
      const isArabicQuery = /[\u0600-\u06FF]/.test(query);

      // 1. Dari mana mendapatkan materi / kurikulum (من أين نحصل على المنهاج)
      if (
        q.includes('من أين') || 
        q.includes('كيف نحصل') || 
        q.includes('كيف احصل') || 
        q.includes('أين أجد') ||
        q.includes('الحصول على') || 
        (q.includes('dapat') && (q.includes('materi') || q.includes('kurikulum') || q.includes('modul') || q.includes('buku') || q.includes('kitab') || q.includes('silabus'))) ||
        (q.includes('mendapatkan') && (q.includes('materi') || q.includes('kurikulum') || q.includes('modul') || q.includes('buku') || q.includes('kitab') || q.includes('silabus'))) ||
        (q.includes('kirim') && (q.includes('materi') || q.includes('kurikulum') || q.includes('modul'))) ||
        q.includes('cara mendapatkan')
      ) {
        if (isArabicQuery) {
          reply = 'ستتم التواصل معك مباشرة بعد التسجيل لإرسال البرنامج الخاص والمناسب لك على حسب البرنامج الذي اخترته عبر الواتساب.';
        } else {
          reply = 'Anda akan dihubungi langsung setelah pendaftaran untuk dikirimkan silabus dan materi yang khusus serta sesuai dengan program yang Anda pilih melalui WhatsApp.';
        }
      } else if (q.includes('menit') || q.includes('durasi') || q.includes('مدة') || q.includes('كم دقيقة')) {
        reply = isArabicQuery 
          ? 'مدة كل جلسة تدريبية هي 70 دقيقة، مصممة بطريقة تفاعلية ومكثفة.'
          : 'Setiap sesi berdurasi 70 menit, didesain intensif dan interaktif.';
      } else if (q.includes('kurikulum') || q.includes('materi') || q.includes('silabus') || q.includes('kitab') || q.includes('buku') || q.includes('menhaj') || q.includes('منهج') || q.includes('baina yadaik') || q.includes('lughah')) {
        if (isArabicQuery) {
          reply = 'المنهج هو مجموع من أكثر المناهج الناجحة في تعليم غير الناطقين بها، مثل منهج "العربية بين يديك" ومنهج "اللغة". فالمنهج هو تجميع واختصار بين هذه المناهج واختيار مواضيع منها، وسيتم تحديد طول المنهج على حسب اختيار البرنامج نفسه.';
        } else {
          reply = 'Kurikulum yang digunakan adalah gabungan dari kurikulum-kurikulum paling sukses dalam pengajaran bahasa Arab bagi non-penutur asli, seperti kurikulum "Al-Arabiyyah Baina Yadaik" dan kurikulum "Al-Lughah". Kurikulum ini merupakan kompilasi dan ringkasan dari kurikulum-kurikulum tersebut serta pemilihan topik-topik darinya, dan panjang materi kurikulum akan ditentukan sesuai dengan pilihan program itu sendiri.';
        }
      } else if (q.includes('teman') || q.includes('kurang dari') || q.includes('rombongan') || q.includes('diskon') || (q.includes('kurang') && q.includes('5')) || q.includes('تخفيض') || q.includes('خصم') || q.includes('أصدقاء')) {
        reply = 'Ya, tentu saja bisa! Jika Anda mendaftar bersama teman-teman meskipun kurang dari 5 orang, silakan hubungi kami via WhatsApp (085971641149) dan kami akan menentukan potongan harga (diskon) spesial yang sesuai untuk kelompok Anda.';
      } else if (q.includes('reguler') || q.includes('banyak') || q.includes('15') || q.includes('20') || q.includes('kelompok besar') || q.includes('kelas besar')) {
        reply = 'Ya, kelas reguler berkelompok besar (15-20 peserta) akan kami sediakan, namun segera hadir (coming soon) dan belum dibuka saat ini.';
      } else if (q.includes('siapa') || q.includes('guru') || q.includes('pengajar') || q.includes('ustadz') || q.includes('instruktur') || q.includes('osama') || q.includes('من هو') || q.includes('المعلم') || q.includes('المدرب')) {
        reply = 'Pengajarnya adalah Osama Alkhatib, pelatih bahasa dengan pengalaman luas dalam pengajaran bahasa Arab fusha maupun percakapan.';
      } else if (q.includes('jadwal') || q.includes('waktu') || q.includes('jam') || q.includes('fleksibel') || q.includes('flexible') || q.includes('kapan') || q.includes('جدول') || q.includes('مواعيد') || q.includes('وقت')) {
        reply = 'Ya, jadwal belajar tidak kaku melainkan fleksibel, ditentukan berdasarkan kesepakatan bersama antara peserta dan pengajar baik untuk kelas tatap muka (offline) maupun online.';
      } else if (q.includes('pengajar lain') || q.includes('masa depan') || q.includes('inggris') || q.includes('saudi') || q.includes('ammiyah') || q.includes('dialek') || q.includes('teluk') || q.includes('timur tengah') || q.includes('عامية') || q.includes('سعودية')) {
        reply = 'Tentu saja, ke depannya akan ada pengajar untuk bahasa Inggris, bahasa Arab, dan bahasa lainnya. Kami juga menyediakan program pelatihan bahasa Arab dialek \'ammiyah (percakapan harian) bagi yang ingin bekerja di kawasan Teluk, khususnya Arab Saudi.';
      } else if (q.includes('offline') || q.includes('tatap muka') || q.includes('tempat') || q.includes('lokasi') || q.includes('bogor') || q.includes('metode') || q.includes('حضوري') || q.includes('مكان')) {
        reply = 'Untuk kelas offline, waktu dan lokasi tertentu akan ditentukan bersama, baik di tempat sewa khusus maupun ruang publik yang kondusif di Bogor/Jabodetabek, di mana peserta berkumpul bersama pengajar untuk melangsungkan sesi pembelajaran secara langsung.';
      } else if (q.includes('zoom') || q.includes('online') || q.includes('أونلاين')) {
        reply = 'Pembelajaran online diselenggarakan via aplikasi Zoom Meeting secara interaktif dengan durasi 70 menit per sesi, dilengkapi latihan harian rutin serta grup pendampingan.';
      } else {
        reply = 'Terima kasih atas pertanyaan Anda. Kursus bahasa Arab bersama Osama Alkhatib menyediakan kelas online via Zoom dan offline tatap muka langsung dengan jadwal fleksibel. Untuk konsultasi lebih lanjut atau penawaran khusus kelompok, silakan hubungi WhatsApp di 085971641149.';
      }

      setAiAnswer({ query, response: reply });
      setIsAnswering(false);
    }, 350);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    generateAiAnswer(userQuery);
  };

  const quickPrompts = [
    'Apa kurikulum yang digunakan?',
    'Bagaimana cara mendapatkan materi / kurikulumnya?',
    'Bisa daftar berdua/bertiga bersama teman?',
    'Apakah ada kelas reguler 15-20 orang?',
    'Siapakah pengajarnya?',
    'Apakah jadwal belajar bisa fleksibel?',
    'Apakah ada bahasa dialek ammiyah & Saudi?',
    'Bagaimana metode kelas offline?'
  ];

  return (
    <section id="ai-faq-section" className="py-16 sm:py-20 bg-[#0B0F17] border-b border-amber-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Layanan Tanya AI Interaktif</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-stone-100 tracking-tight">
            Asisten AI & Konsultasi Kursus
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
            Ketik pertanyaan Anda tentang kursus, jadwal, biaya, atau klik tombol pertanyaan di bawah untuk jawaban instan.
          </p>
        </div>

        {/* Interactive AI Question Box */}
        <div className="bg-[#121826] text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-stone-950 shadow-md shadow-amber-950/40 font-bold">
                <Bot className="w-4.5 h-4.5 text-stone-950" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-100">
                  Asisten AI Kursus Bahasa Arab
                </h3>
                <p className="text-[11px] text-amber-400 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Siap Menjawab Pertanyaan Anda
                </p>
              </div>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUserQuery(prompt);
                  generateAiAnswer(prompt);
                }}
                className="text-[11px] bg-[#0B0F17] hover:bg-[#182236] active:bg-amber-950/60 text-stone-300 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-stone-800 hover:border-amber-500/40 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ketik pertanyaan Anda seputar kursus, jadwal, biaya diskon, reguler..."
              className="flex-1 bg-[#0B0F17] border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isAnswering || !userQuery.trim()}
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md shadow-amber-950/40"
            >
              {isAnswering ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
              ) : (
                <Send className="w-4 h-4 text-stone-950" />
              )}
              <span className="hidden sm:inline">Tanya</span>
            </button>
          </form>

          {/* AI Response Display */}
          {aiAnswer && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F17] border border-amber-500/30 text-stone-200 text-xs sm:text-sm space-y-2 mt-3 animate-fadeIn shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jawaban Asisten AI:</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-stone-200">
                {aiAnswer.response}
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
