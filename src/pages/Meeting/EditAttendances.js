import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Col, Drawer, List, Row, Typography} from "antd";
import {CourseService, MeetingService} from "../../services/services";
import {AttendanceTag} from "../../components";


export function EditAttendances(props) {
    let {visible, onClose} = props;
    let {meeting_id} = useParams();

    const [meeting, setMeeting] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);

    const meetingService = new MeetingService();
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
            onSuccess: (attendances) => {
                setAttendances(attendances)
            }
        })
    }

    useEffect(() => {
        fetchMeetingDetails(meeting_id)
        fetchMeetingAttendances(meeting_id)
    }, [meeting_id]);

    useEffect(() => {
        meeting && getListStudents(meeting)
    }, [meeting]);

    const getListStudents = (meeting) => {
        courseService.getCourseStudents({
            course_id: meeting?.course?.id,
            onSuccess: (listData) => {
                setStudents(listData)
            }
        })
    }

    return (
        <Drawer
            title="Daftar Mahasiswa"
            placement="right"
            width="35%"
            onClose={onClose}
            visible={visible}
        >
            <List
                dataSource={attendances}
                renderItem={attendance => (
                    <List.Item key={attendance.id}>
                        <Row className="w-100">
                            <Col flex="1">
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
                            <Col flex="50px">
                                <AttendanceTag data={attendance.status}/>
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
        </Drawer>
    )
}