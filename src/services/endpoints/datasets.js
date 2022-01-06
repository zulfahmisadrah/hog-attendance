import axios from 'axios';
import {BASE_API_DATASETS} from "./_constants";
import APIRequest from "../../utils/APIRequest";

const baseUrl = BASE_API_DATASETS;

class DatasetRequest extends APIRequest {
    constructor() {
        super(baseUrl);
    }

    getListStudentDatasets = (datasetType, username) => {
        return axios.get(this.baseUrl + datasetType + "/" + username)
    }

    getStudentTotalDatasets = (username) => {
        return axios.get(this.baseUrl + "total_datasets/" + username)
    }

    createFromRawDataset = (data) => {
        return axios.post(this.baseUrl + "generate_datasets_from_raw", data)
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

    takePresence = (data) => {
        return axios.post(this.baseUrl + "take_presence", data, {
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