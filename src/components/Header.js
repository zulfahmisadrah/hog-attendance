import React from 'react';

import {Avatar, Layout, Menu} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {getImage} from "../assets/images";
import styled from 'styled-components';
import {removeAuth} from "../services/auth"

const StyledHeader = styled(Layout.Header)`
  display: flex;
  background: #fff ;
  justify-content: space-between;
  align-items: center;
  box-shadow: 4px 4px 40px 0 rgba(0,0,0,.05);
    .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 0 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }
    
    .trigger:hover {
      color: #1890ff;
    }
    
    .rightContainer{
      display: flex;
      align-items: center;
      margin-right: 1rem;
    }
`
function Header(props){
    const {collapsed, setCollapsed} = props;
    const dispatch = useDispatch();
    const username = useSelector(state => state.auth.user.name);

    const handleLogout = () => {
        removeAuth();
        dispatch({type: "SET_LOGOUT"})
    };

    const toggle = () => setCollapsed(!collapsed)

    return (
        <StyledHeader theme="light"  style={{ padding: 0 }}>
            { collapsed ?
                <MenuUnfoldOutlined className="trigger" onClick={toggle}/> :
                <MenuFoldOutlined className="trigger" onClick={toggle}/>
            }
            <div className="rightContainer">
                <Menu key="user" mode="horizontal" >
                    <Menu.SubMenu
                        title={
                            <>
                                <span style={{ color: '#999', marginRight: 4 }}>
                                    Hi, {username}
                                </span>
                                <Avatar style={{ marginLeft: 8 }} src={getImage('avatar')} />
                            </>
                        }
                    >
                        <Menu.Item key="SignOut" onClick={handleLogout}>
                            Sign out
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </div>
        </StyledHeader>
    );
}

export default Header;
