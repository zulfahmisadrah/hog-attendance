import React, {useState} from "react";
import {Header, Sidebar} from "../components";
import {BackTop, Button, Layout} from "antd";
import {getAdminRoutes} from "../Routes";
import {ArrowUpOutlined} from "@ant-design/icons";

function AdminContainer() {
    const [isDesktop, setIsDesktop] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const toggle = (value) => setCollapsed(value);
    const toggleDesktop = (value) => setIsDesktop(value);

    return (
        <Layout className="app site-layout">
            <Sidebar open collapsed={collapsed} setCollapsed={toggle} isDesktop={isDesktop}
                     setIsDesktop={toggleDesktop}/>
            <Layout style={
                isDesktop ?
                    collapsed ? {marginLeft: 80} : {marginLeft: 200}
                    : {margin: 0}
            }>
                <Header collapsed={collapsed} setCollapsed={toggle}/>
                <Layout.Content
                    style={{
                        margin: 16,
                    }}
                >
                    {getAdminRoutes()}
                </Layout.Content>
                <BackTop visibilityHeight={100} style={{right: isDesktop? "50px" : "30px"}}>
                    <Button type="primary" shape="circle" icon={<ArrowUpOutlined/>} size="large"/>
                </BackTop>
            </Layout>
        </Layout>
    )
}

export default AdminContainer;