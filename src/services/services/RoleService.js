import APIService from "../../utils/APIService";
import APIRequest from "../../utils/APIRequest";
import {BASE_API_ROLES} from "../endpoints/_constants";

export class RoleService extends APIService {
    constructor() {
        const apiRequest = new APIRequest(BASE_API_ROLES);
        super(apiRequest);
    }
}