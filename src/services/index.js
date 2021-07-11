import {
    deleteMeeting,
    getMeetings,
    getTeachers,
    getUsers,
    postTeacher,
    postUser,
    putTeacher,
    putUser,
    getAttendances,
    deleteAttendance,
    fetchUserData,
    getMyMeetings,
    postMeeting,
    putMeeting,
    postSuperAdmin,
    postAdmin,
    postAttendance,
    getMyAttendances,
    postChangePassword,
} from "./client";
import {getCurrentDateTime, getDateTimeFromString, getMoment} from "../utils/Commons";
import {dateTimeFormat, dateTimeIdFormat, dateTimeISOFormat} from "../utils/Constants";
import {avatarRef} from "./storageRef";

export const getUserData = (callback) => {
    fetchUserData().then(res => {
        const userData = res.data
        callback(userData)
    })
}

export const fetchUsers = (callback) => {
    getUsers().then(res => {
        const listData = res.data.map(data => {
            data.role = data.role.id
            return data
        })
        callback(listData)
    }).catch(e => {
        console.log(e)
    })
}

export const createUser = ({user, role, onSuccess, onError}) => {
    let request
    switch (role) {
        case "1":
            request = postSuperAdmin(user);
            break;
        case "2":
            request = postAdmin(user);
            break;
        case "3":
            request = postTeacher(user);
            break;
        default:
            request = postUser(user)
    }
    request.then(res => {
        const newData = res.data
        onSuccess(newData)
    }).catch(e => {
        onError("createUser", e)
    })
}

export const updateUser = ({user, onSuccess, onError}) => {
    putUser(user).then(res => {
        const updatedData = res.data
        onSuccess(updatedData)
    }).catch(e => {
        onError("updateUser", e)
    })
}

export const updateUserPassword = ({payload, onSuccess, onError}) => {
    postChangePassword(payload).then(res => {
        onSuccess()
    }).catch(e => {
        onError("updateUser", e)
    })
}

export const fetchTeachers = (callback) => {
    getTeachers().then(res => {
        console.log("fetchUsers", res.data)
        const listData = res.data
        callback(listData)
    }).catch(e => {
        console.log(e)
    })
}

export const createTeacher = ({teacher, onSuccess, onError}) => {
    postTeacher(teacher).then(res => {
        const newData = res.data
        onSuccess(newData)
    }).catch(e => {
        onError("createTeacher", e)
    })
}

export const updateTeacher = ({teacher, onSuccess, onError}) => {
    putTeacher(teacher).then(res => {
        const updatedData = res.data
        onSuccess(updatedData)
    }).catch(e => {
        onError("updateTeacher", e)
    })
}

export const fetchMyActiveMeetings = (callback) => {
    getMyMeetings().then(res => {
        const data = res.data
        const listData = []
        getMyAttendances().then(response => {
            const currentDate = getMoment()
            data.forEach((value) => {
                const attendances = response.data
                const attendanceExist = attendances.find(attendance => attendance.meeting.id === value.id)

                const isISOFormat = value.schedule.includes('T')
                const schedule = getDateTimeFromString(value.schedule, isISOFormat ? dateTimeISOFormat : dateTimeFormat)
                const isActive = currentDate.diff(schedule) > -43200000 // waktu sekarang - jadwal > -12 jam (12 jam menuju jadwal)
                if (isActive && !attendanceExist) listData.push(value)
            })
            callback(listData)
        })
    }).catch(e => {
        console.log("fetchMyActiveMeetings", e)
    })
}

export const fetchMyScheduledMeetings = (callback) => {
    getMyMeetings().then(res => {
        const data = res.data
        const listData = []
        const currentDate = getMoment()
        data.forEach((value) => {
            const isISOFormat = value.schedule.includes('T')
            const schedule = getDateTimeFromString(value.schedule, isISOFormat ? dateTimeISOFormat : dateTimeFormat)
            const isActive = currentDate.diff(schedule) > -43200000 // waktu sekarang - jadwal > -12 jam
            if (!isActive)
                listData.push(value);
        })
        callback(listData)
    }).catch(e => {
        console.log("fetchMyScheduledMeetings", e)
    })
}

export const fetchMyFinishedMeetings = (callback) => {
    getMyMeetings().then(res => {
        const data = res.data
        const listData = []
        getMyAttendances().then(response => {
            data.forEach((value) => {
                const attendances = response.data
                const attendanceExist = attendances.find(attendance => attendance.meeting.id === value.id)
                if (attendanceExist) listData.push(value)
            })
            callback(listData)
        })
    }).catch(e => {
        console.log("fetchMyFinishedMeetings", e)
    })
}

export const fetchMeetings = (callback) => {
    getMeetings().then(res => {
        console.log("fetchMeetings", res.data)
        const listData = res.data
        console.log("listData", listData)
        callback(listData)
    }).catch(e => {
        console.log("fetchMeetings", e)
    })
}

export const createMeeting = ({meeting, onSuccess, onError}) => {
    postMeeting(meeting).then(res => {
        const newData = res.data
        onSuccess(newData)
    }).catch(e => {
        onError("createMeeting", e)
    })
}

export const updateMeeting = ({meeting, onSuccess, onError}) => {
    putMeeting(meeting).then(res => {
        const updatedData = res.data
        onSuccess(updatedData)
    }).catch(e => {
        onError("updateMeeting", e)
    })
}

export const removeMeeting = (meetingId, callback) => {
    deleteMeeting(meetingId).then(res => {
        callback()
    }).catch(e => {
        console.log("removeMeeting", e)
    })
}

export const fetchMyAttendances = (callback) => {
    getMyAttendances().then(res => {
        const listData = res.data
        callback(listData)
    }).catch(e => {
        console.log("fetchMyAttendances", e)
    })
}

export const fetchAttendances = (callback) => {
    getAttendances().then(res => {
        const listData = res.data
        callback(listData)
    }).catch(e => {
        console.log("fetchAttendances", e)
    })
}

export const createAttendance = ({attendance, onSuccess, onError}) => {
    postAttendance(attendance).then(res => {
        const newData = res.data
        onSuccess(newData)
    }).catch(e => {
        onError("createAttendance", e)
    })
}

export const removeAttendance = (attendanceId, callback) => {
    deleteAttendance(attendanceId).then(res => {
        callback()
    }).catch(e => {
        console.log("removeAttendance", e)
    })
}

export const uploadFileToStorage = (
    {
        file,
        ref = avatarRef,
        onSuccess,
        onError = (e) => {
            console.log("uploadFileToStorage", e)
        },
        fileNamePrefix = "",
        metadata = {contentType: 'image/jpeg'}
    }
) => {
    const fileName = [fileNamePrefix, getCurrentDateTime(dateTimeIdFormat)].join('_')
    const uploadTask = ref.child(fileName).put(file, metadata)
    uploadTask.on('state_changed',
        () => {
        },
        (error) => {
            onError(error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                onSuccess(downloadURL);
            });
        }
    );
}