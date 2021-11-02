import React from 'react';

import {Layout, Typography, Row, Button} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import styled from 'styled-components';
import {bottomNavPath, userPath, teacherPathTitle} from "../path";
import {APP_NAME} from "../utils/Constants";
import {matchPath} from "react-router-dom";

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
    const {currentPath, onBackPressed, isBackOnly} = props;

    const isBottomNavPath = Object.values(bottomNavPath).indexOf(currentPath) !== -1
    const isHomePath = bottomNavPath.home === currentPath;

    const curerentRoute = Object.values(userPath).find(values => {
        const match = matchPath(currentPath, values)
        return match?.isExact
    })

    return (
        <>
            {isBackOnly ? (
                    <div style={{position: "absolute", padding: 16, zIndex: 99}}>
                        <Button
                            type="primary"
                            icon={<ArrowLeftOutlined/>}
                            onClick={onBackPressed}
                            style={{opacity: 0.7}}
                        >
                            Kembali
                        </Button>
                    </div>
                ) :
                <StyledHeader theme="dark" style={{padding: "0 8px"}}>
                    {isBottomNavPath ? (
                        <div className="icon-container">
                            {isHomePath ?
                                <Typography.Text>{APP_NAME}</Typography.Text> :
                                <Typography.Text>{teacherPathTitle[currentPath]}</Typography.Text>
                            }
                        </div>
                    ) : (
                        <Row align="middle">
                            <ArrowLeftOutlined className="back-icon" onClick={onBackPressed}/>
                            <Typography.Text>{teacherPathTitle[curerentRoute]}</Typography.Text>
                        </Row>
                    )}
                    <div className="rightContainer">
                        {/*<Notifications/>*/}
                    </div>
                </StyledHeader>
            }
        </>
    );
}

export default Appbar;
