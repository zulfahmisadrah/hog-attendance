import React, {useEffect, useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {Layout, Menu} from "antd";
import {pathGroupFirstMenu, pathGroupName, pathSuperAdmin} from "../path";
import getNavigation from "../navigation";
import styled from 'styled-components';
import {useSelector} from "react-redux";
import {APP_NAME} from "../utils/Constants";

const StyledLayout = styled(Layout.Sider)`
  overflow-y: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  z-index: 999;

  .logo {
    width: 100px;
    margin: 16px;
  }

  .logoSmall {
    height: 40px;
    margin: 16px;
  }

  .ant-menu-dark .ant-menu-item-selected {
    border-right: 5px solid #d09228;
  }

  .ant-menu-item.path-group .path-group-name {
    font-weight: bold;
    font-size: 11px;
    margin: 0;
    color: #d09228;
  }

  .ant-menu-inline .ant-menu-item {
    margin-top: 0;
    margin-bottom: 0;
  }

  .ant-menu-item.path-group {
    height: auto;
    line-height: 15px;
    margin-top: 8px;

    &:hover {
      cursor: default;
      color: inherit;
    }

    &.show {
      display: block;
    }

    &.hidden {
      display: none;
    }

  }
`

function Sidebar(props) {
    const {collapsed, setCollapsed, isDesktop, setIsDesktop} = props;
    const userRole = useSelector(state => state.auth.user.role);
    const location = useLocation();
    const pathKey = location.pathname;

    const [active, setActive] = useState(pathKey);

    useEffect(() => {
        setActive(pathKey);
    }, [location, pathKey])

    const navLink = (navigations) => {
        let listNav = [];
        navigations.forEach((item) => {
            if (pathGroupFirstMenu.includes(item.href)) {
                listNav.push(
                    <li key={pathGroupName[item.href]}
                        className={`ant-menu-item path-group ${collapsed ? 'hidden' : 'show'}`}>
                        <p className="path-group-name">{pathGroupName[item.href]}</p>
                    </li>
                )
            }

            if (pathSuperAdmin.includes(item.href)) {
                if (userRole === 1) {
                    listNav.push(
                        <Menu.Item key={item.href} icon={item.icon}>
                            <NavLink to={item.href} onClick={isDesktop ? null : toggle}>{item.title}</NavLink>
                        </Menu.Item>
                    )
                }
            } else {
                listNav.push(
                    <Menu.Item key={item.href} icon={item.icon}>
                        <NavLink to={item.href} onClick={isDesktop ? null : toggle}>{item.title}</NavLink>
                    </Menu.Item>
                )
            }
        })
        return listNav;
    };

    const handleBreakpoint = (broken) => {
        setIsDesktop(!broken);
        setCollapsed(broken)
    }

    const toggle = () => setCollapsed(!collapsed)

    return (
        <StyledLayout
            breakpoint="md"
            collapsedWidth={isDesktop ? 80 : "0"}
            onBreakpoint={broken => handleBreakpoint(broken)}
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme="dark">
            <h3 style={collapsed ? {display: "none"} : {color: "white", textAlign: "center", fontWeight: "bold", margin: 16}}>{APP_NAME}</h3>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={[active]}>
                {navLink(getNavigation())}
            </Menu>
        </StyledLayout>
    )
}

export default Sidebar;
