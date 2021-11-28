import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Button, Card, Col, Layout, List, Row, Select, Typography} from "antd";
import {CourseService, MeetingService} from "../../services/services";
import {attendanceStatusOptions, showDataUpdatedMessage} from "../../utils/Commons";
import {AttendanceService} from "../../services/services/AttendanceService";


export function MeetingAttendances() {
    let {meeting_id} = useParams();

    const [meeting, setMeeting] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [updatedAttendances, setUpdatedAttendances] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);

    const meetingService = new MeetingService();
    const attendanceService = new AttendanceService();
    const courseService = new CourseService();

    const fetchMeetingDetails = (meeting_id) => {
        meetingService.getData({
            id: meeting_id,
            onSuccess: (meeting) => {
                setMeeting(meeting)
            }
        })
    }

    const fetchMeetingAttendances = (meeting_id) => {
        meetingService.getListAttendances({
            id: meeting_id,
            onSuccess: (listData) => {
                const attendances = listData.sort((a ,b) => a.student?.user?.username?.localeCompare(b.student?.user?.username));
                setAttendances(attendances);
            }
        })
    }

    useEffect(() => {
        fetchMeetingDetails(meeting_id)
        fetchMeetingAttendances(meeting_id)
    }, [meeting_id]);

    useEffect(() => {
        meeting && getListStudents(meeting)
        meeting && getListLecturers(meeting)
    }, [meeting]);

    const getListStudents = (meeting) => {
        courseService.getCourseStudents({
            course_id: meeting?.course?.id,
            onSuccess: (listData) => {
                setStudents(listData)
            }
        })
    }

    const getListLecturers = (meeting) => {
        courseService.getCourseLecturers({
            course_id: meeting?.course?.id,
            onSuccess: (listData) => {
                setLecturers(listData)
            }
        })
    }

    const handleSaveAttendance = () => {
        console.log(updatedAttendances)
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
            <Card>
                <Row className="w-100">
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
                <List
                    dataSource={attendances}
                    renderItem={attendance => (
                        <List.Item key={attendance.id}>
                            <Row className="w-100">
                                <Col span={17}>
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
                                <Col span={7}>
                                    <Row justify="end">
                                        <Select
                                            style={{width: 100}}
                                            onChange={(newValue) => handleAttendanceChanged(attendance, newValue)}
                                            options={attendanceStatusOptions}
                                            defaultValue={attendance.status}
                                        />
                                    </Row>
                                </Col>
                            </Row>
                        </List.Item>
                    )}
                />
            </Card>
        </Layout.Content>
    )
}