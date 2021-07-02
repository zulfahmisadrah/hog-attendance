import {imagePath} from "../path";

export const getImage = (tag) => {
    const images = {
        "logo": "logo.png",
        "logoDark": "logo_dark.png",
        "logoSmall": "logo_small.png",
        "avatar": "user.png",
        "menu_materi": "menu_materi.png",
        "menu_bank_soal": "menu_bank_soal.png",
        "menu_exam": "menu_exam.png",
        "header_home": "header_home.png",
    }

    return imagePath+images[tag];
}