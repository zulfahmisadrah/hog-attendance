import React, {useEffect, useState} from "react";
import {Appbar, BottomNavigation} from "../components";
import {BackTop, Button, Layout} from "antd";
import {getRoutes} from "../Routes";
import {ArrowUpOutlined} from "@ant-design/icons";
import {matchPath, useHistory, useLocation} from "react-router-dom";
import {bottomNavPath, noAppbarPath} from "../path";
import {useDispatch} from "react-redux";

function MainContainer() {
    const history = useHistory();
    const location = useLocation();
    const currentPath = location.pathname
    const isteacherBottomNavPath = Object.values(bottomNavPath).indexOf(currentPath) !== -1
    const curerentRoute = Object.values(noAppbarPath).find(values => {
        const match = matchPath(currentPath, values)
        return match?.isExact
    })
    const isNoAppbarPath = curerentRoute?.length > 0

    useEffect(() => {
    }, [location, currentPath])

    const onBackPressed = () => {
        history.goBack()
    }

    const [actionButton, setActionButton] = useState(null);

    return (
        <Layout className="app site-layout" style={{
            minHeight: '100vh',
            fontFamily: `'Open Sans', sans-serif`
        }}>
            <Appbar currentPath={currentPath} onBackPressed={onBackPressed} isBackOnly={isNoAppbarPath}/>
            <Layout style={{margin: isteacherBottomNavPath ? '55px 0' : isNoAppbarPath ? 0 : '55px 0 16px 0'}}>
                {getRoutes(setActionButton)}
            </Layout>
            {isteacherBottomNavPath ? <BottomNavigation currentPath={currentPath}/> : null }
            <BackTop visibilityHeight={100} style={{right: 30, bottom: isteacherBottomNavPath ? 80 : 60}}>
                <Button type="primary" shape="circle" icon={<ArrowUpOutlined/>} size="large"/>
            </BackTop>
        </Layout>
    )
}

export default MainContainer;