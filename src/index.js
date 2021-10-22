import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from "./store";
import {BrowserRouter, Switch} from "react-router-dom";
import {loginPath, registerPath, rootPath} from "./path";
import {GuestRoute, Login, PrivateRoute, Register} from "./components";
import {getToken} from "./services/auth";

import {BASE_API_URL} from './utils/Constants';
import { fetchUserData, setAuthToken } from './services/client';

axios.defaults.baseURL = BASE_API_URL
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'

function render() {
    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <GuestRoute exact path={loginPath} component={Login}/>
                        <GuestRoute exact path={registerPath} component={Register}/>
                        <PrivateRoute path={rootPath} component={App}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

const token = getToken()
if (token) {
    setAuthToken(token)
    fetchUserData().then(res => {
        const user = res.data
        if (user.is_active) {
            const userRole = user.roles[0].id
            const payload = {
                id: user.id,
                name: user.name,
                username: user.username,
                role: userRole
            }
            store.dispatch({type: "SET_LOGIN", payload: payload})
            render()
        } else {
            render()
        }
    }).catch(e => {
        console.log(e)
        render()
    })
} else {
    render()
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();