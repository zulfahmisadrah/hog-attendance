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
}