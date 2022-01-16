import APIRequest from "../../utils/APIRequest";
import {BASE_API_USERS} from "./_constants";
import axios from '../../utils/axiosInstance';

const baseUrl = BASE_API_USERS;

export class UserRequest extends APIRequest {
    constructor() {
        super(baseUrl);
    }

    updateMyData = (data) => axios.put(this.baseUrl + "me", data)
    updateMyPassword = (data) => axios.put(this.baseUrl + "update_password", data)
    uploadUserAvatar = (data) => axios.post(this.baseUrl + "upload_avatar", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}

export default UserRequest;