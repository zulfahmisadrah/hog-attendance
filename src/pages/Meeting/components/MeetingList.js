import React, {useEffect, useState} from 'react';
import {Button, Card, Col, List, Row, Space, Typography, Modal, Skeleton} from "antd";
import styled from "styled-components";
import {
    formatDateTime,
    getCurrentDateTime, getDateTimeFromString,
    getMoment,
    showErrorModal,
    showSuccessNotification
} from "../../../utils/Commons";
import {
    createAttendance,
    fetchMyActiveMeetings,
    fetchMyFinishedMeetings,
    fetchMyScheduledMeetings
} from "../../../services";
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';
import {
    dateFormat,
    dateTextFormat,
    MeetingStatus,
    MeetingListType,
    timeFormat,
    timeTextFormat
} from "../../../utils/Constants";
import {useHistory} from "react-router-dom";
import {userPath} from "../../../path";
import {CourseService, LecturerService, MeetingService, StudentService} from "../../../services/services";
import {AttendanceTag} from "../../../components";
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

const listTitle = {
    name: "Nama Pertemuan",
    number: "Pertemuan ke-",
    schedule: "Jadwal",
    duration: "Durasi",
}

MeetingList.propTypes = {
    type: PropTypes.oneOf(["active", "scheduled", "finished"]),
    limit: PropTypes.number
}

function MeetingList(props) {
    const {type, limit} = props
    const history = useHistory()

    const userId = useSelector(state => state.auth.user.id);
    const userRole = useSelector(state => state.auth.user.role);

    const [data, setData] = useState([{}, {}, {}])
    const [loading, setLoading] = useState(false);
    const [attendances, setAttendances] = useState([]);

    const checkIsDisabled = (meeting) => meeting?.status !== MeetingStatus.Berlangsung;
    const meetingService = new MeetingService();

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        setLoading(true)
        switch (type) {
            case MeetingListType.ACTIVE:
                meetingService.getListTodayMeeting({
                    onSuccess: onDataFetched
                })
                // fetchMyActiveMeetings(onDataFetched);
                break;
            case MeetingListType.SCHEDULED:
                meetingService.getListScheduledMeeting({
                    onSuccess: onDataFetched
                })
                // fetchMyScheduledMeetings(onDataFetched);
                break;
            case MeetingListType.FINISHED:
                meetingService.getListFinishedMeeting({
                    onSuccess: onDataFetched
                })
                // fetchMyFinishedMeetings(onDataFetched);
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
        setLoading(false)
    }

    const fetchMeetingAttendances = (meeting_id) => {
        meetingService.getListAttendances({
            id: meeting_id,
            onSuccess: (attendances) => {
                setAttendances(attendances)
            }
        })
    }

    // const generateDetails = (record) => {
    //     let details = [];
    //     Object.keys(listTitle).forEach(key => {
    //         const value = record[key]
    //         if (value) {
    //             details.push(
    //                 <Row key={key} style={{marginBottom: 6}}>
    //                     <Col xs={{span: 24}} lg={{span: 10}}>
    //                         <Typography.Text strong>{listTitle[key]}</Typography.Text>
    //                     </Col>
    //                     <Col xs={{span: 24}} lg={{span: 14}}>
    //                         <Typography.Text>{key === "schedule" ? formatDateTime(value) : value}</Typography.Text><br/>
    //                     </Col>
    //                 </Row>
    //             )
    //         }
    //     })
    //     return details
    // }

    const handleClickMeeting = (meeting) => {
        history.push(`${userPath.meetings}/${meeting.id}/details`)
    }

    const showDetailsModal = (item) => {
        // Modal.info({
        //     title: 'Rincian data',
        //     okText: 'Tutup',
        //     content: (
        //         <>
        //             {generateDetails(item)}
        //         </>
        //     )
        // })
    }

    function getLocation(meeting) {
        history.push(`${userPath.meetings}/${meeting.id}/takePresence`)
    }

    // function getLocation(meeting) {
    //     const options = {
    //         enableHighAccuracy: true,
    //         timeout: 5000,
    //         maximumAge: 0
    //     }
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition((location) => onPositionRetrieved(location, meeting), onError);
    //     } else {
    //         let message = "Geolocation is not supported by this browser.";
    //         showErrorModal(message)
    //     }
    // }

    function onPositionRetrieved(position, meeting) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const accuracy = position.coords.accuracy
        const altitude = position.coords.altitude
        console.log(latitude, longitude, accuracy, altitude);
        const coordinate = `lat:${latitude};long:${longitude}`
        attend(meeting, coordinate)
    }

    function onError(error) {
        let message
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = "Anda tidak memberikan izin untuk akses lokasi."
                break;
            case error.POSITION_UNAVAILABLE:
                message = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                message = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                message = "An unknown error occurred."
                break;
        }
        showErrorModal(message)
    }

    const attend = (meeting, position) => {
        const currentTime = getCurrentDateTime()
        let status = "Hadir"
        let notes = "Tepat waktu"
        const timeDifference = getMoment().diff(getDateTimeFromString(meeting.schedule))
        const isLate = timeDifference > 0
        if (isLate) notes = "Terlambat " + Math.round(timeDifference / 60000) + " Menit"
        const attendance = {
            status: status,
            location: position,
            checkInTime: currentTime,
            notes: notes,
            meeting: meeting.id,
            user: userId
        }

        createAttendance({
            attendance,
            onSuccess: (newData) => {
                fetchData()
                showSuccessNotification({
                    description: "Anda hadir pada pukul " + formatDateTime(currentTime, "HH:mm"),
                    duration: 5
                })
            }
        })
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
        // `${strDate} ${strStartTime}-${strEndTime}`
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
                            </Skeleton>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default MeetingList;