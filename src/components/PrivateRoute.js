import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from "react-redux";
import {loginPath} from "../path";

function PrivateRoute({ component: Component, ...rest }){
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props}/>
                ) : (
                    <Redirect
                        to={{
                            pathname: loginPath,
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
