import axios from 'axios';
import {BASE_API_AUTH_URL} from "../utils/Constants";


export const setAuthToken = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

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
    return axios.post(BASE_API_AUTH_URL + "me")
}

export const refreshToken = () => {
    return axios.post("oauth/access_token", {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: JSON.parse(localStorage.auth).refresh_token
        })
    })
        .then(res => {
            console.log("refresh", res)
            localStorage.auth = JSON.stringify(res)
        })
        .catch(() => {
            throw new Error("Unable to refresh!")
        })
}