export const BASE_URL = "http://localhost:8000/";
// export const BASE_URL = "https://dev.eng.unhas.ac.id/backend/";
// export const BASE_URL = "http://192.168.1.9:8000/";
export const BASE_API_URL = `${BASE_URL}api/`;
export const BASE_AVATAR_URL = `${BASE_API_URL}assets/avatar/`;
export const BASE_DATASET_URL = `${BASE_API_URL}assets/dataset/`;
export const BASE_DATASET_SAMPLE_URL = `${BASE_API_URL}assets/dataset/sample/`;
export const BASE_DATASET_TRAIN_URL = `${BASE_DATASET_URL}train/`;
export const BASE_DATASET_VAL_URL = `${BASE_DATASET_URL}val/`;
export const BASE_DATASET_RAW_TRAIN_URL = `${BASE_API_URL}assets/dataset-raw/train/`;
export const BASE_DATASET_RAW_VAL_URL = `${BASE_API_URL}assets/dataset-raw/val/`;
export const BASE_RESULT_URL = `${BASE_API_URL}assets/result/`;
export const BASE_API_AUTH_URL = `${BASE_URL}api/auth/`;
export const APP_NAME = "NEO ATTENDANCE";

export const dateFormat = "YYYY-MM-DD";
export const timeFormat = "HH:mm:ss";
export const dateTimeFormat = "YYYY-MM-DD HH:mm:ss Z";
export const dateTextFormat = "dddd, DD MMM YYYY";
export const timeTextFormat = "HH:mm";
export const dateTimeTextFormat = "dddd, DD MMM YYYY HH:mm";
export const dateTimeISOFormat = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";
export const dateTimeIdFormat = "YYYYMMDD_HHmmss";

export const MAX_SIZE_IMAGE_MB = 3;

export const MeetingListType = {
    NEAREST: "nearest",
    ACTIVE: "active",
    SCHEDULED: "scheduled",
    FINISHED: "finished"
}

export const attendanceStatus = {
    attend: "Hadir",
    absent: "Absen",
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

export const SemesterType = {
    GANJIL: "Ganjil",
    GENAP: "Genap"
}

export const DataType = {
    TEXT: "text",
    DATETIME: "datetime",
    DATE: "date",
    TIME: "time",
    IMAGE: "image",
    CUSTOM: "custom"
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

export const DayOfWeekInteger = {
    "Senin": 1,
    "Selasa": 2,
    "Rabu": 3,
    "Kamis": 4,
    "Jumat": 5,
    "Sabtu": 6,
    "Minggu": 7
}

export const MeetingStatus = {
    Terjadwal:"Terjadwal",
    Berlangsung: "Berlangsung",
    Selesai: "Selesai"
}

export const DatasetType = {
    TRAINING: "train",
    VALIDATION: "val"
}
