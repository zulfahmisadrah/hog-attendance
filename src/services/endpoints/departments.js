import axios from 'axios';
import APIRequest from "../../utils/APIRequest";
import {DEFAULT_PAGE_OFFSET} from "../../config/api";


class DepartmentRequest extends APIRequest {

    getListData = (
        faculty_id,
        offset = DEFAULT_PAGE_OFFSET,
        limit = 20
    ) => axios.get(this.baseUrl, {
        params: {
            ...(faculty_id ? {faculty_id: faculty_id} : {}),
            offset: offset,
            limit: limit
        }
    })
}

export default DepartmentRequest;