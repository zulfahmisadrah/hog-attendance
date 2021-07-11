import React from 'react';
import {Space} from "antd";
import {Header, Menu} from "./components";


function Home() {

    return (
        <Space direction="vertical">
            <Header/>
            <Menu/>
        </Space>
    )
}

export default Home;