import DatasetRequest from "../endpoints/datasets";
import APIService from "../../utils/APIService";

const apiRequest = new DatasetRequest();

export class DatasetService extends APIService {
    constructor() {
        super(apiRequest);
    }

    fetchListStudentDatasets = (datasetType, username, callback) => {
        this.apiRequest.getListStudentDatasets(datasetType, username).then(res => {
            callback(res.data)
        }).catch(e => {
            console.log("fetchListStudentDatasets", e)
        })
    }

    fetchStudentTotalDatasets = (username, callback) => {
        this.apiRequest.getStudentTotalDatasets(username).then(res => {
            callback(res.data)
        }).catch(e => {
            console.log("fetchStudentTotalDatasets", e)
        })
    }

    createFromRawDataset = ({data, onSuccess, onError}) => {
        this.apiRequest.createFromRawDataset(data).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("createFromRawDataset", e)
            }
        })
    }

    datasetCapture = ({data, onSuccess, onError}) => {
        this.apiRequest.createDataset(data).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("datasetCapture", e)
            }
        })
    }

    trainDatasets = ({data, onSuccess, onError}) => {
        this.apiRequest.trainDatasets(data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("trainDatasets", e)
            }
        })
    }

    recognizeUser = ({data, onSuccess, onError}) => {
        this.apiRequest.recognizeFace(data).then((res) => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("recognizeUser", e)
            }
        })
    }

    deleteStudentDataset = ({username, fileName, onSuccess, onError}) => {
        this.apiRequest.deleteStudentDataset(username, fileName).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("deleteData", e)
            }
        })
    }
}