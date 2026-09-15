import { ProgramTrack, TraineeRegistration, TrainingExcerpt, CommonMistake, CoachProfile } from '../types';

export const INITIAL_COACH: CoachProfile = {
  name: 'Osama Alkhatib (أسامة الخطيب)',
  title: 'Tutor Privat Bahasa Arab',
  bio: 'Tutor bahasa Arab privat untuk bimbingan online dan offline.',
  experienceYears: 10,
  studentsCount: 1500,
  hoursCompleted: 3200,
  rating: 4.98,
  email: 'asamt7252@gmail.com',
  whatsapp: '085971641149',
  location: 'Bogor & Online via Zoom',
  credentials: [
    'Tutor Privat Bahasa Arab'
  ]
};

export const INITIAL_PROGRAMS: ProgramTrack[] = [
  {
    id: 'online-6-sessions',
    title: 'Paket 6 Pertemuan Online (Privat 1-on-1)',
    subtitle: 'برنامج ست لقاءات أونلاين (فردي)',
    mode: 'online',
    category: 'online',
    format: 'individual',
    durationWeeks: 2,
    durationText: '2 Pekan (2 Minggu)',
    totalSessions: 6,
    sessionDurationMinutes: 70,
    platform: 'Aplikasi Zoom',
    originalPriceIDR: 480000,
    priceIDR: 450000,
    originalPriceDisplay: 'Rp 480.000',
    priceDisplay: 'Rp 450.000',
    discountText: 'Diskon Spesial: Hemat Rp 30.000',
    level: 'Dari Nol hingga Mahir (Semua Tingkat)',
    description: 'Bimbingan intensif 1-on-1 via Zoom selama 2 pekan. Setiap pertemuan berdurasi 70 menit, dilengkapi pelatihan rutin harian dan grup khusus untuk evaluasi berkala.',
    features: [
      '6 pertemuan tatap muka online via Zoom (70 menit per sesi)',
      'Bimbingan belajar personal 1-on-1 (تعليم فردي)',
      'Durasi program belajar: 2 pekan (2 minggu penuh)',
      'Latihan harian rutin & terarah (تدريب روتيني)',
      'Grup khusus untuk pendampingan, latihan & monitoring harian',
      'Jadwal fleksibel disesuaikan dengan agenda Anda'
    ],
    isPopular: false
  },
  {
    id: 'online-7-small-group',
    title: 'Paket 7 Pertemuan Grup Kecil Online (5 Peserta)',
    subtitle: 'برنامج سبع لقاءات أونلاين (فريق صغير)',
    mode: 'online',
    category: 'online',
    format: 'group',
    groupSize: 5,
    groupRequirementNotice: 'Kelas baru akan dimulai setelah kuota 5 peserta terpenuhi (يجب اكتمال العدد ٥ أشخاص لبدء الدفعة)',
    durationWeeks: 3,
    durationText: '3 Pekan (3 Minggu)',
    totalSessions: 7,
    sessionDurationMinutes: 70,
    platform: 'Aplikasi Zoom',
    originalPriceIDR: 450000,
    priceIDR: 350000,
    originalPriceDisplay: 'Rp 450.000',
    priceDisplay: 'Rp 350.000 / orang',
    discountText: 'Harga Hemat Tim: Rp 350.000 / orang',
    level: 'Grup Kecil Belajar (Kuota 5 Orang)',
    description: 'Bimbingan intensif interaktif via Zoom bersama kelompok kecil (5 orang). Total 7 pertemuan (@70 menit) selama 3 pekan dengan latihan harian rutin dan grup privat. Kelas akan dimulai segera setelah kuota 5 orang terpenuhi.',
    features: [
      '7 pertemuan tatap muka online via Zoom (70 menit per sesi)',
      'Format grup kecil intim (hanya 5 peserta per kelompok)',
      'Biaya hemat: Rp 350.000 per orang (بدال / للشخص الواحد)',
      'Syarat mulai: Kelas dimulai setelah kuota 5 orang lengkap (يجب اكتمال ٥ أشخاص)',
      'Durasi program belajar: 3 pekan (3 minggu penuh)',
      'Latihan muhadatsah interaktif & tanya jawab bersama teman sekelas',
      'Grup WhatsApp privat untuk tugas, rekaman, dan bimbingan harian'
    ],
    isPopular: true
  },
  {
    id: 'online-9-sessions',
    title: 'Paket 9 Pertemuan Online (Privat 1-on-1)',
    subtitle: 'برنامج تسع لقاءات أونلاين (فردي)',
    mode: 'online',
    category: 'online',
    format: 'individual',
    durationWeeks: 3,
    durationText: '3 Pekan (3 Minggu)',
    totalSessions: 9,
    sessionDurationMinutes: 70,
    platform: 'Aplikasi Zoom',
    originalPriceIDR: 720000,
    priceIDR: 680000,
    originalPriceDisplay: 'Rp 720.000',
    priceDisplay: 'Rp 680.000',
    discountText: 'Diskon Spesial: Hemat Rp 40.000',
    level: 'Dari Nol hingga Mahir (Semua Tingkat)',
    description: 'Program bimbingan terarah selama 3 pekan via Zoom. 70 menit setiap pertemuan, fokus pada penguasaan berbicara aktif, makhraj, dan pendampingan di grup privat.',
    features: [
      '9 pertemuan tatap muka online via Zoom (70 menit per sesi)',
      'Bimbingan belajar personal 1-on-1 (تعليم فردي)',
      'Durasi program belajar: 3 pekan (3 minggu penuh)',
      'Latihan harian rutin & terarah (تدريب روتيني)',
      'Grup khusus untuk pendampingan, latihan & monitoring harian',
      'Koreksi pelafalan secara real-time dan evaluasi berkala'
    ],
    isPopular: false
  },
  {
    id: 'online-14-sessions',
    title: 'Paket 14 Pertemuan Online (Privat 1-on-1)',
    subtitle: 'برنامج 14 لقاء أونلاين (فردي)',
    mode: 'online',
    category: 'online',
    format: 'individual',
    durationWeeks: 4,
    durationText: '1 Bulan Penuh (4 Pekan)',
    totalSessions: 14,
    sessionDurationMinutes: 70,
    platform: 'Aplikasi Zoom',
    originalPriceIDR: 1120000,
    priceIDR: 1080000,
    originalPriceDisplay: 'Rp 1.120.000',
    priceDisplay: 'Rp 1.080.000',
    discountText: 'Diskon Spesial: Hemat Rp 40.000',
    level: 'Dari Nol hingga Mahir (Semua Tingkat)',
    description: 'Program bimbingan komprehensif selama 1 bulan penuh. 14 pertemuan @ 70 menit via Zoom untuk melatih kefasihan berbicara, tata bahasa praktis, dan pengawasan intensif di grup privat.',
    features: [
      '14 pertemuan tatap muka online via Zoom (70 menit per sesi)',
      'Bimbingan belajar personal 1-on-1 (تعليم فردي)',
      'Durasi program belajar: 1 bulan penuh (4 pekan intensif)',
      'Latihan harian rutin & terarah (تدريب روتيني)',
      'Grup khusus untuk pendampingan, latihan & monitoring harian',
      'Evaluasi kemajuan mingguan terstruktur'
    ],
    isPopular: false
  },
  {
    id: 'offline-private-1on1',
    title: 'Paket Privat 1-on-1 Offline (1 Guru 1 Murid)',
    subtitle: 'خيار خاص (أستاذ مع طالب واحد)',
    mode: 'offline',
    category: 'offline',
    offlineType: 'private-1on1',
    durationWeeks: 5,
    durationText: '~1 Bulan Lebih (2x Pertemuan / Pekan)',
    totalSessions: 8,
    sessionDurationMinutes: 70,
    platform: 'Tatap Muka Langsung (Bogor)',
    priceIDR: 1800000,
    priceDisplay: 'Rp 1.800.000',
    level: 'Semua Tingkat (Dari Nol - Lanjutan)',
    locationNote: 'Khusus hanya untuk wilayah Bogor dan sekitarnya (فقط لمناطق بوجور وما حولها)',
    description: 'Bimbingan tatap muka langsung secara privat eksklusif 1 guru 1 murid bersama Osama Alkhatib di Bogor. Total 8 pertemuan (@70 menit), 2 pertemuan setiap pekan (~1 bulan lebih), dilengkapi grup online mingguan untuk tugas dan evaluasi rutin.',
    features: [
      'Privat eksklusif 1 Guru 1 Murid (Tatap Muka Langsung)',
      'Total 8 pertemuan tatap muka (@70 menit setiap sesi)',
      'Jadwal 2 pertemuan setiap pekan (total ~1 bulan lebih)',
      'Mutiara bimbingan & tugas mingguan di grup online (متابعة أسبوعية أونلاين)',
      'Khusus hanya untuk wilayah Bogor dan sekitarnya',
      'Pendampingan talaqqi makharijul huruf langsung dari organ bicara',
      'Jadwal dan tempat pertemuan disepakati bersama secara fleksibel'
    ],
    isPopular: true
  },
  {
    id: 'offline-small-group',
    title: 'Paket Grup Kecil Offline (5 Peserta)',
    subtitle: 'خيار فريق صغير (٥ أشخاص)',
    mode: 'offline',
    category: 'offline',
    offlineType: 'small-group',
    durationWeeks: 5,
    durationText: '~1 Bulan Lebih (2x Pertemuan / Pekan)',
    totalSessions: 8,
    sessionDurationMinutes: 70,
    platform: 'Tatap Muka Langsung (Bogor)',
    priceIDR: 1200000,
    priceDisplay: 'Rp 1.200.000 / orang',
    level: 'Kelompok Belajar Kecil (5 Orang)',
    locationNote: 'Khusus hanya untuk wilayah Bogor dan sekitarnya (فقط لمناطق بوجور وما حولها)',
    description: 'Belajar tatap muka langsung bersama grup kecil (5 orang) di Bogor. Total 8 pertemuan (@70 menit), 2 pertemuan setiap pekan (~1 bulan lebih), dilengkapi grup online mingguan untuk tugas dan monitoring.',
    features: [
      'Format grup kecil intim (hanya 5 peserta)',
      'Total 8 pertemuan tatap muka (@70 menit setiap sesi)',
      'Jadwal 2 pertemuan setiap pekan (total ~1 bulan lebih)',
      'Mutiara bimbingan & tugas mingguan di grup online (متابعة أسبوعية أونلاين)',
      'Khusus hanya untuk wilayah Bogor dan sekitarnya',
      'Latihan dialog & muhadatsah interaktif antar anggota kelompok',
      'Biaya lebih hemat (Rp 1.200.000 per orang)'
    ],
    isPopular: false
  }
];

export const INITIAL_REGISTRATIONS: TraineeRegistration[] = [
  {
    id: 'REG-2026-1042',
    fullName: 'Ahmad Fauzi Rahman',
    email: 'ahmad.fauzi@gmail.com',
    phone: '+6281234567891',
    country: 'Indonesia (Jakarta)',
    programId: 'online-9-sessions',
    programTitle: 'Paket 9 Pertemuan Online',
    mode: 'online',
    format: 'individual',
    currentLevel: 'beginner',
    goals: 'Ingin belajar dari nol dan lancar berbicara bahasa Arab fusha via Zoom.',
    preferredTime: 'Malam (19.30 - 21.00 WIB)',
    status: 'confirmed',
    registeredAt: '2026-09-06T14:30:00Z',
    coachNotes: 'Peserta pemula, antusiasme tinggi. Jadwal disepakati tiap Selasa & Kamis malam.',
    diagnosticScore: 80
  },
  {
    id: 'REG-2026-1038',
    fullName: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@yahoo.com',
    phone: '+6285712345678',
    country: 'Indonesia (Bogor)',
    programId: 'offline-private-1on1',
    programTitle: 'Paket Privat 1-on-1 Offline (1 Guru 1 Murid)',
    mode: 'offline',
    format: 'individual',
    offlineType: 'private-1on1',
    currentLevel: 'intermediate',
    goals: 'Memperbaiki makharijul huruf langsung tatap muka di wilayah Bogor.',
    preferredTime: 'Akhir Pekan (Sabtu Pagi)',
    status: 'new',
    registeredAt: '2026-09-05T09:15:00Z',
    paymentMethod: 'Transfer Bank BCA',
    senderAccountName: 'Siti Nurhaliza',
    paymentProofImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="650" viewBox="0 0 500 650"><rect width="500" height="650" rx="20" fill="%23003399"/><rect x="15" y="15" width="470" height="620" rx="16" fill="%23ffffff"/><circle cx="250" cy="80" r="32" fill="%23009944"/><path d="M236 80l10 10 20-20" stroke="%23ffffff" stroke-width="5" fill="none" stroke-linecap="round"/><text x="250" y="140" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="%23003399" text-anchor="middle">m-Transfer BERHASIL</text><text x="250" y="165" font-family="Arial,sans-serif" font-size="13" fill="%23666666" text-anchor="middle">05/09/2026 09:12:45 WIB</text><line x1="40" y1="185" x2="460" y2="185" stroke="%23e0e0e0" stroke-width="1.5"/><text x="45" y="220" font-family="Arial,sans-serif" font-size="13" fill="%23888888">Nomor Rekening Tujuan</text><text x="45" y="242" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="%23222222">1971260489 (BCA)</text><text x="45" y="280" font-family="Arial,sans-serif" font-size="13" fill="%23888888">Nama Penerima</text><text x="45" y="302" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="%23003399">OSAMA ALKHATIB</text><text x="45" y="340" font-family="Arial,sans-serif" font-size="13" fill="%23888888">Jumlah Transfer</text><text x="45" y="365" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="%23009944">Rp 1.800.000,00</text><text x="45" y="405" font-family="Arial,sans-serif" font-size="13" fill="%23888888">Nama Pengirim</text><text x="45" y="427" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="%23222222">SITI NURHALIZA</text><text x="45" y="465" font-family="Arial,sans-serif" font-size="13" fill="%23888888">Berita / Catatan</text><text x="45" y="487" font-family="Arial,sans-serif" font-size="14" fill="%23333333">Kursus Privat Tatap Muka Bogor</text><rect x="40" y="525" width="420" height="70" rx="10" fill="%23f4f7fc"/><text x="250" y="555" font-family="Arial,sans-serif" font-size="12" fill="%23003399" text-anchor="middle" font-weight="bold">BUKTI RESMI TRANSAKSI ELEKTRONIK</text><text x="250" y="575" font-family="Arial,sans-serif" font-size="11" fill="%23777777" text-anchor="middle">No. Referensi: BCA-20260905-992147</text></svg>',
    coachNotes: 'Peserta berdomisili di Bogor Kota, konfirmasi tempat pertemuan di rumah/kafe ramah belajar.'
  },
  {
    id: 'REG-2026-1035',
    fullName: 'Muhammad Rizky Pratama',
    email: 'rizky.pratama@gmail.com',
    phone: '+6281399887766',
    country: 'Indonesia (Bogor)',
    programId: 'offline-small-group',
    programTitle: 'Paket Grup Kecil Offline (5 Peserta)',
    mode: 'offline',
    format: 'group',
    offlineType: 'small-group',
    teamBatch: 1,
    currentLevel: 'beginner',
    goals: 'Belajar bersama kelompok kecil tatap muka di Bogor.',
    preferredTime: 'Sore (16.00 - 17.30 WIB)',
    status: 'confirmed',
    registeredAt: '2026-09-04T10:00:00Z',
    coachNotes: 'Anggota kelompok offline Bogor.'
  },
  {
    id: 'REG-2026-1036',
    fullName: 'Dewi Anggraini',
    email: 'dewi.anggraini@gmail.com',
    phone: '+6281244556677',
    country: 'Indonesia (Bogor)',
    programId: 'offline-small-group',
    programTitle: 'Paket Grup Kecil Offline (5 Peserta)',
    mode: 'offline',
    format: 'group',
    offlineType: 'small-group',
    teamBatch: 1,
    currentLevel: 'beginner',
    goals: 'Ingin memperlancar percakapan bersama teman sekelompok di Bogor.',
    preferredTime: 'Sore (16.00 - 17.30 WIB)',
    status: 'confirmed',
    registeredAt: '2026-09-04T11:20:00Z',
    coachNotes: 'Anggota kelompok offline Bogor.'
  },
  {
    id: 'REG-2026-1037',
    fullName: 'Faisal Akbar',
    email: 'faisal.akbar@outlook.com',
    phone: '+6285677889900',
    country: 'Indonesia (Bogor)',
    programId: 'offline-small-group',
    programTitle: 'Paket Grup Kecil Offline (5 Peserta)',
    mode: 'offline',
    format: 'group',
    offlineType: 'small-group',
    teamBatch: 1,
    currentLevel: 'intermediate',
    goals: 'Ingin latihan muhadatsah aktif dan tugas mingguan di Bogor.',
    preferredTime: 'Sore (16.00 - 17.30 WIB)',
    status: 'confirmed',
    registeredAt: '2026-09-04T14:45:00Z',
    coachNotes: 'Anggota kelompok offline Bogor.'
  }
];

export const TRAINING_EXCERPTS: TrainingExcerpt[] = [
  {
    id: 'excerpt-1',
    title: 'Nasihat Ibnu Al-Muqaffa tentang Seni Bertutur Kata',
    category: 'Prosa & Retorika Fusha',
    difficulty: 'Menengah',
    textWithTashkeel: '«إِذَا حَدَّثْتَ فَلَا تُكْثِرِ الإِشَارَةَ بِيَدِكَ، وَلَا تَمُدَّنَّ صَوْتَكَ مَدّاً يُثْقِلُ السَّامِعَ، وَتَخَيَّرْ مِنَ الكَلَامِ أَوْضَحَهُ مَخْرَجاً وَأَنْبَلَهُ مَعْنَىً، فَإِنَّ الفَصَاحَةَ سِلَاحُ العَقْلِ وَزِينَةُ المَنْطِقِ.»',
    plainText: 'إذا حدثت فلا تكثر الإشارة بيدك، ولا تمدن صوتك مدا يثقل السامع، وتخير من الكلام أوضحه مخرجا وأنبله معنى، فإن الفصاحة سلاح العقل وزينة المنطق.',
    translationID: '"Apabila engkau berbicara, jangan terlalu banyak menggerakkan tanganmu, jangan memanjangkan suaramu berlebihan hingga memberatkan pendengar. Pilihlah kata yang paling jelas makhrajnya dan paling mulia maknanya; sesungguhnya kefasihan lisan adalah senjata akal dan perhiasan logika."',
    linguisticNotes: [
      'Perhatikan pembacaan huruf Ra\' tarqiq (tipis) pada "تُكْثِرِ الإِشَارَةَ" karena pertemuan dua sukun',
      'Fokus artikulasi makhraj halq: Ha\' pada "حَدَّثْتَ" dan \'Ain pada "العَقْلِ"',
      'Teknik waqaf (berhenti) dengan sukun di akhir kalimat secara alami'
    ]
  },
  {
    id: 'excerpt-2',
    title: 'Mahakarya Al-Mutanabbi: Kemuliaan Jiwa dan Keagungan Cita',
    category: 'Puisi Klasik (Syi\'ir)',
    difficulty: 'Lanjutan',
    textWithTashkeel: '«عَلَى قَدْرِ أَهْلِ العَزْمِ تَأْتِي العَزَائِمُ ... وَتَأْتِي عَلَى قَدْرِ الكِرَامِ المَكَارِمُ\nوَتَعْظُمُ فِي عَيْنِ الصَّغِيرِ صِغَارُهَا ... وَتَصْغُرُ فِي عَيْنِ العَظِيمِ العَظَائِمُ»',
    plainText: 'على قدر أهل العزم تأتي العزائم ... وتأتي على قدر الكرام المكارم\nوتعظم في عين الصغير صغارها ... وتصغر في عين العظيم العظائم',
    translationID: '"Sesuai kadar tekad para pemilik tekad, datanglah pencapaian-pencapaian agung; dan sesuai kemuliaan orang-orang mulia, terlaksanalah kebajikan-kebajikan besar. Suatu perkara kecil akan tampak besar di mata orang berjiwa kerdil, namun perkara besar akan tampak kecil di mata orang berjiwa agung."',
    linguisticNotes: [
      'Irama Bahr Thawil: Fa\'ūlun Mafā\'īlun Fa\'ūlun Mafā\'ilun',
      'Keseimbangan balaghah muqabalah antara "تعظم" dan "تصغر", serta "الصغير" dan "العظيم"',
      'Pelafalan huruf Dzhā (ظ) tebal (muthbaq) pada kata "العَظِيمِ" dan "العَظَائِمُ"'
    ]
  },
  {
    id: 'excerpt-3',
    title: 'Teks Berita Penyiaran: Melatih Intonasi & Ritme Siaran',
    category: 'Public Speaking & Media',
    difficulty: 'Menengah',
    textWithTashkeel: '«أَهْلاً بِكُمْ؛ نُحَيِّيكُمْ فِي هَذِهِ النَّشْرَةِ الإِخْبَارِيَّةِ المُوجَزَةِ. تُشِيرُ آخِرُ التَّطَوُّرَاتِ إِلَى إِطْلَاقِ مُبَادَرَةٍ شَامِلَةٍ؛ لِتَعْزِيزِ اللُّغَةِ فِي المَحَافِلِ الدَّوْلِيَّةِ وَصَقْلِ مَهَارَاتِ الجِيلِ الصَّاعِدِ.»',
    plainText: 'أهلاً بكم؛ نحييكم في هذه النشرة الإخبارية الموجزة. تشير آخر التطورات إلى إطلاق مبادرة شاملة؛ لتعزيز اللغة في المحافل الدولية وصقل مهارات الجil الصاعد.',
    translationID: '"Selamat datang; kami menyapa Anda dalam siaran warta berita ringkas ini. Perkembangan terkini menunjukkan diluncurkannya inisiatif komprehensif guna memperkuat posisi bahasa Arab di forum internasional dan mengasah kecakapan generasi masa depan."',
    linguisticNotes: [
      'Ambil nafas diafragma yang tenang sebelum membuka salam',
      'Penekanan intonasi nabr pada kata "المُوجَزَةِ" untuk memperjelas konteks berita singkat',
      'Jeda sejenak pada titik koma (فاصلة منقوطة) sebelum kalimat penjelasan sebab-akibat'
    ]
  },
  {
    id: 'excerpt-4',
    title: 'Percakapan Ta\'aruf Ramah untuk Pemula',
    category: 'Muhadatsah Sehari-hari',
    difficulty: 'Pemula',
    textWithTashkeel: '«صَبَاحُ الخَيْرِ. أَنَا سَعِيدٌ جِدّاً بِلِقَائِكَ اليَوْمَ. هَلْ يُمْكِنُنَا أَنْ نَتَحَدَّثَ بِاللُّغَةِ العَرَبِيَّةِ الفُصْحَى؟ أُرِيدُ أَنْ أُطَوِّرَ مَهَارَاتِي فِي التَّحَدُّثِ وَالاسْتِمَاعِ.»',
    plainText: 'صباح الخير. أنا سعيد جدا بلقائك اليوم. هل يمكننا أن نتحدث باللغة العربية الفصحى؟ أريد أن أطور مهاراتي في التحدث والاستماع.',
    translationID: '"Selamat pagi. Saya sangat senang berjumpa dengan Anda hari ini. Bisakah kita berbicara dalam bahasa Arab Fusha? Saya ingin mengembangkan kemampuan berbicara dan menyimak saya."',
    linguisticNotes: [
      'Pelafalan tanwin yang jelas pada "سَعِيدٌ" dan "جِدّاً"',
      'Menyambung hamzah washal pada "وَالاسْتِمَاعِ" (wal-istimā\') tanpa terputus',
      'Latihan artikulasi ritme sedang dan kejernihan vokal'
    ]
  }
];

export const COMMON_MISTAKES: CommonMistake[] = [
  {
    id: 'm1',
    wrong: 'مبروك عليك التخرج (Mabrūk \'alaika)',
    correct: 'مباركٌ عليكَ التخرّج (Mubārakun \'alaika)',
    reason: 'Kata "مبروك" berasal dari baraka al-ba\'ir (unta menderum dan berdiam). Sedangkan ucapan selamat berasal dari bāraka yubāriku, isim maf\'ul-nya adalah "مُبَارَك" (semoga diberkahi).',
    example: 'مباركٌ لكم هذا الإنجاز المستحق. (Selamat dan berkah atas pencapaian Anda yang luar biasa).'
  },
  {
    id: 'm2',
    wrong: 'تَمَّ توقيعُ الاتفاقيةِ من قِبَلِ الوزيرِ (Tamma min qibali...)',
    correct: 'وقَّعَ الوزيرُ الاتفاقيةَ (Waqqa\'a al-wazīr)',
    reason: 'Pola "tamma... min qibali" adalah terjemahan harfiah dari konstruksi pasif bahasa asing (done by...). Kaidah bahasa Arab yang fasih langsung menempatkan fi\'il aktif kepada fa\'ilnya.',
    example: 'وقّع المديرُ العقدَ صباح اليوم. (Direktur telah menandatangani kontrak pagi ini).'
  },
  {
    id: 'm3',
    wrong: 'هذا أمرٌ ملفتٌ للانتباه (Mulfit)',
    correct: 'هذا أمرٌ لافتٌ للنظر / للانتباه (Lāfit)',
    reason: 'Kata kerja dasarnya adalah "Lafata" (ثلاثي), sehingga isim fa\'il-nya adalah "لافت" (Lāfit), bukan "ملفت" yang merupakan bentuk non-standar dalam kaidah fusha.',
    example: 'قدّمَ الباحثُ فكرةً لافتةً للأنظار. (Peneliti menyampaikan gagasan yang memikat perhatian).'
  },
  {
    id: 'm4',
    wrong: 'ينبغي عليكَ الحضورُ مبكراً (Yanbaghī \'alaika)',
    correct: 'ينبغي لكَ الحضورُ مبكراً (Yanbaghī laka)',
    reason: 'Fi\'il "ينبغي" (sepatutnya/hendaknya) berta\'addi dengan huruf jar Lam (لـِ), sebagaimana terdapat dalam Al-Qur\'an: {وَمَا يَنبَغِي لَهُمْ}.',
    example: 'ينبغي للطالبِ أن يواظبَ على الحضور. (Hendaknya bagi siswa untuk tekun hadir).'
  },
  {
    id: 'm5',
    wrong: 'على كافّةِ الأصعدة (Ala kaffati...)',
    correct: 'على الصعدِ كافّةً (Ala ash-shu\'udi kaffatan)',
    reason: 'Kata "كافة" berkedudukan sebagai Haal yang mengikuti kata sebelumnya (manshub), bukan diidhafahkan di awal. Bentuk jamak dari صعيد adalah صُعُد.',
    example: 'حققتِ الدورةُ نجاحاً على المستوياتِ كافّةً. (Program kursus meraih keberhasilan di seluruh tingkatan).'
  },
  {
    id: 'm6',
    wrong: 'تواجدَ الطلابُ في القاعة (Tawājada at-tullāb)',
    correct: 'حضرَ الطلابُ / وُجِدَ الطلابُ (Hadhara at-tullāb)',
    reason: '"التواجد" dalam leksikon bahasa Arab bermakna rasa cinta yang menggelora atau kesedihan mendalam (wajd). Sedangkan kehadiran fisik di suatu tempat menggunakan kata "حَضَرَ" atau "وُجِدَ".',
    example: 'حضرَ جميعُ المتدربين في القاعة الافتراضية. (Seluruh peserta hadir di ruang kelas virtual).'
  }
];
