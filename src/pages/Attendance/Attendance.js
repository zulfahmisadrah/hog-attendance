import React, {useEffect, useState} from 'react';
import {Button, Card, Col, List, Row, Space, Tag, Typography, Modal, Skeleton, Menu, Dropdown} from "antd";
import styled from "styled-components";
import {formatDateTime, getCurrentDateTime, showErrorModal, showSuccessNotification} from "../../utils/Commons";
import {createAttendance, fetchMyActiveMeetings, fetchMyScheduledMeetings} from "../../services";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {attendanceStatus} from "../../utils/Constants";
import {fetchMyAttendances} from "../../services";

const StyledList = styled(List)`
  padding: 16px;

  .ant-list-vertical .ant-list-item-meta {
    margin-bottom: 8px;
  }

  .ant-tag {
    font-size: 12px;
    padding: 0 2px;
    margin-right: 3px;
    margin-top: 2px;
  }

  .ant-card {
    border-radius: .5rem;
  }
`

const listTitle = {
    name: "Nama Pertemuan",
    number: "Pertemuan ke-",
    schedule: "Jadwal",
    duration: "Durasi",
}

function Attendances() {

    const [data, setData] = useState([{}, {}, {}])
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        setLoading(true)
        fetchMyAttendances(onDataFetched);
    }

    const onDataFetched = (listData) => {
        setData(listData)
        setLoading(false)
    }

    const generateDetails = (record) => {
        let details = [];
        Object.keys(listTitle).forEach(key => {
            const value = record[key]
            if (value) {
                details.push(
                    <Row key={key} style={{marginBottom: 6}}>
                        <Col xs={{span: 24}} lg={{span: 10}}>
                            <Typography.Text strong>{listTitle[key]}</Typography.Text>
                        </Col>
                        <Col xs={{span: 24}} lg={{span: 14}}>
                            <Typography.Text>{key === "schedule" ? formatDateTime(value) : value}</Typography.Text><br/>
                        </Col>
                    </Row>
                )
            }
        })
        return details
    }

    const showDetailsModal = (item) => {
        Modal.info({
            title: 'Rincian data',
            okText: 'Tutup',
            content: (
                <>
                    {generateDetails(item)}
                </>
            )
        })
    }

    const getTagColor = (status) => {
        let color
        switch (status) {
            case attendanceStatus.attend:
                color = "green"
                break;
            case attendanceStatus.permitted:
                color = "blue"
                break;
            case attendanceStatus.sick:
                color = "orange"
                break;
            case attendanceStatus.absent:
                color = "red"
                break;
            default:
                break;
        }
        return <Tag color={color}>{status}</Tag>
    }

    return (
        <>
            <StyledList
                itemLayout="vertical"
                pagination={{pageSize: 10,}}
                grid={{gutter: [8, 0], xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4}}
                dataSource={data}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <Card>
                            <Skeleton loading={loading} active>
                                <Row style={{marginBottom: 8}}>
                                    {getTagColor(item.status)}
                                </Row>
                                <Typography.Title level={5}>{item.meeting?.name} {item.meeting?.number}</Typography.Title>
                                <Typography.Text type="secondary">
                                    {`${formatDateTime(item.checkInTime)}`}
                                </Typography.Text><br/>
                                <Typography.Text type="secondary">
                                    {item.notes}
                                </Typography.Text>
                                <Row justify="end" style={{marginTop: 8}}>
                                    <Space>
                                        <Button type="secondary" onClick={() => showDetailsModal(item)}>Rincian</Button>
                                    </Space>
                                </Row>
                            </Skeleton>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default Attendances;