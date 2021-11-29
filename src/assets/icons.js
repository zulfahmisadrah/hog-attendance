import React from "react";
import {adminPath, pathName} from "../path";
import {
    DashboardOutlined,
    ReadOutlined,
    QuestionCircleOutlined,
    PlaySquareOutlined,
    ProfileOutlined,
    ScheduleOutlined,
    DeploymentUnitOutlined,
    DollarOutlined,
    FileTextOutlined,
    UserOutlined,
    UserSwitchOutlined,
    UnlockOutlined,
    ShareAltOutlined,
    SmileOutlined,
    NotificationOutlined,
    createFromIconfontCN
} from '@ant-design/icons';

const menuIcons = [
    <DashboardOutlined/>,
    <ReadOutlined />,
    <FileTextOutlined />,
    <ScheduleOutlined />,
    <ProfileOutlined />,
    <QuestionCircleOutlined />,
    <PlaySquareOutlined />,
    <UserOutlined />,
    <UserOutlined />,
    <DeploymentUnitOutlined />,
    <ShareAltOutlined />,
    <UserSwitchOutlined />,
    <UnlockOutlined />,
    <NotificationOutlined />,
    <SmileOutlined />,
    <DollarOutlined />,
];

const generateMenuIcon = (() => {
    const listMenuIcon = {};
    menuIcons.forEach((value, index) => {
        listMenuIcon[pathName[Object.values(adminPath)[index]]] = value
    })

    return listMenuIcon;
})

export const SidebarIcons = generateMenuIcon()

export const CustomIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2401194_picv7jar71m.js'
})
