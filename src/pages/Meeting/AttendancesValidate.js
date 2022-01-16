import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Col, List, Modal, Row, Typography} from "antd";
import {CourseService, MeetingService} from "../../services/services";
import {showDataUpdatedMessage} from "../../utils/Commons";
import {attendanceStatus, BASE_DATASET_SAMPLE_URL, MeetingStatus} from "../../utils/Constants";
import {useParams, useHistory} from "react-router-dom";
import {userPath} from "../../path";
import {AttendanceService} from "../../services/services/AttendanceService";
import {CameraFilled, ExclamationCircleOutlined} from "@ant-design/icons";
import {AttendanceBadge, AttendanceBadgesLegend, AttendanceTag, AvatarModal} from "../../components";
import styled from "styled-components";
import {COLOR_DIFFERENT_ATTENDANCE_STATUS} from "../../utils/colors";

const StyledCard = styled(Card)`
  position: fixed;
  z-index: 999;
  width: 100%;

  .ant-card-body {
    padding-top: 4px;
    padding-bottom: 8px;
  }
`

export function AttendancesValidate() {
    let {meeting_id} = useParams();
    const history = useHistory();

    const [meeting, setMeeting] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);

    const meetingService = new MeetingService();
    const courseService = new CourseService();
    const attendanceService = new AttendanceService();
    const totalAttend = attendances.filter(attendance => attendance?.status === attendanceStatus.attend).length
    const totalAttendValidate = attendances.filter(attendance => attendance?.status_validate === attendanceStatus.attend).length

    const fetchMeetingDetails = (meeting_id) => {
        meetingService.getData({
            id: meeting_id,
            onSuccess: (meeting) => {
                setMeeting(meeting);
            }
        })
    }

    const fetchMeetingAttendances = (meeting_id) => {
        meetingService.getListAttendances({
            id: meeting_id,
            onSuccess: (listData) => {
                const attendances = listData.sort((a, b) => a.student?.user?.username?.localeCompare(b.student?.user?.username));
                setAttendances(attendances);
            }
        })
    }


    useEffect(() => {
        fetchMeetingDetails(meeting_id);
        fetchMeetingAttendances(meeting_id);
    }, [meeting_id]);

    const getListStudents = (meeting) => {
        courseService.getCourseStudents({
            course_id: meeting?.course?.id,
            onSuccess: (listData) => {
                setStudents(listData)
            }
        })
    }

    useEffect(() => {
        meeting && getListStudents(meeting);
    }, [meeting]);

    const handleTakeAttendance = () => {
        history.push({
            pathname: `${userPath.meetings}/${meeting.id}/attendances`,
            state: {
                validate: true
            }
        })
    }

    const resetAttendance = () => {
        const data = new FormData();
        data.append('meeting_id', meeting_id);
        attendanceService.resetAttendanceValidate({
            data: data,
            onSuccess: (res) => {
                showDataUpdatedMessage();
                fetchMeetingAttendances(meeting_id);
            }
        });
    }

    const applyAttendance = () => {
        const data = new FormData();
        data.append('meeting_id', meeting_id);
        attendanceService.applyAttendanceValidate({
            data: data,
            onSuccess: (res) => {
                showDataUpdatedMessage();
                fetchMeetingAttendances(meeting_id);
            }
        });
    }

    const handleResetAttendance = () => {
        Modal.confirm(
            {
                icon: <ExclamationCircleOutlined/>,
                title: 'Reset Validasi Presensi',
                content: 'Yakin ingin melakukan reset validasi presensi? Semua status kehadiran mahasiswa akan menjadi ABSEN',
                okText: 'Reset',
                okType: "primary",
                okButtonProps: {danger: true},
                onOk: () => resetAttendance()
            }
        )
    }

    const handleApplyAttendance = () => {
        Modal.confirm(
            {
                icon: <ExclamationCircleOutlined/>,
                title: 'Terapkan Presensi',
                content: 'Yakin ingin mengganti presensi utama dengan presensi pada halaman ini?',
                okText: 'Terapkan',
                okType: "primary",
                onOk: () => applyAttendance()
            }
        )
    }

    return (
        <>
            <StyledCard>
                <Row className="w-100" gutter={[0, 8]} justify="space-between">
                    <Col xs={10} lg={4}>
                        <Button className="w-100" onClick={handleResetAttendance}>Reset</Button>
                    </Col>
                    <Col xs={13} lg={4} offset={1}>
                        <Button className="w-100" onClick={handleApplyAttendance}>Terapkan Presensi Ini</Button>
                    </Col>
                    <Col span={24}>
                        <Row justify="space-between" align="middle">
                            <Typography.Title level={5}>Daftar Mahasiswa</Typography.Title>
                            <Button icon={<CameraFilled/>} type="primary"
                                    onClick={handleTakeAttendance}>Ambil</Button>
                        </Row>
                    </Col>
                </Row>
                <Row justify="space-between">
                        <Typography.Text strong>Total Hadir: {totalAttend}/{attendances.length}</Typography.Text>
                        <Typography.Text strong>Validasi : {totalAttendValidate}/{attendances.length}</Typography.Text>
                </Row>
            </StyledCard>
            <Card style={{marginTop: 80}}>
                {attendances.length > 0 ? (
                    <List
                        dataSource={attendances}
                        renderItem={attendance => (
                            <List.Item key={attendance.id} style={attendance.status === attendanceStatus.attend && attendance.status !== attendance.status_validate ? {backgroundColor: COLOR_DIFFERENT_ATTENDANCE_STATUS} : {}}>
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
                                                    <AttendanceBadge data={attendance.status_by_student}/>
                                                </Col>
                                            )}
                                            <Col flex="50px">
                                                <AttendanceTag data={attendance.status_validate}/>
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