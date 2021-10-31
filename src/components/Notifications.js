import React, {useEffect, useState} from 'react';

import {Layout, Badge, Typography, List, Dropdown, Menu} from "antd";
import {ArrowLeftOutlined, BellFilled} from "@ant-design/icons";
import {getImage} from "../assets/images";
import styled from 'styled-components';
import {bottomNavPath, userPath, userPathTitle} from "../path";
import {removeStringHTMLTags, showInfoModal} from "../utils/Commons";
import htmr from "htmr";

const StyledHeader = styled(Layout.Header)`
  position: fixed;
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

function Notifications(props) {
    const {currentPath, onBackPressed} = props;

    const isBottomNavPath = Object.values(bottomNavPath).indexOf(currentPath) !== -1
    const isHomePath = bottomNavPath.home === currentPath
    const _data = [
        {
            id: "1",
            recipients: "all",
            type: "info",
            title: "Lengkapi Profil Anda",
            description: "<p>Anda dapat melengkapi profil Anda dengan cara:</p><p>1. Klik Menu Profil.</p><p>2. Klik Tombol Edit Profil.</p><p>3. Isi form sesuai data diri Anda.</p><p>4. Klik Tombol Simpan. </p>" ,
            read: false,
            createdAt: "11/11/2022 00:00 WITA"
        },
    ]
    const [data, setData] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        setData(_data)
    }

    const showDetailsModal = (item) => {
        showInfoModal({
            title: item.title,
            content: htmr(item.description)
        })
    }

    const cutShortText = (text, length = 25) => {
        const result = text.substring(0, length+1)
        return text.length < length ? result : result + "..."
    }

    const menu = (
        <Menu>
            {
                data.map(item => (
                    <Menu.Item key={item.id} onClick={() => showDetailsModal(item)}>
                        <Typography.Text strong>{cutShortText(item.title)}</Typography.Text><br/>
                        <Typography.Text type="secondary">{cutShortText(removeStringHTMLTags(item.description))}</Typography.Text>
                    </Menu.Item>
                ))
            }
        </Menu>
    )

    return (
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <Badge dot>
                <BellFilled className="notification-icon"/>
            </Badge>
        </Dropdown>
    );
}

export default Notifications;
