import APIService from "../../utils/APIService";
import AttendanceRequest from "../endpoints/attendances";

const attendanceRequest = new AttendanceRequest();

export class AttendanceService extends APIService {
    constructor() {
        super(attendanceRequest);
    }

    getMyAttendances = ({onSuccess, onError}) => {
        this.apiRequest.getMyAttendances().then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getMyAttendances", e)
            }
        })
    }

    getMyMeetingAttendance = ({meeting_id, onSuccess, onError, onFinally}) => {
        this.apiRequest.getMyMeetingAttendance(meeting_id).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getMyMeetingAttendance", e)
            }
        }).finally(() => {
            if (onFinally instanceof Function){
                onFinally()
            }
        })
    }

    takePresence = ({data, onSuccess, onError}) => {
        this.apiRequest.takePresence(data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("takePresence", e)
            }
        })
    }

    resetAttendanceValidate = ({data, onSuccess, onError}) => {
        this.apiRequest.resetAttendanceValidate(data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("resetAttendanceValidate", e)
            }
        })
    }

    applyAttendanceValidate = ({data, onSuccess, onError}) => {
        this.apiRequest.applyAttendanceValidate(data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("applyAttendanceValidate", e)
            }
        })
    }

    getCourseAttendances = ({course_id, onSuccess, onError}) => {
        this.apiRequest.getCourseAttendances(course_id).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("recapAttendances", e)
            }
        })
    }

    getMeetingAttendanceResults = ({meeting_id, onSuccess, onError}) => {
        this.apiRequest.getMeetingAttendanceResults(meeting_id).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("recapAttendances", e)
            }
        })
    }

    deleteMeetingAttendanceResult = ({course_id, meeting_id, file_name, onSuccess, onError}) => {
        this.apiRequest.deleteMeetingAttendanceResult(course_id, meeting_id, file_name).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("recapAttendances", e)
            }
        })
    }
}