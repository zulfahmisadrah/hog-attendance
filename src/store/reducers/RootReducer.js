import AuthReducer from "./AuthReducer";
import {combineReducers} from "redux";

const RootReducer = combineReducers({auth: AuthReducer});

export default RootReducer;
