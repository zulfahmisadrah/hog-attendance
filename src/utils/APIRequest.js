import axios from "axios";
import {DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_SIZE} from "../config/api";

class APIRequest {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    getListData = (
        offset = DEFAULT_PAGE_OFFSET,
        limit = DEFAULT_PAGE_SIZE
    ) => axios.get(this.baseUrl + `?offset=${offset}&limit=${limit}`)

    getData = (id) => axios.get(this.baseUrl + id)

    createData = (data) => axios.post(this.baseUrl, data)

    updateData = (data) => axios.put(this.baseUrl + data.id, data)

    deleteData = (id) => axios.delete(this.baseUrl + id)
}

export default APIRequest;