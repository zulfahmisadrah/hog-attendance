import axios from 'axios';
import {BASE_API_AUTH_URL} from "../utils/Constants";

export const setAuthToken = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const authLogin = (formData) => {
    return axios.post(BASE_API_AUTH_URL + "login", formData)
}

export const fetchUserData = () => {
    return axios.post(BASE_API_AUTH_URL + "me")
}

export const refreshToken = () => {
    return axios.post("oauth/access_token", {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: JSON.parse(localStorage.auth).refresh_token
        })
    })
        .then(res => {
            console.log("refresh", res)
            localStorage.auth = JSON.stringify(res)
        })
        .catch(() => {
            throw new Error("Unable to refresh!")
        })
}

export const uploadFile = (payload) => {
    return axios.post("uploadFile", payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const getUsers = () => {
    return axios.get("users")
}

export const getUser = (userId) => {
    return axios.get(`users/${userId}`)
}

export const postSuperAdmin = (user) => {
    return axios.post("users/createSuperAdmin", user)
}

export const postAdmin = (user) => {
    return axios.post("users/createAdmin", user)
}

export const postChangePassword = (payload) => {
    return axios.post("users/updatePassword", payload)
}

export const postUser = (user) => {
    return axios.post("users", user)
}

export const putUser = (user) => {
    return axios.put(`users/${user.id}`, user)
}

export const deleteUser = (userId) => {
    return axios.delete(`users/${userId}`)
}

export const getTeachers = () => {
    return axios.get("teachers")
}

export const getTeacher = (teacherId) => {
    return axios.get(`teachers/${teacherId}`)
}

export const postTeacher = (teacher) => {
    return axios.post("teachers", teacher)
}

export const putTeacher = (teacher) => {
    return axios.put(`teachers/${teacher.id}`, teacher)
}

export const deleteTeacher = (teacherId) => {
    return axios.delete(`teachers/${teacherId}`)
}

export const getMyMeetings = () => {
    return axios.get("meetings/me")
}

export const getMeetings = () => {
    return axios.get("meetings")
}

export const getMeeting = (meetingId) => {
    return axios.get(`meetings/${meetingId}`)
}

export const postMeeting = (meeting) => {
    return axios.post("meetings", meeting)
}

export const putMeeting = (meeting) => {
    return axios.put(`meetings/${meeting.id}`, meeting)
}

export const deleteMeeting = (meetingId) => {
    return axios.delete(`meetings/${meetingId}`)
}

export const getMyAttendances = () => {
    return axios.get("attendances/me")
}

export const getAttendances = () => {
    return axios.get("attendances")
}

export const getAttendance = (attendanceId) => {
    return axios.get(`attendances/${attendanceId}`)
}

export const postAttendance = (attendance) => {
    return axios.post("attendances", attendance)
}

export const putAttendance = (attendance) => {
    return axios.put(`attendances/${attendance.id}`, attendance)
}

export const deleteAttendance = (attendanceId) => {
    return axios.delete(`attendances/${attendanceId}`)
}