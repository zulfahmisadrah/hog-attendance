import APIService from "../../utils/APIService";
import SemesterRequest from "../endpoints/semesters";

const semesterRequest = new SemesterRequest();

export class SemesterService extends APIService {
    constructor() {
        super(semesterRequest);
    }

    createNextSemester = ({onSuccess, onError}) => {
        this.apiRequest.createNextSemester().then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("createNextSemester", e)
            }
        })
    }

    activateSemester = ({semester_id, onSuccess, onError}) => {
        this.apiRequest.activateSemester(semester_id).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("createNextSemester", e)
            }
        })
    }
}