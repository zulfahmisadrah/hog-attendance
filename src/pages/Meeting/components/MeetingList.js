import React, {useEffect, useState} from 'react';
import {Button, Card, Col, List, Row, Skeleton, Space, Typography} from "antd";
import styled from "styled-components";
import {formatDateTime,} from "../../../utils/Commons";
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';
import {
    attendanceStatus,
    dateFormat,
    dateTextFormat,
    MeetingListType,
    MeetingStatus,
    timeFormat,
    timeTextFormat
} from "../../../utils/Constants";
import {useHistory} from "react-router-dom";
import {userPath} from "../../../path";
import {MeetingService} from "../../../services/services";
import {CalendarOutlined, ClockCircleOutlined} from "@ant-design/icons";
import {COLOR_PRIMARY} from "../../../utils/colors";

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

MeetingList.propTypes = {
    type: PropTypes.oneOf(["active", "scheduled", "finished", "nearest"]),
    limit: PropTypes.number
}

function MeetingList(props) {
    const {type, limit} = props
    const history = useHistory()

    const userRole = useSelector(state => state.auth.user.role);

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);

    const checkIsDisabled = (meeting) => meeting?.status !== MeetingStatus.Berlangsung;
    const meetingService = new MeetingService();

    useEffect(() => {
        if (data.length === 0) fetchData();
    }, [])

    const fetchData = () => {
        setLoading(true);
        switch (type) {
            case MeetingListType.NEAREST:
                meetingService.getNearestMeeting({
                    onSuccess: onDataFetched
                })
                break;
            case MeetingListType.SCHEDULED:
                meetingService.getListScheduledMeeting({
                    onSuccess: onDataFetched
                })
                break;
            case MeetingListType.FINISHED:
                meetingService.getListFinishedMeeting({
                    onSuccess: onDataFetched
                })
                break;
            default:
                meetingService.getListTodayMeeting({
                    onSuccess: onDataFetched
                })
        }
    }

    const onDataFetched = (listData) => {
        if (limit === 1) {
            if (listData.length > 0) {
                const sortedListData = listData.sort((a, b) => b.created_at.localeCompare(a.created_at));
                setData([sortedListData[0]])
            } else {
                setData(listData)
            }
        } else {
            setData(listData);
        }
        setLoading(false);
    }

    const handleClickMeeting = (meeting) => {
        history.push(`${userPath.meetings}/${meeting.id}/details`)
    }

    const iconStyle = {color: COLOR_PRIMARY}

    const generateMeetingDescription = (meeting) => {
        const strDate = formatDateTime(meeting.date, dateTextFormat, dateFormat)
        const strStartTime = formatDateTime(meeting.start_time || meeting.schedule?.start_time, timeTextFormat, timeFormat)
        const strEndTime = formatDateTime(meeting.end_time || meeting.schedule?.end_time, timeTextFormat, timeFormat)
        return (
            <Space>
                <Typography.Text><CalendarOutlined style={iconStyle}/> {strDate}</Typography.Text>
                <Typography.Text><ClockCircleOutlined style={iconStyle}/> {strStartTime}-{strEndTime}</Typography.Text>
            </Space>
        )
    }

    const handleTakeAttendance = (e, meeting) => {
        e.stopPropagation();
        history.push(`${userPath.meetings}/${meeting.id}/attendances`)
    }

    return (
        <>
            <StyledList
                itemLayout="vertical"
                pagination={{pageSize: 10, hideOnSinglePage: true}}
                grid={{gutter: [8, 0], xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4}}
                dataSource={data}
                renderItem={meeting => (
                    <List.Item key={meeting.id}>
                        <Card onClick={() => handleClickMeeting(meeting)} hoverable>
                            <Skeleton loading={loading} active>
                                <Space direction="vertical">
                                    <Row gutter={[0, 4]}>
                                        <Col span={24}>
                                            <Typography.Text>Pertemuan {meeting.number}</Typography.Text>
                                        </Col>
                                        <Col span={24}>
                                            <Typography.Text strong style={{fontSize: 16}}>
                                                {meeting.course?.name}
                                            </Typography.Text>
                                        </Col>
                                        <Col span={24}>
                                            {generateMeetingDescription(meeting)}
                                        </Col>
                                    </Row>
                                </Space>
                                {userRole === 3 && meeting.status !== MeetingStatus.Selesai && (
                                    <Row justify="end" style={{marginTop: 8}}>
                                        <Space>
                                            <Button type="primary"
                                                    disabled={checkIsDisabled(meeting)}
                                                    onClick={(e) => handleTakeAttendance(e, meeting)}>
                                                Ambil Presensi
                                            </Button>
                                        </Space>
                                    </Row>
                                )}
                                {userRole === 3 && meeting.status === MeetingStatus.Selesai && (
                                    <Row style={{marginTop: 8}}>
                                        <Typography.Text strong>
                                            Total hadir : {meeting.attendances?.filter(attendance => attendance?.status === attendanceStatus.attend).length}
                                            /
                                            {meeting.attendances?.length}
                                        </Typography.Text>
                                    </Row>
                                )}
                            </Skeleton>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default MeetingList;