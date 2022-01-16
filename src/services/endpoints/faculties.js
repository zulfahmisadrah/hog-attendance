import axios from '../../utils/axiosInstance';
import {BASE_API_FACULTIES} from "./_constants";
import APIRequest from "../../utils/APIRequest";
import {DEFAULT_PAGE_OFFSET} from "../../config/api";


export const getListFaculties = (offset = 0, limit = 20) => {
    return axios.get(BASE_API_FACULTIES + `?offset=${offset}&limit=${limit}`)
}

export const getFaculty = (faculty_id) => {
    return axios.get(BASE_API_FACULTIES + faculty_id)
}

export const createFaculty = (faculty) => {
    return axios.post(BASE_API_FACULTIES, faculty)
}

export const updateFaculty = (faculty) => {
    return axios.put(BASE_API_FACULTIES + faculty.id, faculty)
}

export const deleteFaculty = (faculty_id) => {
    return axios.delete(BASE_API_FACULTIES + faculty_id)
}
//
// class FacultyRequest extends APIRequest {
//
//     getListData = (
//         offset = DEFAULT_PAGE_OFFSET,
//         limit = 20
//     ) => axios.get(this.baseUrl, {
//         params: {
//             offset: offset,
//             limit: limit
//         }
//     })
// }
//
// export default CourseRequest;