import React, {useEffect, useState} from 'react';
import {Button, Card, Col, List, Row, Space, Tag, Typography, Modal, Skeleton, Menu, Dropdown} from "antd";
import styled from "styled-components";
import {
    formatDateTime,
    getCurrentDateTime, getDateTimeFromString,
    getMoment,
    showErrorModal,
    showSuccessNotification
} from "../../utils/Commons";
import {createAttendance, fetchMyActiveMeetings, fetchMyScheduledMeetings} from "../../services";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {attendanceStatus, dateFormat, dateTextFormat, timeFormat, timeTextFormat} from "../../utils/Constants";
import {fetchMyAttendances} from "../../services";
import {MeetingService} from "../../services/services";
import MeetingList from "../Meeting/components/MeetingList";
import {AttendanceService} from "../../services/services/AttendanceService";
import {AttendanceTag} from "../../components";

const StyledList = styled(List)`
  padding: 16px;

  .ant-list-vertical .ant-list-item-meta {
    margin-bottom: 8px;
  }

  .ant-tag {
    //font-size: 12px;
    padding: 0 2px;
    //margin-right: 3px;
    //margin-top: 2px;
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
    const userRole = useSelector(state => state.auth.user.role);

    const [data, setData] = useState([{}, {}, {}])
    const [loading, setLoading] = useState(false);

    const attendanceService = new AttendanceService();

    useEffect(() => {
        userRole === 4 && fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true)
        attendanceService.getMyAttendances({
            onSuccess: onDataFetched
        });
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

    const generateMeetingDescription = (meeting) => {
        const strDate = formatDateTime(meeting?.date, dateTextFormat, dateFormat)
        const strStartTime = formatDateTime(meeting?.schedule?.start_time, timeTextFormat, timeFormat)
        const strEndTime = formatDateTime(meeting?.schedule?.end_time, timeTextFormat, timeFormat)
        return `${strDate} ${strStartTime}-${strEndTime}`
    }

    return (
        <>
            {userRole === 3 ? (
                <MeetingList type="finished" />
            ) : (
                <StyledList
                    itemLayout="vertical"
                    pagination={{pageSize: 10, hideOnSinglePage: true}}
                    grid={{gutter: [8, 0], xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4}}
                    dataSource={data}
                    renderItem={attendance => (
                        <List.Item key={attendance.id}>
                            <Card>
                                <Skeleton loading={loading} active>
                                    <Space direction="vertical">
                                        <Row gutter={[0, 4]}>
                                            <Col span={24}>
                                                <Typography.Text>Pertemuan {attendance?.meeting?.number}</Typography.Text>
                                            </Col>
                                            <Col span={24}>
                                                <Typography.Text strong style={{fontSize: 16}}>{attendance?.meeting?.course?.name}</Typography.Text>
                                            </Col>
                                            <Col span={24}>
                                                <Typography.Text>{generateMeetingDescription(attendance?.meeting)}</Typography.Text>
                                            </Col>
                                            <Col span={24}>
                                                <Typography.Text strong>Status : <AttendanceTag data={attendance.status} /></Typography.Text>
                                            </Col>
                                        </Row>
                                    </Space>
                                </Skeleton>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </>
    )
}

export default Attendances;