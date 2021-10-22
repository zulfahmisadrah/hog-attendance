import APIService from "../../utils/APIService";
import {BASE_API_STUDENTS} from "../endpoints/_constants";
import StudentRequest from "../endpoints/students";

export class StudentService extends APIService {
    constructor() {
        const apiRequest = new StudentRequest(BASE_API_STUDENTS);
        super(apiRequest);
    }

    getListData = ({department_id, keyword, offset, limit, onSuccess, onError}) => {
        this.apiRequest.getListData(department_id, keyword, offset, limit).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListData", e)
            }
        })
    }
}