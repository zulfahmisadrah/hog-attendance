import axios from 'axios';
import APIRequest from "../../utils/APIRequest";
import {DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_SIZE} from "../../config/api";


class LecturerRequest extends APIRequest {

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
}

export default LecturerRequest;