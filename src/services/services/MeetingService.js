import APIService from "../../utils/APIService";
import MeetingRequest from "../endpoints/meetings";
import {getDateTimeFromString, getMoment} from "../../utils/Commons";
import {dateTimeFormat, MeetingStatus, meetingStatus} from "../../utils/Constants";

const meetingRequest = new MeetingRequest();

export class MeetingService extends APIService {
    constructor() {
        super(meetingRequest);
    }

    getListTodayMeeting = ({offset, limit, onSuccess, onError}) => {
        this.apiRequest.getMyMeetings(offset, limit).then(res => {
            const data = res.data
            const listData = []
            const currentDate = getMoment()
            data.forEach((value) => {
                const schedule = getDateTimeFromString(value.date, dateTimeFormat)
                const isActive = currentDate.isSame(schedule, 'days')
                // const isActive = currentDate.diff(schedule) > -43200000 // waktu sekarang - jadwal > -12 jam
                const isNotFinished = value.status !== MeetingStatus.Selesai
                if (isActive && isNotFinished) listData.push(value)
            })
            onSuccess(listData)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListTodayMeeting", e)
            }
        })
    }

    getListScheduledMeeting = ({offset, limit, onSuccess, onError}) => {
        this.apiRequest.getMyMeetings(offset, limit).then(res => {
            const data = res.data
            const listData = []
            const currentDate = getMoment()
            data.forEach((value) => {
                const schedule = getDateTimeFromString(value.date, dateTimeFormat)
                const isScheduled = currentDate.isBefore(schedule, 'days')
                // const isUpcoming = currentDate.diff(schedule) <= -43200000 // lebih dari 12 jam menuju jadwal
                if (isScheduled) listData.push(value)
            })
            onSuccess(listData)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListScheduledMeeting", e)
            }
        })
    }

    getListFinishedMeeting = ({offset, limit, onSuccess, onError}) => {
        this.apiRequest.getMyMeetings(offset, limit).then(res => {
            const data = res.data
            const listData = []
            data.forEach((value) => {
                const isFinished = value.status === MeetingStatus.Selesai
                if (isFinished) {
                    listData.push(value)
                }
            })
            onSuccess(listData)
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
}