import axios from 'axios';
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

    getMyAttendances = () => axios.get(this.baseUrl + "me")

}

export default AttendanceRequest;