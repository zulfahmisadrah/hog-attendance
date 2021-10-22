import DepartmentRequest from "../endpoints/departments";
import APIService from "../../utils/APIService";
import {BASE_API_DEPARTMENTS} from "../endpoints/_constants";

export class DepartmentService extends APIService {
    constructor() {
        const apiRequest = new DepartmentRequest(BASE_API_DEPARTMENTS);
        super(apiRequest);
    }

    getListData = ({faculty_id, offset, limit, onSuccess, onError}) => {
        this.apiRequest.getListData(faculty_id, offset, limit).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListData", e)
            }
        })
    }

    getListDepartmentsOptions = (faculty_id, onSuccess) => {
        this.getListData({
            faculty_id: faculty_id,
            onSuccess: (listData) => {
                const sortedListDepartments = listData.sort((a, b) => a.name.localeCompare(b.name))
                const listDepartmentsOptions = sortedListDepartments.map(department => ({
                    label: department.name,
                    value: department.id
                }))
                onSuccess(listDepartmentsOptions)
            }
        })
    }
}