import APIService from "../../utils/APIService";
import {BASE_API_LECTURERS} from "../endpoints/_constants";
import LecturerRequest from "../endpoints/lecturers";

export class LecturerService extends APIService {
    constructor() {
        const apiRequest = new LecturerRequest(BASE_API_LECTURERS);
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