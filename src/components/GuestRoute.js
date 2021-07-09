import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from "react-redux";
import {rootPath} from "../path";

function GuestRoute({ component: Component, ...rest }){
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    return (
        <Route
            {...rest}
            render={props =>
                !isLoggedIn ? (
                    <Component {...props}/>
                ) : (
                    <Redirect
                        to={{
                            pathname: rootPath,
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
};

export default GuestRoute;
