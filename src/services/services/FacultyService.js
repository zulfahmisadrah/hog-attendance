import APIService from "../../utils/APIService";
import APIRequest from "../../utils/APIRequest";
import {BASE_API_FACULTIES} from "../endpoints/_constants";


export class FacultyService extends APIService {
    constructor() {
        const apiRequest = new APIRequest(BASE_API_FACULTIES);
        super(apiRequest);
    }

    getListFacultiesOptions = (callback) => {
        this.getListData({
            limit: 20,
            onSuccess: (listData) => {
                const sortedListFaculties = listData.sort((a, b) => a.name.localeCompare(b.name))
                const listFacultiesOptions = sortedListFaculties.map(faculty => ({
                    label: faculty.name,
                    value: faculty.id
                }))
                callback(listFacultiesOptions)
            }
        })
    }
}