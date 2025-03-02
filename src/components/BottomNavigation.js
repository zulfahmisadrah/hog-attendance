import React from 'react';

import {Col, Layout, Row, Typography} from "antd";
import {
    HomeOutlined,
    ProfileOutlined,
    ProfileFilled,
    HomeFilled,
    CalendarFilled,
    CalendarOutlined,
    CheckSquareFilled,
    CheckSquareOutlined
} from "@ant-design/icons";
import styled from 'styled-components';
import {NavLink} from "react-router-dom";
import {userPath} from "../path";
import {COLOR_BOTTOM_NAV_ACTIVE, COLOR_BOTTOM_NAV_INACTIVE} from "../utils/colors";

const StyledFooter = styled(Layout.Footer)`
  position: fixed;
  bottom: 0;
  height: 64px;
  width: 100%;
  padding: 0;
  background: #fff;
  box-shadow: 4px 4px 40px 0 rgba(0, 0, 0, .15);

  .ant-row .anticon {
    transition: all 3s;
    &:hover {
      color: #d09228;
    }
  }
`

function BottomNavigation(props) {
    const {currentPath} = props

    const listMenu = [
        {
            title: "Home",
            url: userPath.home
        },
        {
            title: "Pertemuan",
            url: userPath.meetings
        },
        {
            title: "Riwayat",
            url: userPath.history
        },
        {
            title: "Profil",
            url: userPath.profile
        },
    ]

    const generateBottomNavMenu = () => (
        listMenu.map(menu => {
            const isActive = menu.url === currentPath
            const color = isActive ? COLOR_BOTTOM_NAV_ACTIVE : COLOR_BOTTOM_NAV_INACTIVE

            const iconStyle = {
                fontSize: 22,
                color: color,
                margin: "12px 0 0 0",
                transition: "all 0.5s"
            }

            const listMenuIcon = {
                [userPath.home]: isActive ? <HomeFilled style={iconStyle}/> :
                    <HomeOutlined style={iconStyle}/>,
                [userPath.meetings]: isActive ? <CalendarFilled style={iconStyle}/> :
                    <CalendarOutlined style={iconStyle}/>,
                [userPath.history]: isActive ? <CheckSquareFilled style={iconStyle}/> :
                    <CheckSquareOutlined style={iconStyle}/>,
                [userPath.profile]: isActive ? <ProfileFilled style={iconStyle}/> :
                    <ProfileOutlined style={iconStyle}/>,
            }

            return (
                <Col span={6} key={menu.title}>
                    <NavLink to={menu.url}>
                        <Row justify="center">
                            {listMenuIcon[menu.url]}
                        </Row>
                        <Row justify="center">
                            <Typography.Text
                                type={isActive ? "default" : "secondary"}
                                style={{color: color, transition: "all 5s"}}
                                strong={isActive}
                            >
                                {menu.title}
                            </Typography.Text>
                        </Row>
                    </NavLink>
                </Col>
            )
        })
    )

    return (
        <StyledFooter>
            <Row justify="space-around" align="middle">
                {generateBottomNavMenu()}
            </Row>
        </StyledFooter>
    );
}

export default BottomNavigation;
