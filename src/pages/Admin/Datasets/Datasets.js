import React from 'react';

import {Card, Col, Row, Tabs} from "antd";
import PropTypes from "prop-types";
import styled from "styled-components";
import {DatasetTable, GenerateDataset, Recognize, TrainModel} from "./components";

const StyledDiv = styled.div`
  .card-container p {
    margin: 0;
  }

  .card-container > .ant-tabs-card .ant-tabs-content {
    margin-top: -16px;
  }

  .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
    padding: 16px;
    background: #fff;
  }

  .card-container > .ant-tabs-card > .ant-tabs-nav::before {
    display: none;
  }

  .card-container > .ant-tabs-card .ant-tabs-tab,
  [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
    background: transparent;
    border-color: transparent;
  }

  .card-container > .ant-tabs-card .ant-tabs-tab-active,
  [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
    background: #fff;
    border-color: #fff;
  }

  #components-tabs-demo-card-top .code-box-demo {
    padding: 24px;
    overflow: hidden;
    background: #f5f5f5;
  }
`

Datasets.propTypes = {
    isSelectDataMode: PropTypes.bool,
    onDataSelected: PropTypes.func
}

export function Datasets() {

    return (
        <Row gutter={[16, 16]}>
            <Col xs={{span: 24, order: 1}} lg={{span: 12, order: 2}}>
                <StyledDiv>
                    <div className="card-container">
                        <Tabs type="card">
                            <Tabs.TabPane tab="Buat Dataset" key="1">
                                <GenerateDataset/>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Latih" key="2">
                                <TrainModel/>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Uji" key="3">
                                <Recognize/>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </StyledDiv>
            </Col>
            <Col xs={{span: 24, order: 2}} lg={{span: 12, order: 1}}>
                <Card title="Daftar Dataset">
                    <DatasetTable/>
                </Card>
            </Col>
        </Row>
    )
}