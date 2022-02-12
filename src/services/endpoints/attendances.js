import axios from '../../utils/axiosInstance';
import APIRequest from "../../utils/APIRequest";
import {DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_SIZE} from "../../config/api";
import {BASE_API_ATTENDANCES} from "./_constants";

const baseUrl = BASE_API_ATTENDANCES;

class AttendanceRequest extends APIRequest {
    constructor() {
        super(baseUrl);
    }

    getListData = (
        keyword,
        department_id,
        offset = DEFAULT_PAGE_OFFSET,
        limit = DEFAULT_PAGE_SIZE
    ) => axios.get(this.baseUrl, {
        params: {
            ...(keyword ? {keyword: keyword} : {}),
            ...(department_id ? {department_id: department_id} : {}),
            offset: offset,
            limit: limit
        }
    })

    getMyAttendances = () => axios.get(this.baseUrl + "me");
    getMyMeetingAttendance = (meeting_id) => axios.get(this.baseUrl + `${meeting_id}/me`);
    getCourseAttendances = (course_id) => axios.get(this.baseUrl + "course/" + course_id);
    getMeetingAttendanceResults = (meeting_id) => axios.get(this.baseUrl + "result/" + meeting_id);

    takePresence = (data) => {
        return axios.post(this.baseUrl + "take_presence", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    }

    resetAttendanceValidate = (data) => axios.post(this.baseUrl + "reset_attendance_validate", data)
    applyAttendanceValidate = (data) => axios.post(this.baseUrl + "apply_attendance_validate", data)

}

export default AttendanceRequest;