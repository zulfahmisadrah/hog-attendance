import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import {Col, Divider, Drawer, List, Row, Typography} from "antd";
import {MeetingService} from "../../services/services";
import {AttendanceBadge, AttendanceBadgesLegend, AttendanceTag, AvatarModal} from "../../components";
import {BASE_DATASET_SAMPLE_URL} from "../../utils/Constants";


export function AttendancesDrawer(props) {
    let {visible, onClose} = props;
    let {meeting_id} = useParams();
    const location = useLocation();
    const validate = location?.state?.validate;
    const status_key = validate ? 'status_validate' : 'status';

    const [attendances, setAttendances] = useState([]);

    const meetingService = new MeetingService();

    const fetchMeetingAttendances = (meeting_id) => {
        meetingService.getListAttendances({
            id: meeting_id,
            onSuccess: (attendances) => {
                setAttendances(attendances)
            }
        })
    }

    useEffect(() => {
        fetchMeetingAttendances(meeting_id)
    }, [meeting_id]);

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
                        <Row className="w-100" wrap={false}>
                            <Col flex="50px">
                                <AvatarModal url={BASE_DATASET_SAMPLE_URL + attendance.student?.user?.username} />
                            </Col>
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
                            {attendance?.status_by_student !== attendance[status_key] && (
                                <Col flex="10px">
                                    <AttendanceBadge data={attendance.status_by_student} />
                                </Col>
                            )}
                            <Col flex="50px">
                                <AttendanceTag data={attendance[status_key]}/>
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
            <Divider />
            <AttendanceBadgesLegend/>
        </Drawer>
    )
}