import {
    dateTimeFormat,
    dateTimeIdFormat,
    dateTimeTextFormat,
    CourseType,
    listEducation,
    listRole,
    attendanceStatus,
    DayOfWeek,
    SemesterType
} from "./Constants";
import * as moment from "moment";
import 'moment/locale/id'
import {Modal, notification, message} from "antd";
import {listProdi} from "./UniversityDataConstants";

export const getListOptionsUniversityMajor = (university, category) => {
    const listMajors = getUniversityMajors(university, category)
    return listMajors.map(major => ({
        label: major,
        value: major
    }))
}

export const getUniversityMajors = (university, category) => {
    let listMajors
    if (category === "Saintek" || category === "Soshum") {
        listMajors = Object.values(listProdi[university][category])
        if (listMajors.length === 0) listMajors = Object.values(listProdi["UNIVERSITAS HASANUDDIN"][category])
    } else {
        listMajors = listProdi[university]["Saintek"].concat(listProdi[university]["Soshum"])
        if (listMajors.length === 0) {
            Object.values(listProdi["UNIVERSITAS HASANUDDIN"]).forEach(value => {
                listMajors = listMajors.concat(value)
            })
        }
    }
    return listMajors
}

export const listEducationOptions = Object.keys(listEducation).map(key => ({
        label: listEducation[key],
        value: key
    })
)

export const listCourseTypeOptions = Object.values(CourseType).map(value => ({
        label: value,
        value: value
    })
)

export const attendanceStatusOptions = Object.values(attendanceStatus).map(value => ({
        label: value,
        value: value
    })
)

export const semesterTypeOptions = Object.values(SemesterType).map(value => ({
        label: value,
        value: value
    })
)

export const dayOfWeekOptions = Object.keys(DayOfWeek).map(key => ({
        label: DayOfWeek[key],
        value: key
    })
)

export const changeUndefinedToNull = (data) => {
    for (let key in data) {
        data[key] = data[key] ?? null
    }
}

export const convertUndefinedToNull = (data) => {
    for (let key in data) {
        data[key] = data[key] ?? null
    }
}

export const convertNullToUndefined = (data) => {
    for (let key in data) {
        data[key] = data[key] ?? undefined
    }
}

export const getRoleName = (role) => {
    return listRole[role]
}

export const searchData2 = (listData, keyword, filterKeys = ["tag"]) => {
    return listData.filter(item => {
        let found = false
        for (let index = 0; index < filterKeys.length; index++) {
            const key = filterKeys[index]
            if (keyword !== undefined && keyword !== "") {
                const data = item[key]
                const containsKeyword = (typeof data === "number") ? data === parseInt(keyword) : data?.includes(keyword)
                const exactlyMatch = (typeof data === "number") ? data === parseInt(keyword) : data === keyword
                const isFoundKeyword = key === "tag" ? exactlyMatch : containsKeyword
                if (data !== undefined && isFoundKeyword) {
                    return found = true
                }
            } else {
                found = true
            }
        }
        return found
    });
}

export function searchData(listData, keyword, isExactMatch = false, filterKeys) {
    return listData.filter(item => {
        let found = false;
        for (let index = 0; index < filterKeys.length; index++) {
            const key = filterKeys[index];
            if (keyword !== undefined && keyword !== "") {
                keyword = keyword.toLowerCase();
                let data = item;
                if (Array.isArray(key)) {
                    key.forEach(subKey => {
                        if (subKey.includes('[]')) data = data.map(value => value[subKey.substr(2)]);
                        else data = data[subKey];
                    })
                } else {
                    data = data[key];
                }
                if (data) {
                    if (Array.isArray(data)) {
                        const isFoundKeyword = isExactMatch ?
                            data.filter(element => element === keyword) :
                            data.filter(element => element.toLowerCase().includes(keyword));
                        if (isFoundKeyword.length > 0) return found = true;
                    } else {
                        if (typeof data === "number") data = data.toString();
                        const isFoundKeyword = isExactMatch ? data === keyword : data.toLowerCase().includes(keyword);
                        if (isFoundKeyword) return found = true;
                    }
                }
            } else {
                found = true;
            }
        }
        return found
    });
}

export const toCountDownFormat = (timeInSeconds) => {
    let hours = Math.floor((timeInSeconds / (60 * 60)) % 24);
    let minutes = Math.floor((timeInSeconds / 60) % 60);
    let seconds = Math.floor(timeInSeconds % 60);
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    return hours + ":" + minutes + ":" + seconds
}

export const handleInputPhoneNumber = (input, prefix = "62") => {
    if (input.charAt(0) === '0') input = input.substring(1);
    else if (input.substring(0, 2) === "62") {
        input = input.substring(2);
    }
    return prefix + input
}

export const exportCSV = (content, fileName) => {
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.href = 'data:text/csv;charset=utf-8,' + encodedUri;
    link.download = fileName + ".csv";
    link.target = '_blank';
    document.body.appendChild(link); // Required for FF

    link.click();
}

export const getMoment = () => moment()
export const getCurrentDateTime = (format = dateTimeFormat) => moment().format(format)
export const getDateTimeFromString = (string, format = dateTimeFormat) => moment(string, format)
export const formatMomentToString = (dateTime, format = dateTimeFormat) => dateTime.format(format)
export const formatDateTime = (strDate, format = dateTimeTextFormat, dateFormat = dateTimeFormat) => {
    if (strDate) {
        let formatedStrDateTime = moment(strDate, dateFormat).locale('id').format(format);
        const splitDateTime = strDate.split(" ")
        if (splitDateTime.length > 1) {
            const timeZone = splitDateTime[splitDateTime.length - 1];
            let strTimeZone = "WITA"
            if (timeZone === "+07:00") strTimeZone = "WIB"
            else if (timeZone === "+09:00") strTimeZone = "WIT"
            formatedStrDateTime = formatedStrDateTime + " " + strTimeZone
        }
        return formatedStrDateTime
    }
}
export const getDayFromMoment = (moment) => moment.locale('id').format("dddd");

export const durationTimeToText = (timeInSecond) => {
    const hours = Math.floor(timeInSecond / 3600)
    const minutes = Math.floor((timeInSecond / 60) % 60)
    const seconds = Math.floor(timeInSecond % 60)

    const strHours = hours !== 0 ? hours + " Jam" : ""
    const strMinutes = minutes !== 0 ? minutes + " Menit" : ""
    const strSeconds = seconds !== 0 ? seconds + " Detik" : ""

    return [strHours, strMinutes, strSeconds].filter(nonEmptyString => nonEmptyString).join(" ")
}

export const sortStringDateTime = (a, b, ascending = true) => {
    const dateA = formatDateTime(a, dateTimeIdFormat)
    const dateB = formatDateTime(b, dateTimeIdFormat)
    return ascending ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA)
}

export const removeStringHTMLTags = (str) => {
    str = str?.toString();
    return str && str.replace(/(<([^>]+)>)/ig, '');
}

export const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const isObjectEqual = (obj1, obj2) => {
    const obj1Keys = Object.keys(obj1)
    const obj2Keys = Object.keys(obj2)

    if (obj1Keys.length !== obj2Keys.length) {
        return false
    }

    for (let key of obj1Keys) {
        if (obj1[key] !== obj2[key]) {
            return false
        }
    }

    return true
}

export const showInfoModal = ({title = "Informasi", content = ""}) => {
    Modal.info({
        title,
        content,
        okText: 'Tutup',
        bodyStyle: {maxHeight: '400px', overflowY: 'auto'},
    })
}

export const showErrorModal = (message, action) => {
    Modal.error({
        title: 'Terjadi Kesalahan',
        content: message,
        onOk() {
            if (action) action()
        }
    })
}

export const showSuccessNotification = (
    {
        message = 'Sukses',
        description = 'Eksekusi data berhasil.',
        duration = 3,
    }
) => {
    notification.success({
        message: message,
        description: description,
        duration: duration,
    })
}

export const showDataAddedNotification = (description = 'Data berhasil ditambahkan.') => {
    showSuccessNotification({
        description: description,
    })
}

export const showDataUpdatedNotification = (description = 'Data berhasil diperbarui.') => {
    showSuccessNotification({
        description: description,
    })
}

export const showDataDeletedNotification = (description = 'Data berhasil dihapus.') => {
    showSuccessNotification({
        description: description,
    })
}

export const showEmailSentNotification = (description = 'Email berhasil terkirim.') => {
    showSuccessNotification({
        description: description,
    })
}

export const showSuccessMessage = (content = 'Sukses', duration = 2) => {
    message.success(content, duration)
}

export const showDataUpdatedMessage = (content = 'Data berhasil diperbarui.') => {
    showSuccessMessage(content)
}