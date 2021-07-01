import React from 'react';
import './App.less';
import {useSelector} from "react-redux";
import {AdminContainer, MainContainer} from "./Containers";

function App() {
    const userRole = useSelector(state => state.auth.user.role);

    return userRole < 3 ? <AdminContainer/> : <MainContainer/>
}

export default App;
