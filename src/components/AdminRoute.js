import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from "react-redux";
import {rootPath} from "../path";

function AdminRoute({ component: Component, ...rest }){
    const userRole = useSelector(state => state.auth.user.role);
    return (
        <Route
            {...rest}
            render={props =>
                userRole < 3 ? (<Component {...props}/>) : (
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
}

export default AdminRoute;
