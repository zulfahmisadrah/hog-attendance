import axios from 'axios';
import APIRequest from "../../utils/APIRequest";
import {DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_SIZE} from "../../config/api";


class CourseRequest extends APIRequest {

    getCourseStudents = (id) => axios.get(this.baseUrl + id + "/students")
    addCourseStudents = (id, data) => axios.post(this.baseUrl + id + "/students", data)
    removeCourseStudents = (id, data) => axios.delete(this.baseUrl + id + "/students", {data: data})
    getCourseLecturers = (id) => axios.get(this.baseUrl + id + "/lecturers")
    addCourseLecturers = (id, data) => axios.post(this.baseUrl + id + "/lecturers", data)
    removeCourseLecturers = (id, data) => axios.delete(this.baseUrl + id + "/lecturers", {data: data})

    // getCourseLecturers = (
    //     id,
    //     offset = DEFAULT_PAGE_OFFSET,
    //     limit = DEFAULT_PAGE_SIZE
    // ) => axios.get(this.baseUrl + id + "/lecturers", {
    //     params: {
    //         offset: offset,
    //         limit: limit
    //     }
    // })
}

export default CourseRequest;