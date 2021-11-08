import axios from 'axios';
import {BASE_API_DATASETS} from "./_constants";
import APIRequest from "../../utils/APIRequest";

const baseUrl = BASE_API_DATASETS;

class DatasetRequest extends APIRequest {
    constructor() {
        super(baseUrl);
    }

    getListStudentDatasets = (username) => {
        return axios.get(this.baseUrl + username)
    }

    createFromRawDataset = (data) => {
        return axios.post(this.baseUrl + "detect_from_raw", data)
    }

    createDataset = (data) => {
        return axios.post(this.baseUrl + "capture", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    }

    trainDatasets = (data) => {
        return axios.post(this.baseUrl + "train", data)
    }

    recognizeFace = (data) => {
        return axios.post(this.baseUrl + "recognize", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    }

    deleteStudentDataset = (username, fileName) => {
        return axios.delete(this.baseUrl + username + "/" + fileName)
    }
}

export default DatasetRequest;