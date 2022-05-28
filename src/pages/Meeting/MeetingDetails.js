import React, {useEffect, useState} from 'react';
import {Button, Card, Col, List, Row, Skeleton, Typography} from "antd";
import {CourseService, MeetingService} from "../../services/services";
import {formatDateTime, showDataUpdatedMessage, showDataUpdatedNotification} from "../../utils/Commons";
import {
    attendanceStatus,
    dateFormat,
    dateTextFormat,
    MeetingStatus,
    timeFormat,
    timeTextFormat,
    BASE_DATASET_SAMPLE_URL,
} from "../../utils/Constants";
import {useParams, useHistory} from "react-router-dom";
import {userPath} from "../../path";
import {AttendanceService} from "../../services/services/AttendanceService";
import {CameraFilled} from "@ant-design/icons";
import {ButtonEditSchedule} from "./components/ButtonEditSchedule";
import {AttendanceBadge, AttendanceBadgesLegend, AttendanceTag, AvatarModal} from "../../components";
import {useSelector} from "react-redux";


export function MeetingDetails() {
    let {meeting_id} = useParams();
    const history = useHistory();
    const userRole = useSelector(state => state.auth.user.role);

    const [meeting, setMeeting] = useState(null);
    const [lecturers, setLecturers] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [myAttendance, setMyAttendance] = useState(null);
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
            onSuccess: (listData) => {
                const attendances = listData.sort((a, b) => a.student?.user?.username?.localeCompare(b.student?.user?.username));
                setAttendances(attendances);
                setLoading(false);
            }
        })
    }

    const fetchMyMeetingAttendance = (meeting_id) => {
        setLoading(true);
        attendanceService.getMyMeetingAttendance({
            meeting_id: meeting_id,
            onSuccess: (attendance) => {
                setMyAttendance(attendance);
            },
            onFinally: () => {
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        fetchMeetingDetails(meeting_id);
        fetchMeetingAttendances(meeting_id);
        if (userRole === 4) fetchMyMeetingAttendance(meeting_id);
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
        history.push(`${userPath.meetings}/${meeting.id}/edit`)
    }

    const handleValidateAttendance = () => {
        history.push(`${userPath.meetings}/${meeting.id}/validate`)
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

    const raiseAttendanceStatus = (statusByStudent) => {
        const updatedAttendance = {...myAttendance};
        updatedAttendance.status_by_student = statusByStudent;
        attendanceService.updateData({
            data: updatedAttendance,
            onSuccess: (updatedData) => {
                setMyAttendance(updatedData);
                showDataUpdatedMessage("Status kehadiran telah diajukan");
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
                            <Row justify="space-between" align="middle" wrap={false}>
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
                                {userRole === 3 && (
                                    <Col>
                                        <ButtonEditSchedule data={meeting} onSubmit={updateMeeting}>Ubah</ButtonEditSchedule>
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
                        {userRole === 3 && meeting?.status === MeetingStatus.Berlangsung && (
                            <Col span={24}>
                                <Row gutter={[8,8]} justify="end">
                                    <Col xs={{span: 24, order: 1}} lg={{span: 4, order: 3}}>
                                        <Button className="w-100" icon={<CameraFilled/>} size="large" type="primary"
                                                onClick={handleTakeAttendance}>Ambil Presensi</Button>
                                    </Col>
                                    <Col xs={{span: 12, order: 2}} lg={{span: 4, order: 2}}>
                                        <Button className="w-100" size="large" onClick={handleManualAttendance}>
                                            Presensi Manual
                                        </Button>
                                    </Col>
                                    <Col xs={{span: 12, order: 3}} lg={{span: 4, order: 1}}>
                                        <Button className="w-100" size="large" onClick={handleValidateAttendance}>
                                            Validasi
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                        {userRole === 4 && meeting?.status === MeetingStatus.Berlangsung && (
                            <>
                                <Col span={24}>
                                    <Row>
                                        <Col span={24}>
                                            <Typography.Text type="secondary">Status Kehadiran Anda</Typography.Text>
                                        </Col>
                                        <Col span={24}>
                                            <AttendanceTag data={myAttendance?.status}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Typography.Text style={{fontSize: 14}}>
                                        Ajukan status kehadiran
                                    </Typography.Text>
                                </Col>
                                <Col span={24}>
                                    <Row gutter={[16, 8]}>
                                        <Col xs={12} lg={4}>
                                            <Button
                                                className="w-100"
                                                type={myAttendance?.status_by_student === attendanceStatus.sick ? "primary" : "default"}
                                                onClick={() => raiseAttendanceStatus(attendanceStatus.sick)}>{attendanceStatus.sick}
                                            </Button>
                                        </Col>
                                        <Col xs={12} lg={4}>
                                            <Button
                                                className="w-100"
                                                type={myAttendance?.status_by_student === attendanceStatus.attend ? "primary" : "default"}
                                                onClick={() => raiseAttendanceStatus(attendanceStatus.attend)}>{attendanceStatus.attend}
                                            </Button>
                                        </Col>
                                        <Col xs={12} lg={4}>
                                            <Button
                                                className="w-100"
                                                type={myAttendance?.status_by_student === attendanceStatus.permitted ? "primary" : "default"}
                                                onClick={() => raiseAttendanceStatus(attendanceStatus.permitted)}>{attendanceStatus.permitted}
                                            </Button>
                                        </Col>
                                        <Col span={12} lg={4}>
                                            <Button
                                                className="w-100"
                                                type={myAttendance?.status_by_student === attendanceStatus.absent ? "primary" : "default"}
                                                onClick={() => raiseAttendanceStatus(attendanceStatus.absent)}>{attendanceStatus.absent}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </>
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
                {attendances.length > 0 ? (
                    <List
                        dataSource={attendances}
                        renderItem={attendance => (
                            <List.Item key={attendance.id}>
                                <Row className="w-100" wrap={false}>
                                    <Col flex="50px">
                                        <AvatarModal url={BASE_DATASET_SAMPLE_URL + attendance.student?.user?.username} />
                                    </Col>
                                    <Col flex="auto">
                                        <Row>
                                            <Col span={24}>
                                                <Typography.Text strong style={{fontSize: 14}}>
                                                    {attendance.student?.user?.name}
                                                </Typography.Text>
                                            </Col>
                                            <Col span={24}>
                                                <Typography.Text
                                                    type="secondary">{attendance.student?.user?.username}</Typography.Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {meeting?.status !== MeetingStatus.Terjadwal && (
                                        <>
                                            {attendance?.status_by_student !== attendance.status && (
                                                <Col flex="10px">
                                                    <AttendanceBadge data={attendance.status_by_student} />
                                                </Col>
                                            )}
                                            <Col flex="50px">
                                                <AttendanceTag data={attendance.status}/>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </List.Item>
                        )}
                    />
                ) : (
                    <List
                        dataSource={students}
                        renderItem={student => (
                            <List.Item key={student.id}>
                                <Row className="w-100" wrap={false}>
                                    <Col flex="50px">
                                        <AvatarModal url={BASE_DATASET_SAMPLE_URL + student?.user?.username} />
                                    </Col>
                                    <Col flex="auto">
                                        <Row>
                                            <Col span={24}>
                                                <Typography.Text strong style={{fontSize: 14}}>
                                                    {student?.user?.name}
                                                </Typography.Text>
                                            </Col>
                                            <Col span={24}>
                                                <Typography.Text
                                                    type="secondary">{student?.user?.username}</Typography.Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                )}
            </Card>
            <Card>
                <AttendanceBadgesLegend/>
            </Card>
        </>
    )
}