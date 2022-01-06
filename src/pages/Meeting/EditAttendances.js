import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Button, Card, Col, Layout, List, Row, Select, Space, Typography} from "antd";
import {MeetingService} from "../../services/services";
import {attendanceStatusOptions, showDataUpdatedMessage} from "../../utils/Commons";
import {AttendanceService} from "../../services/services/AttendanceService";
import {AttendanceBadge, AttendanceBadgesLegend, AttendanceFilter} from "../../components";
import styled from "styled-components";

const StyledCard  = styled(Card)`
  position: fixed;
  z-index: 999;
  width: 100%;
  .ant-card-body {
    padding-top: 4px;
    padding-bottom: 8px;
  }
`

export function EditAttendances() {
    let {meeting_id} = useParams();

    const [attendances, setAttendances] = useState([]);
    const [updatedAttendances, setUpdatedAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [filter, setFilter] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const meetingService = new MeetingService();
    const attendanceService = new AttendanceService();

    const fetchMeetingAttendances = (meeting_id) => {
        meetingService.getListAttendances({
            id: meeting_id,
            onSuccess: (listData) => {
                const attendances = listData.sort((a, b) => a.student?.user?.username?.localeCompare(b.student?.user?.username));
                setAttendances(attendances);
                // setFilteredData(attendances);
            }
        })
    }

    useEffect(() => {
        fetchMeetingAttendances(meeting_id)
    }, [meeting_id]);

    const handleSaveAttendance = () => {
        setLoading(true);
        updatedAttendances.forEach((data, index) => {
            attendanceService.updateData({
                data: data,
                onSuccess: () => {
                    if (index === updatedAttendances.length - 1) {
                        fetchMeetingAttendances(meeting_id);
                        showDataUpdatedMessage();
                        setLoading(false);
                    }
                }
            })
        })
    }

    const filterAttendance = (filter) => {
        setFilter(filter);
        const filteredData = attendances.filter(attendance => attendance.status === filter);
        setFilteredData(filteredData);
    }

    const handleAttendanceChanged = (attendance, newValue) => {
        const originalData = attendances.find(data => data.id === attendance.id);
        if (updatedAttendances.length === 0 && newValue !== originalData.status) {
            const updatedAttendance = {
                id: attendance.id,
                status: newValue
            }
            setUpdatedAttendances((prevState => ([...prevState, updatedAttendance])))
            setSaveDisabled(false);
        } else if (updatedAttendances.length > 0 && newValue !== originalData.status) {
            const updatedData = updatedAttendances.find(data => data.id === attendance.id);
            if (updatedData) {
                setUpdatedAttendances((prevState => {
                    return prevState.map(value => value.id === attendance.id ? {...value, status: newValue} : value)
                }));
            } else {
                const updatedAttendance = {
                    id: attendance.id,
                    status: newValue
                }
                setUpdatedAttendances((prevState => ([...prevState, updatedAttendance])))
            }
            setSaveDisabled(false);
        } else if (updatedAttendances.length > 1 && newValue === originalData.status) {
            setUpdatedAttendances(updatedAttendances.filter(data => data.id !== attendance.id));
        } else if (updatedAttendances.length === 1 && newValue === originalData.status) {
            setSaveDisabled(true);
            setUpdatedAttendances(updatedAttendances.filter(data => data.id !== attendance.id));
        } else {
            setSaveDisabled(true);
        }
    }

    return (
        <Layout.Content>
            <StyledCard>
                <Row className="w-100" gutter={[8, 8]}>
                    <Col span={24}>
                        <Row className="w-100" align="middle" justify="start" gutter={8}>
                            <Col>
                                <Typography.Text strong>Filter: </Typography.Text>
                            </Col>
                            <Col flex="90px">
                                <AttendanceFilter onSelected={filterAttendance} type="dropdown"/>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={17}>
                        <Typography.Title level={5}>Daftar Mahasiswa</Typography.Title>
                    </Col>
                    <Col span={7}>
                        <Row justify="end">
                            <Button type="primary" onClick={handleSaveAttendance}
                                    disabled={saveDisabled} loading={loading}>Simpan</Button>
                        </Row>
                    </Col>
                </Row>
            </StyledCard>
            <Card style={{marginTop: 60}}>
                <List
                    dataSource={filter ? filteredData : attendances}
                    renderItem={attendance => (
                        <List.Item key={attendance.id}>
                            <Row className="w-100" wrap={false}>
                                <Col flex="auto">
                                    <Row>
                                        <Col span={24}>
                                            <Typography.Text strong style={{fontSize: 14}}>
                                                {attendance.student?.user?.name}
                                            </Typography.Text>
                                        </Col>
                                        <Col span={24}>
                                            <Typography.Text type="secondary">
                                                {attendance.student?.user?.username}
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                                {attendance?.status_by_student !== attendance.status && (
                                    <Col flex="10px">
                                        <AttendanceBadge data={attendance.status_by_student}/>
                                    </Col>
                                )}
                                <Col flex="90px">
                                    <Select
                                        style={{width: 100}}
                                        onChange={(newValue) => handleAttendanceChanged(attendance, newValue)}
                                        options={attendanceStatusOptions}
                                        defaultValue={attendance.status}
                                    />
                                </Col>
                            </Row>
                        </List.Item>
                    )}
                />
            </Card>
            <Card>
                <AttendanceBadgesLegend/>
            </Card>
        </Layout.Content>
    )
}