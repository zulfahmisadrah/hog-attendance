import React, {useEffect} from "react";
import {Appbar, BottomNavigation} from "../components";
import {BackTop, Button, Layout} from "antd";
import {getRoutes} from "../Routes";
import {ArrowUpOutlined} from "@ant-design/icons";
import {useHistory, useLocation} from "react-router-dom";
import {teacherBottomNavPath, noAppbarPath, teacherPath} from "../path";
import {useDispatch} from "react-redux";

function MainContainer() {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const currentPath = location.pathname
    const isteacherBottomNavPath = Object.values(teacherBottomNavPath).indexOf(currentPath) !== -1
    const isNoAppbarPath = Object.values(noAppbarPath).indexOf(currentPath) !== -1

    useEffect(() => {
    }, [location, currentPath])

    const onBackPressed = () => {
    
        history.goBack()
    }

    return (
        <Layout className="app site-layout" style={{
            minHeight: '100vh',
            fontFamily: `'Open Sans', sans-serif`
        }}>
            {!isNoAppbarPath? <Appbar currentPath={currentPath} onBackPressed={onBackPressed}/> : null}
            <Layout style={{margin: isteacherBottomNavPath ? '55px 0' : '55px 0 16px 0'}}>
                {getRoutes()}
            </Layout>
            {isteacherBottomNavPath ? <BottomNavigation currentPath={currentPath}/> : null }
            <BackTop visibilityHeight={100} style={{right: 30, bottom: isteacherBottomNavPath ? 80 : 60}}>
                <Button type="primary" shape="circle" icon={<ArrowUpOutlined/>} size="large"/>
            </BackTop>
        </Layout>
    )
}

export default MainContainer;