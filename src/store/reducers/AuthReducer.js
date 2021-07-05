function AuthReducer (state = {}, actions) {
    switch(actions.type) {
        case "SET_LOGIN":
            return {...state, isLoggedIn: true, user: actions.payload};
        case "SET_LOGOUT":
            return {...state, isLoggedIn: false, user: actions.payload};
        default:
            return state;
    }
}

export default AuthReducer;
