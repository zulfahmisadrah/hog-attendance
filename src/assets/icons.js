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
    <QuestionCircleOutlined />,
    <ProfileOutlined />,
    <ScheduleOutlined />,
    <PlaySquareOutlined />,
    <DeploymentUnitOutlined />,
    <DollarOutlined />,
    <FileTextOutlined />,
    <UserOutlined />,
    <UserSwitchOutlined />,
    <NotificationOutlined />,
    <UnlockOutlined />,
    <ShareAltOutlined />,
    <SmileOutlined />,
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
