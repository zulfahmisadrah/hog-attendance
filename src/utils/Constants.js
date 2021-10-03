export const BASE_URL = "http://localhost:8000/";
export const BASE_API_URL = `${BASE_URL}api/`;
export const BASE_API_AUTH_URL = `${BASE_URL}api/auth/`;
export const APP_NAME = "NEO ATTENDANCE";

export const listLetters = ['a', 'b', 'c', 'd', 'e'];
export const dateFormat = "YYYY-MM-DD";
export const timeFormat = "HH:mm:ss";
export const dateTimeFormat = "YYYY-MM-DD HH:mm:ss Z";
export const scheduleFormat = "DD/MM/YYYY HH:mm Z";
export const dateTextFormat = "dddd, DD MMMM YYYY";
export const timeTextFormat = "HH:mm";
export const dateTimeTextFormat = "dddd, DD MMMM YYYY HH:mm";
export const dateTimeISOFormat = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";
export const dateTimeIdFormat = "YYYYMMDD_HHmmss";

export const DB_USERS = "users";
export const STORAGE_AVATAR = "avatar";
export const STORAGE_PREFIX_IMAGE = "IMG";

export const emailStatus = {
    verified: "Verified",
    unverified: "Unverified"
}

export const meetingStatus = {
    active: "active",
    scheduled: "scheduled",
    finished: "finished"
}

export const attendanceStatus = {
    attend: "Hadir",
    absent: "Tanpa Keterangan",
    sick: "Sakit",
    permitted: "Izin"
}

export const listRole = {
    1: "Superuser",
    2: "Admin",
    3: "Dosen",
    4: "Mahasiswa"
}

export const listEducation = {
    Sarjana: "Sarjana",
    Magister: "Magister",
    Doktor: "Doktor",
    Professor: "Professor",
}

export const CourseType = {
    WAJIB: "Wajib",
    PILIHAN: "Pilihan"
}

export const DataType = {
    TEXT: "text",
    DATETIME: "datetime",
    DATE: "date",
    TIME: "time",
    IMAGE: "image"
}

export const DayOfWeek = {
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
    7: "Minggu"
}

export const userProgram = ["Executive", "Medical", "Prestige", "Karantina", "Program Khusus Kedokteran", "Kedinasan STAN", "Kedinasan CAT Umum", "Lainnya"]
export const userCategory = ["Saintek", "Soshum", "IPC", "Lainnya"];

export const listQuestionType = ['Latihan', 'Try Out', 'Simulasi'];
export const listProgram = ['UTBK', 'Kedinasan'];
export const listCategory = {
    'UTBK': ['Tes Potensi Skolastik (TPS)', 'Saintek', 'Soshum'],
    'Kedinasan': ['Tes Potensi Akademik (TPA)', 'Tes Wawasan Kebangsaan (TWK)', 'Tes Intelegensi Umum (TIU)', 'Tes Karakteristik Pribadi (TKP)']
}
export const listSubject = {
    'Tes Potensi Skolastik (TPS)': ['Penalaran Umum', 'Pemahaman Bacaan dan Menulis', 'Pengetahuan dan Pemahaman Umum', 'Pengetahuan Kuantitatif'],
    'Saintek': ['Biologi', 'Fisika', 'Kimia', 'Matematika'],
    'Soshum': ['Ekonomi', 'Geografi', 'Sejarah', 'Sosiologi'],
}

export const listTopic = {
    // UTBK - TPS - Penalaran Umum
    [listSubject[listCategory[listProgram[0]][0]][0]]: [],
    // UTBK - TPS - Pemahaman Bacaan dan Menulis
    [listSubject[listCategory[listProgram[0]][0]][1]]: [],
    // UTBK - TPS - Pengetahuan dan Pemahaman Umum
    [listSubject[listCategory[listProgram[0]][0]][2]]: [],
    // UTBK - TPS - Pengetahuan Kuantitatif
    [listSubject[listCategory[listProgram[0]][0]][3]]: [],
    // UTBK - Saintek - Biologi
    [listSubject[listCategory[listProgram[0]][1]][0]]: ['Biokimia', 'Sel', 'Metabolisme', 'Reproduksi Sel', 'Genetika', 'Mikroorganisme', 'Jaringan Tumbuhan', 'Klasifikasi Tumbuhan Lumut dan Paku', 'Klasifikasi Tumbuhan Berbiji', 'Invertebrata', 'Vertebrata', 'Anatomi dan Fisiologi Manusia', 'Ekologi', 'Evolusi', 'Bioteknologi'],
    // UTBK - Saintek - Fisika
    [listSubject[listCategory[listProgram[0]][1]][1]]: ['Mekanika', 'Fluida', 'Getaran dan Gelombang', 'Zat dan Kalor', 'Listrik dan Magnet', 'Optika Geometri dan Optika Fisis', 'Fisika Modern'],
    // UTBK - Saintek - Kimia
    [listSubject[listCategory[listProgram[0]][1]][2]]: ['Struktur Atom dan Sistem Periodik', 'Ikatan Kimia', 'Stoiklometri', 'Termokimia dan Energitika', 'Kecepatan Reaksi', 'Kesetimbangan Kimia', 'Sifat Koligatif', 'Larutan Asam Basa', 'Larutan Buffer', 'Hidrolisis Garam', 'Kelarutan', 'Titrasi Asam Basa', 'Reaksi Redoks dan Elektrokimia', 'Sistem Koloid', 'Senyawa Karbon', 'Radioaktif', 'Kimia Lingkungan', 'Kimia Unsur', 'Gas Ideal dan Kinetika Gas'],
    // UTBK - Saintek - Matematika
    [listSubject[listCategory[listProgram[0]][1]][3]]: ['Aljabar', 'Trigonometri', 'Limit', 'Turunan dan Integral', 'Probabilitas', 'Vektor', 'Matriks', 'Suku Banyak', 'Dimensi Tiga'],
    // UTBK - Soshum - Ekonomi
    [listSubject[listCategory[listProgram[0]][2]][0]]: ['Konsep Dasar Ekonomi', 'Permintaan dan Penawaran', 'Mikroekonomi', 'Makroekonomi', 'Akuntansi'],
    // UTBK - Soshum - Geografi
    [listSubject[listCategory[listProgram[0]][2]][1]]: ['Pengetahuan Dasar Geografi', 'Peta, Pengindraan Jauh dan Sistem Informasi Geografis', 'Dinamika Planet Bumi', 'Dinamika Litosfer', 'Dinamika Atmosfer', 'Dinamika Hidrosfer', 'Dinamika Biosfer', 'Dinamika Antroposfer', 'Sumber Daya Alam Indonesia', 'Keragaman Budaya di Indonesia', 'Mitigasi Bencana', 'Konsep Wilayah dan Tata Ruang', 'Interaksi Keruangan Desa dan Kota', 'Interaksi Negara Maju dan Berkembang'],
    // UTBK - Soshum - Sejarah
    [listSubject[listCategory[listProgram[0]][2]][2]]: ['Pengantar Ilmu Sejarah', 'Manusia Nusantara Masa Pra-Aksara', 'Peradaban Hindu-Buddha Nusantara', 'Peradaban Islam Nusantara', 'Perjuangan dan Pergerakan Nasional Indonesia', 'Pendudukan dan Penjajahan Jepang di Indonesia', 'Proklamasi Kemerdekaan Indonesia', 'Perjuangan dan Revolusi Mempertahankan Kemerdekaan', 'Republik Indonesia Serikat', 'Perjuangan Melawan Ancaman Pemberontakan', 'Indonesia Era Demokrasi Liberal', 'Indonesia Era Demokrasi Terpimpin', 'Indonesia Era Orde Baru', 'Indonesia Era Orde Reformasi', 'Peradaban Dunia Kuno Mancanegara', 'Evolusi Peradaban Eropa', 'Revolusi-Revolusi Besar di Dunia'],
    // UTBK - Soshum - Sosiologi
    [listSubject[listCategory[listProgram[0]][2]][3]]: ['Perspektif Sosiologi', 'Definisi dan Ciri Sosiologi', 'Interaksi Sosial', 'Sosialisasi', 'Nilai dan Norma', 'Penyimpangan Sosial', 'Struktur Sosial dan Diferesiasi Sosial', 'Stratifikasi Sosial', 'Konflik dan Integrasi Sosial', 'Mobilitas Sosial', 'Kelompok Sosial', 'Lembaga Sosial', 'Kebudayaan', 'Perubahan Sosial', 'Modernisasi dan Globalisasi', 'Gender'],

}

export const listMeetingDuration = {
    15: "15 Menit",
    30: "30 Menit",
    45: "45 Menit",
    60: "60 Menit",
    90: "90 Menit",
    100: "100 Menit",
    120: "120 Menit",
    150: "150 Menit",
}



