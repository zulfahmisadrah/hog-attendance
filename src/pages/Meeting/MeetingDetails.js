import React, {useEffect, useState} from 'react';
import {Button, Card, Col, List, Row, Skeleton, Typography} from "antd";
import {CourseService, MeetingService} from "../../services/services";
import {formatDateTime, showDataUpdatedNotification} from "../../utils/Commons";
import {
    attendanceStatus,
    dateFormat,
    dateTextFormat,
    MeetingStatus,
    timeFormat,
    timeTextFormat
} from "../../utils/Constants";
import {useParams, useHistory} from "react-router-dom";
import {userPath} from "../../path";
import {AttendanceService} from "../../services/services/AttendanceService";
import {CameraFilled} from "@ant-design/icons";
import {ButtonEditSchedule} from "./components/ButtonEditSchedule";
import {AttendanceTag} from "../../components";


export function MeetingDetails() {
    let {meeting_id} = useParams();
    const history = useHistory();

    const [meeting, setMeeting] = useState(null);
    const [lecturers, setLecturers] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(null);

    const meetingService = new MeetingService();
    const courseService = new CourseService();
    const attendanceService = new AttendanceService();
    const totalAttend = attendances.filter(attendance => attendance?.status === attendanceStatus.attend).length

    const fetchMeetingDetails = (meeting_id) => {
        setLoading(true);
        meetingService.getData({
            id: meeting_id,
            onSuccess: (meeting) => {
                setMeeting(meeting);
                setLoading(false);
            }
        })
    }

    const fetchMeetingAttendances = (meeting_id) => {
        setLoading(true);
        meetingService.getListAttendances({
            id: meeting_id,
            onSuccess: (attendances) => {
                setAttendances(attendances);
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        fetchMeetingDetails(meeting_id);
        fetchMeetingAttendances(meeting_id);
    }, [meeting_id]);

    const getListLecturers = (meeting) => {
        courseService.getCourseLecturers({
            course_id: meeting?.course?.id,
            onSuccess: (listData) => {
                setLecturers(listData);
            }
        })
    }

    const getListStudents = (meeting) => {
        courseService.getCourseStudents({
            course_id: meeting?.course?.id,
            onSuccess: (listData) => {
                setStudents(listData)
            }
        })
    }

    useEffect(() => {
        meeting && getListLecturers(meeting);
        meeting && getListStudents(meeting);
    }, [meeting]);

    const generateMeetingDescription = (meeting) => {
        const startTime = meeting?.start_time || meeting?.schedule?.start_time;
        const endTime = meeting?.end_time || meeting?.schedule?.end_time;
        const strDate = formatDateTime(meeting?.date, dateTextFormat, dateFormat)
        const strStartTime = formatDateTime(startTime, timeTextFormat, timeFormat)
        const strEndTime = formatDateTime(endTime, timeTextFormat, timeFormat)
        return `${strDate} ${strStartTime}-${strEndTime}`
    }

    const handleTakeAttendance = () => {
        history.push(`${userPath.meetings}/${meeting.id}/attendances`)
    }

    const handleManualAttendance = () => {
        history.push(`${userPath.meetings}/${meeting.id}/attendances/edit`)
    }

    const updateMeeting = (data, onSuccess, onError) => {
        meetingService.updateData({
            data: data,
            onSuccess: () => {
                onSuccess();
                showDataUpdatedNotification();
                fetchMeetingDetails(meeting_id);
            },
            onError: (e) => {
                onError(e);
            }
        })
    }

    return (
        <>
            <Card>
                <Skeleton loading={loading} active>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <Typography.Text type="secondary">Mata Kuliah</Typography.Text>
                                </Col>
                                <Col span={24}>
                                    <Typography.Text strong style={{fontSize: 14}}>
                                        {meeting?.course?.name}
                                    </Typography.Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <Typography.Text type="secondary">Pertemuan Ke-</Typography.Text>
                                </Col>
                                <Col span={24}>
                                    <Typography.Text strong style={{fontSize: 14}}>{meeting?.number}</Typography.Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row justify="space-between" align="middle">
                                <Col flex="auto">
                                    <Row>
                                        <Col span={24}>
                                            <Typography.Text type="secondary">Jadwal</Typography.Text>
                                        </Col>
                                        <Col span={24}>
                                            <Typography.Text strong style={{fontSize: 14}}>
                                                {generateMeetingDescription(meeting)}
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                                {meeting?.status !== MeetingStatus.Selesai && (
                                    <Col>
                                        <ButtonEditSchedule data={meeting} onSubmit={updateMeeting}/>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <Typography.Text type="secondary">Dosen</Typography.Text>
                                </Col>
                                <Col span={24}>
                                    {lecturers.map((lecturer, index) => (
                                        <Row>
                                            <Col span={24}>
                                                <Typography.Text strong>
                                                    {index + 1}. {lecturer?.user?.name}
                                                </Typography.Text>
                                            </Col>
                                        </Row>
                                    ))}
                                </Col>
                            </Row>
                        </Col>
                        {meeting?.status === MeetingStatus.Berlangsung && (
                            <Col span={24}>
                                <Row gutter={16} justify="end">
                                    <Col xs={12} lg={4}>
                                        <Button className="w-100" size="large" onClick={handleManualAttendance}>Presensi
                                            Manual</Button>
                                    </Col>
                                    <Col xs={12} lg={4}>
                                        <Button className="w-100" icon={<CameraFilled/>} size="large" type="primary"
                                                onClick={handleTakeAttendance}>Ambil Presensi</Button>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                    </Row>
                </Skeleton>
            </Card>
            <Card>
                <Row justify="space-between">
                    <Typography.Title level={5}>Daftar Mahasiswa</Typography.Title>
                    {meeting?.status !== MeetingStatus.Terjadwal && (
                        <Typography.Text strong>Total Hadir : {totalAttend}/{attendances.length}</Typography.Text>
                    )}
                </Row>
                <List
                    dataSource={attendances}
                    renderItem={attendance => (
                        <List.Item key={attendance.id}>
                            <Row className="w-100">
                                <Col flex="auto">
                                    <Row>
                                        <Col span={24}>
                                            <Typography.Text strong
                                                             style={{fontSize: 14}}>{attendance.student?.user?.name}</Typography.Text>
                                        </Col>
                                        <Col span={24}>
                                            <Typography.Text
                                                type="secondary">{attendance.student?.user?.username}</Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                                {meeting?.status !== MeetingStatus.Terjadwal && (
                                    <Col flex="50px">
                                        <AttendanceTag data={attendance.status}/>
                                    </Col>
                                )}
                            </Row>
                        </List.Item>
                    )}
                />
            </Card>
        </>
    )
}