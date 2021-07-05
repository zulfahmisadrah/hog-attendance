import {createStore} from 'redux';
import RootReducer from "./reducers/RootReducer";

const initialStates = {
    auth: {
        isLoggedIn: false,
        user: {}
    }
};

const store = createStore(RootReducer, initialStates, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
