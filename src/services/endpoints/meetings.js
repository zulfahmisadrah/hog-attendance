import axios from '../../utils/axiosInstance';
import APIRequest from "../../utils/APIRequest";
import {BASE_API_MEETINGS} from "./_constants";

const baseUrl = BASE_API_MEETINGS;

class MeetingRequest extends APIRequest {
    constructor() {
        super(baseUrl);
    }

    getMyMeetings = () => axios.get(this.baseUrl + "me");
    getMyMeetingsNearest = () => axios.get(this.baseUrl + "me/nearest");
    getMyMeetingsToday = () => axios.get(this.baseUrl + "me/today");
    getMyUpcomingMeetings = () => axios.get(this.baseUrl + "me/upcoming");
    getMyFinishedMeetings = () => axios.get(this.baseUrl + "me/finished");
    getListAttendances = (id) => axios.get(this.baseUrl + id + "/attendances");
    getCourseMeetings = (course_id) => axios.get(this.baseUrl + "course/" + course_id);
}

export default MeetingRequest;