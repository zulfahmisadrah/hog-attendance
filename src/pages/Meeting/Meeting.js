import React from 'react';
import {Tabs} from "antd";
import styled from "styled-components";
import {Page404} from "../../components";
import MeetingList from './components/MeetingList';

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav{
    background: #ffffff;
    position: fixed;
    z-index: 999;
    width: 100%;
    padding: 0 16px;
  }
  
  .ant-tabs-nav-list{
    width: 100%;
    justify-content: space-around;
  }
  
  .ant-tabs-tab-btn {
  }

  .ant-tabs-content-holder{
    margin-top: 46px;
  }
`

function Meeting() {

    return (
        <StyledTabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab="Hari ini" key="1">
                <MeetingList type="active"/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Terjadwal" key="2">
                <MeetingList type="scheduled"/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Selesai" key="3">
                <MeetingList type="finished"/>
            </Tabs.TabPane>
        </StyledTabs>
    )
}

export default Meeting;