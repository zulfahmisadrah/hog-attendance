import APIService from "../../utils/APIService";
import CourseRequest from "../endpoints/courses";
import {BASE_API_COURSES} from "../endpoints/_constants";


export class CourseService extends APIService {
    constructor() {
        const apiRequest = new CourseRequest(BASE_API_COURSES);
        super(apiRequest);
    }

    getCourseStudents = ({course_id, onSuccess, onError}) => {
        this.apiRequest.getCourseStudents(course_id).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getCourseStudents", e)
            }
        })
    }

    addCourseStudents = ({course_id, data, onSuccess, onError}) => {
        this.apiRequest.addCourseStudents(course_id, data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("addCourseStudents", e)
            }
        })
    }

    removeCourseStudents = ({course_id, data, onSuccess, onError}) => {
        this.apiRequest.removeCourseStudents(course_id, data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("removeCourseStudents", e)
            }
        })
    }

    getCourseLecturers = ({course_id, onSuccess, onError}) => {
        this.apiRequest.getCourseLecturers(course_id).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getCourseLecturers", e)
            }
        })
    }

    addCourseLecturers = ({course_id, data, onSuccess, onError}) => {
        this.apiRequest.addCourseLecturers(course_id, data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("addCourseLecturers", e)
            }
        })
    }

    removeCourseLecturers = ({course_id, data, onSuccess, onError}) => {
        this.apiRequest.removeCourseLecturers(course_id, data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("removeCourseLecturers", e)
            }
        })
    }

    getListCoursesOptions = (callback) => {
        this.getListData({
            onSuccess: (listData) => {
                const sortedListData = listData.sort((a, b) => a.name.localeCompare(b.name))
                const listOptions = sortedListData.map(course => ({
                    label: course.name,
                    value: course.id
                }))
                callback(listOptions)
            }
        })
    }
}