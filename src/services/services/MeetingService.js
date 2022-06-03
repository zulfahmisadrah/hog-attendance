import APIService from "../../utils/APIService";
import MeetingRequest from "../endpoints/meetings";
import {getDateTimeFromString, getMoment} from "../../utils/Commons";
import {dateTimeFormat, MeetingStatus} from "../../utils/Constants";

const meetingRequest = new MeetingRequest();

export class MeetingService extends APIService {
    constructor() {
        super(meetingRequest);
    }

    getNearestMeeting = ({offset, limit, onSuccess, onError}) => {
        this.apiRequest.getMyMeetingsNearest(offset, limit).then(res => {
            const data = res.data
            onSuccess(data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListTodayMeeting", e)
            }
        })
    }

    getListTodayMeeting = ({offset, limit, onSuccess, onError}) => {
        this.apiRequest.getMyMeetingsToday(offset, limit).then(res => {
            const data = res.data
            onSuccess(data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListTodayMeeting", e)
            }
        })
    }

    getListScheduledMeeting = ({offset, limit, onSuccess, onError}) => {
        this.apiRequest.getMyUpcomingMeetings(offset, limit).then(res => {
            const data = res.data
            onSuccess(data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListScheduledMeeting", e)
            }
        })
    }

    getListFinishedMeeting = ({offset, limit, onSuccess, onError}) => {
        this.apiRequest.getMyFinishedMeetings(offset, limit).then(res => {
            const data = res.data
            onSuccess(data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListFinishedMeeting", e)
            }
        })
    }

    getListAttendances = ({id, onSuccess, onError}) => {
        this.apiRequest.getListAttendances(id).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListAttendances", e)
            }
        })
    }

    getCourseMeetings = ({course_id, onSuccess, onError}) => {
        this.apiRequest.getCourseMeetings(course_id).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getCourseMeetings", e)
            }
        })
    }
}