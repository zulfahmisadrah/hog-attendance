import {getRefreshToken, getToken, removeAuth, storeAuth} from "../services/auth";
import axios from "axios";
import {BASE_API_URL} from "./Constants";
import {refreshToken} from "../services/client";
import {history} from "./history";
import {loginPath, rootPath} from "../path";

const token = getToken();

const axiosInstance = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    }
})

axiosInstance.interceptors.request.use(
    (req) => {
        const token = getToken();
        if (token) {
            req.headers["Authorization"] = 'Bearer ' + token;
        }
        return req;
    },
    (error) => {
        console.log("error", error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "auth/login" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const res = await refreshToken();
                    storeAuth(res.data);
                    return axiosInstance(originalConfig);
                } catch (_error) {
                    if (_error.response.status === 401){
                        removeAuth();
                        history.push(loginPath);
                        window.location.reload();
                    }
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);

export default axiosInstance;