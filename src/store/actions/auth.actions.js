import {authConstants} from "../_constants";
import {alertActions} from "./alert.actions";
import {history} from "../../utils/history";

function login(username, password) {
    const request = (user) => ({type: authConstants.AUTH_LOGIN_REQUEST, user})
    const success = (user) => ({type: authConstants.AUTH_LOGIN_SUCCESS, user})
    const failure = (error) => ({type: authConstants.AUTH_LOGIN_FAILURE, error})

    return dispatch => {
        dispatch(request({username}))
        authService.login(username, password)
            .then(
                user => {
                    dispatch(success(user))
                    history.push('/')
                },
                error => {
                    dispatch(failure(error))
                    dispatch(alertActions.error(error))
                }
            )
    }
}

function logout() {
    authService.logout()
    return {type: authConstants.AUTH_LOGOUT}
}

export const authActions = {
    login,
    logout
}