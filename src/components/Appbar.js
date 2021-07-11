import React from 'react';

import {Layout, Typography, Row} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {getImage} from "../assets/images";
import styled from 'styled-components';
import {teacherBottomNavPath, teacherPathTitle} from "../path";
import Notifications from "./Notifications";

const StyledHeader = styled(Layout.Header)`
  position: fixed;
  height: 56px;
  top: 0;
  width: 100%;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .back-icon {
    color: #ffffff;
    font-size: 20px;
    padding: 0 0 0 16px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #d09228;
    }
  }

  .rightContainer {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  .ant-typography {
    color: #ffffff;
    font-size: 18px;
    margin-left: 16px;
    font-weight: bold;
  }

  .icon-container {
    display: flex;
    margin: 10px;
    justify-content: center;

    img {
      width: 35px;
      height: 35px;
    }

    .ant-typography {
      margin-left: 0;
    }
  }

  .notification-icon {
    font-size: 24px;
    color: #ffffff;
  }
`

function Appbar(props) {
    const {currentPath, onBackPressed} = props;

    const isBottomNavPath = Object.values(teacherBottomNavPath).indexOf(currentPath) !== -1
    const isHomePath = teacherBottomNavPath.home === currentPath

    return (
        <StyledHeader theme="dark" style={{padding: "0 8px"}}>
            {isBottomNavPath ?
                (
                    <div className="icon-container">
                        {isHomePath ?
                            <Typography.Text>SISTEM PRESENSI</Typography.Text> :
                            <Typography.Text>{teacherPathTitle[currentPath]}</Typography.Text>
                        }
                    </div>
                )
                :
                (
                    <Row align="middle">
                        <ArrowLeftOutlined className="back-icon" onClick={onBackPressed}/>
                        <Typography.Text>{teacherPathTitle[currentPath]}</Typography.Text>
                    </Row>
                )
            }
            <div className="rightContainer">
                <Notifications/>
            </div>
        </StyledHeader>
    );
}

export default Appbar;
