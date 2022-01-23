import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import {BASE_API_AUTH_URL} from "../utils/Constants";
import {getRefreshToken} from "./auth";


export const authLogin = (formData) => {
    const params = new URLSearchParams();
    params.append('username', formData.username);
    params.append('password', formData.password);
    return axios.post(BASE_API_AUTH_URL + "login", params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export const fetchUserData = () => {
    return axiosInstance.post("auth/me")
}

export const refreshToken = () => {
    const data = new FormData();
    data.append("refresh_token", getRefreshToken());
    return axios.post(BASE_API_AUTH_URL + "refresh", data);
}