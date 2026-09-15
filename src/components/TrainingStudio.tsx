import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Square, Sparkles, CheckCircle2, AlertCircle, Info, BookOpen, Layers } from 'lucide-react';
import { TrainingExcerpt } from '../types';
import { TRAINING_EXCERPTS } from '../data/initialData';

interface TrainingStudioProps {
  onOpenRegister: () => void;
}

export const TrainingStudio: React.FC<TrainingStudioProps> = ({ onOpenRegister }) => {
  const [activeTab, setActiveTab] = useState<'reading' | 'articulation'>('reading');
  const [selectedExcerpt, setSelectedExcerpt] = useState<TrainingExcerpt>(TRAINING_EXCERPTS[0]);
  
  // Speech Synthesis state
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  // Trainee Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordError, setRecordError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Letter Articulation Atlas state
  const [selectedLetterGroup, setSelectedLetterGroup] = useState<string>('halq');

  // Clean up audio & recording on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  // Audio Playback using SpeechSynthesis for Arabic
  const handlePlayTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda belum mendukung fitur text-to-speech otomatis.');
      return;
    }

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedExcerpt.textWithTashkeel || selectedExcerpt.plainText);
    utterance.lang = 'ar-SA';
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      setIsPlayingTTS(false);
    };

    utterance.onerror = () => {
      setIsPlayingTTS(false);
    };

    setIsPlayingTTS(true);
    window.speechSynthesis.speak(utterance);
  };

  // Trainee voice recording handler
  const startRecording = async () => {
    setRecordError(null);
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setRecordError('Gagal mengakses mikrofon. Pastikan Anda mengizinkan akses mic di browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  // Articulation Atlas Data in Indonesian
  const articulationGroups = [
    {
      id: 'halq',
      title: 'Huruf Halq (Tenggorokan - الحلق)',
      letters: 'ء - هـ | ع - ح | غ - خ',
      description: 'Keluar dari kedalaman pangkal, tengah, hingga ujung tenggorokan. Kekeliruan paling umum adalah bunyi Haa\' (هـ) yang lemah atau suara Haa\' (ح) yang kurang bersih desisnya.',
      sampleWords: ['الحَمْدُ', 'العِلْمُ', 'أَهْلاً', 'خَيْرٌ', 'غَفُورٌ'],
      practiceTip: 'Letakkan jari Anda secara lembut di tenggorokan untuk merasakan getaran pita suara saat melafalkan huruf \'Ain (ع) dan Haa (ح).'
    },
    {
      id: 'lisan-deep',
      title: 'Pangkal & Tengah Lidah (أقصى ووسط اللسان)',
      letters: 'ق | ك | ج - ش - ي | ض',
      description: 'Huruf Qaf keluar dari pangkal lidah beradu dengan langit-langit lunak (bersifat tebal/isti\'la). Huruf Dhad (ض) keluar dari tepi lidah dan merupakan kekhasan bahasa Arab.',
      sampleWords: ['القُوَّةُ', 'الكِتَابُ', 'الضَّيَاءُ', 'الجَمَالُ', 'الشَّمْسُ'],
      practiceTip: 'Hindari mengganti huruf Qaf dengan Hamzah atau Ghain. Tahan hembusan udara sesaat lalu lepaskan dengan suara mantap.'
    },
    {
      id: 'asliyah',
      title: 'Huruf Desis & Ujung Lidah (حروف الصفير)',
      letters: 'ص | س | ز',
      description: 'Keluar dari ujung lidah berhadapan dengan pangkal gigi seri bawah. Memiliki desis tajam alami (shafir). Huruf Shad (ص) memiliki sifat tebal (isti\'la & ithbaq), sedangkan Sin (س) tipis.',
      sampleWords: ['الصِّدْقُ', 'السَّلَامُ', 'الزَّهْرَةُ', 'المَصِيرُ', 'السَّبِيلُ'],
      practiceTip: 'Jaga ujung lidah agar tidak terdorong keluar dari gigi seri, dan rasakan aliran desis udara yang rapi.'
    },
    {
      id: 'shafawiyah',
      title: 'Huruf Dua Bibir & Ujung Lidah (الشفتان والذلق)',
      letters: 'ف | ب | م | و | ر | ن | ل',
      description: 'Karakter artikulasi cepat dan lincah dari bibir dan tepi lidah. Untuk huruf Ra\' (ر), hindari getaran berulang-ulang berlebihan; cukup satu getaran lentur alami.',
      sampleWords: ['الفَصَاحَةُ', 'البَيَانُ', 'المَنْطِقُ', 'الرَّحْمَةُ'],
      practiceTip: 'Latihan pengucapan Ra\': ucapkan "IR... IR..." dengan sentuhan ujung lidah ringan ke langit-langit keras tanpa menegangkan rahang.'
    }
  ];

  return (
    <div id="training-studio-section" className="py-12 sm:py-16 bg-white min-h-screen border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Studio Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
            <Mic className="w-3.5 h-3.5 text-amber-700" />
            <span>Studio Interaktif Pelatihan Praktik</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Laboratorium Artikulasi Arab & Makharijul Huruf
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Latih bacaan fusha Anda, dengarkan contoh pelafalan model berharakat lengkap, dan rekam audio suara Anda untuk evaluasi akurasi makhraj.
          </p>

          {/* Sub Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              id="studio-tab-reading"
              onClick={() => setActiveTab('reading')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'reading'
                  ? 'bg-indigo-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Membaca Teks & Rekam Suara</span>
            </button>

            <button
              id="studio-tab-articulation"
              onClick={() => setActiveTab('articulation')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'articulation'
                  ? 'bg-indigo-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Atlas Makharijul Huruf Hijaiyyah</span>
            </button>
          </div>
        </div>

        {activeTab === 'reading' ? (
          /* Reading & Voice Recording Studio */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Excerpt Selector Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                Pilih Teks Latihan:
              </p>
              {TRAINING_EXCERPTS.map((excerpt) => (
                <div
                  key={excerpt.id}
                  id={`select-excerpt-${excerpt.id}`}
                  onClick={() => {
                    if (isPlayingTTS) {
                      window.speechSynthesis.cancel();
                      setIsPlayingTTS(false);
                    }
                    setSelectedExcerpt(excerpt);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all text-left ${
                    selectedExcerpt.id === excerpt.id
                      ? 'bg-indigo-50/90 border-indigo-600 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                      {excerpt.category}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      excerpt.difficulty === 'Pemula' ? 'bg-green-100 text-green-800' :
                      excerpt.difficulty === 'Menengah' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {excerpt.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    {excerpt.title}
                  </h4>
                </div>
              ))}

              {/* Coach Consultation Callout */}
              <div className="bg-indigo-900 text-white p-5 rounded-2xl mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                  <span className="text-xs font-bold text-indigo-200">
                    Perlu Bimbingan Suara 1-on-1?
                  </span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">
                  Dalam sesi privat, Osama Alkhatib akan mengoreksi rekaman bacaan Anda kalimat demi kalimat dan melatih pernafasan diafragma yang tepat.
                </p>
                <button
                  onClick={onOpenRegister}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-sm"
                >
                  Daftar untuk Sesi Evaluasi Langsung
                </button>
              </div>
            </div>

            {/* Studio Workspace */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Practice Board with Tashkeel */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div>
                    <span className="text-xs text-stone-500 font-semibold">{selectedExcerpt.category}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                      {selectedExcerpt.title}
                    </h3>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center gap-3">
                    {/* Speed selector */}
                    <div className="flex items-center gap-1 text-xs bg-white border border-stone-200 rounded-lg p-1">
                      <span className="text-stone-400 px-1">Tempo:</span>
                      <button
                        onClick={() => setSpeechRate(0.75)}
                        className={`px-2 py-0.5 rounded font-bold ${speechRate === 0.75 ? 'bg-indigo-800 text-white' : 'text-stone-600'}`}
                      >
                        0.7x
                      </button>
                      <button
                        onClick={() => setSpeechRate(0.9)}
                        className={`px-2 py-0.5 rounded font-bold ${speechRate === 0.9 ? 'bg-indigo-800 text-white' : 'text-stone-600'}`}
                      >
                        Normal
                      </button>
                    </div>

                    {/* Play/Stop TTS */}
                    <button
                      id="tts-play-btn"
                      onClick={handlePlayTTS}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isPlayingTTS
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-indigo-800 hover:bg-indigo-900 text-white'
                      }`}
                    >
                      {isPlayingTTS ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Hentikan Suara</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Dengar Pelafalan Model</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tashkeel Text Box (Arabic text centered/RTL with Amiri font) */}
                <div className="my-6 py-5 px-4 sm:px-6 bg-white rounded-xl border border-stone-200 shadow-inner">
                  <p className="text-xl sm:text-2xl lg:text-3xl leading-[2.3] sm:leading-[2.5] font-['Amiri',serif] text-stone-900 text-right select-all" dir="rtl">
                    {selectedExcerpt.textWithTashkeel}
                  </p>
                </div>

                {/* Indonesian Translation */}
                {selectedExcerpt.translationID && (
                  <div className="mb-5 p-4 bg-stone-100/80 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    <span className="font-bold text-stone-900 block mb-1">Terjemahan Teks:</span>
                    <p className="italic">{selectedExcerpt.translationID}</p>
                  </div>
                )}

                {/* Linguistic coach notes */}
                <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4 text-left">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs sm:text-sm mb-2">
                    <Info className="w-4 h-4 text-indigo-700" />
                    <span>Catatan Bimbingan Instruktur Saat Membaca:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-indigo-950">
                    {selectedExcerpt.linguisticNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Trainee Microphone Recording & Playback Station */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Stasiun Rekam & Evaluasi Suara Mandiri</h4>
                      <p className="text-xs text-stone-500">Baca teks di atas dengan suara Anda lalu dengarkan untuk memeriksa ketepatan makhraj</p>
                    </div>
                  </div>

                  {/* Recording Timer */}
                  {isRecording && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-mono font-bold rounded-full animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span>00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                    </div>
                  )}
                </div>

                {recordError && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{recordError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {!isRecording ? (
                    <button
                      id="start-record-btn"
                      onClick={startRecording}
                      className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs"
                    >
                      <Mic className="w-4 h-4" />
                      <span>{recordedAudioUrl ? 'Rekam Ulang Suara Anda' : 'Mulai Rekam Suara Sekarang'}</span>
                    </button>
                  ) : (
                    <button
                      id="stop-record-btn"
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 animate-pulse"
                    >
                      <Square className="w-4 h-4" />
                      <span>Hentikan & Simpan Rekaman</span>
                    </button>
                  )}

                  {recordedAudioUrl && !isRecording && (
                    <div className="flex-1 min-w-[240px] flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200">
                      <audio
                        controls
                        src={recordedAudioUrl}
                        className="w-full h-9"
                      />
                    </div>
                  )}
                </div>

                {recordedAudioUrl && !isRecording && (
                  <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
                    <span className="text-indigo-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Rekaman suara Anda berhasil tersimpan di browser
                    </span>
                    <button
                      onClick={onOpenRegister}
                      className="text-stone-700 hover:text-indigo-800 font-bold underline text-left"
                    >
                      Daftar kursus untuk bedah audio mendalam bersama instruktur →
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          /* Letter Articulation Atlas (Atlas Makharijul Huruf) */
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {articulationGroups.map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => setSelectedLetterGroup(grp.id)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    selectedLetterGroup === grp.id
                      ? 'bg-indigo-800 text-white border-indigo-800 shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="text-lg font-black font-['Amiri',serif] mb-1">
                    {grp.letters}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {grp.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Group Detail */}
            {(() => {
              const currentGroup = articulationGroups.find(g => g.id === selectedLetterGroup) || articulationGroups[0];
              return (
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
                  
                  <div className="border-b border-stone-200 pb-4">
                    <div className="text-3xl font-black text-indigo-800 font-['Amiri',serif] mb-2" dir="rtl">
                      {currentGroup.letters}
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">
                      {currentGroup.title}
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      {currentGroup.description}
                    </p>
                  </div>

                  {/* Practice Words */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                      Contoh Kata untuk Latihan Artikulasi:
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {currentGroup.sampleWords.map((word, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-lg font-bold font-['Amiri',serif] text-stone-900 shadow-xs flex items-center gap-2"
                        >
                          <span dir="rtl">{word}</span>
                          <button
                            onClick={() => {
                              if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                                const u = new SpeechSynthesisUtterance(word);
                                u.lang = 'ar-SA';
                                u.rate = 0.8;
                                window.speechSynthesis.speak(u);
                              }
                            }}
                            className="text-stone-400 hover:text-indigo-700 p-1"
                            title="Dengarkan pengucapan"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practice Tip */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Tips Latihan Mandiri dari Instruktur: </span>
                      <span>{currentGroup.practiceTip}</span>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        )}

      </div>
    </div>
  );
};
