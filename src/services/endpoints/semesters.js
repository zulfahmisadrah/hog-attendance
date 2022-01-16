import axios from '../../utils/axiosInstance';
import APIRequest from "../../utils/APIRequest";
import {BASE_API_SEMESTERS} from "./_constants";

const baseUrl = BASE_API_SEMESTERS;

class SemesterRequest extends APIRequest {
    constructor() {
        super(baseUrl);
    }

    createNextSemester = () => axios.post(this.baseUrl + "next_semester")
    activateSemester = (id) => axios.post(this.baseUrl + id + "/activate")
}

export default SemesterRequest;