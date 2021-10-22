import APIService from "../../utils/APIService";
import UserRequest from "../endpoints/users";

const userRequest = new UserRequest();

export class UserService extends APIService {
    constructor() {
        super(userRequest);
    }

    updateMyData = ({data, onSuccess, onError}) => {
        this.apiRequest.updateMyData(data).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function) {
                onError(e)
            } else {
                console.log("updateMyData", e)
            }
        })
    }

    updateMyPassword = ({data, onSuccess, onError}) => {
        this.apiRequest.updateMyPassword(data).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function) {
                onError(e)
            } else {
                console.log("updateMyPassword", e)
            }
        })
    }

    uploadUserAvatar = ({data, onSuccess, onError}) => {
        this.apiRequest.uploadUserAvatar(data).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function) {
                onError(e)
            } else {
                console.log("uploadUserAvatar", e)
            }
        })
    }
}