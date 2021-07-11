import React from 'react';
import {useSelector} from "react-redux";
import {Layout, Typography} from "antd";
import styled from "styled-components";
import {getImage} from "../../../assets/images";

const StyledLayout = styled(Layout)`
  .image-container {
    position: relative;
    width: 100%;
    max-height: 200px;

    img {
      width: 100%;
      max-height: 200px;
      object-fit: cover;
      object-position: top;
    }
  }

  .greeting {
    position: absolute;
    margin: 0 16px;

    h4 {
      margin-bottom: 0;
    }

    .ant-typography {
      color: #fafafa;

    }
  }
`

function Header() {
    const username = useSelector(state => state.auth.user.name);

    return (
        <StyledLayout>
            <div className="image-container">
                <img src={getImage("header_home")} alt="header_home"/>
            </div>
            <div className="greeting">
                <Typography.Title level={4}>Halo, {username}</Typography.Title>
                <Typography.Text>Selamat datang !</Typography.Text>
            </div>
        </StyledLayout>
    )
}

export default Header;