import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {useParams} from "react-router-dom";
import {WebcamCapture} from "../../components";
import {Button, Col, Modal, Row, Space, Typography} from "antd";
import {AttendanceService} from "../../services/services/AttendanceService";
import {DatasetService, MeetingService} from "../../services/services";
import {showDataUpdatedMessage, showInfoMessage} from "../../utils/Commons";
import {attendanceStatus, BASE_RESULT_URL} from "../../utils/Constants";
import {ButtonShowDrawer} from "./components/ButtonShowDrawer";

const StyledDiv = styled.div`
  .fullscreen-center {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 9;
    //max-width: 640px;
    height: 100%;
  }

  .full {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }

  .buttons-container {
    position: absolute;
    z-index: 99;
    left: 0;
    bottom: 0;
    padding: 16px;
  }

`

function TakePresence() {
    let {meeting_id} = useParams()

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const [meeting, setMeeting] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [attendances, setAttendances] = useState([]);
    const [listAttend, setListAttend] = useState([]);
    const [listHasAttended, setListHasAttended] = useState([]);

    const totalAttend = attendances.filter(attendance => attendance?.status === attendanceStatus.attend).length

    const attendanceService = new AttendanceService();
    const datasetService = new DatasetService();
    const meetingService = new MeetingService();

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

    const recognize = useCallback(
        () => {
            setLoading(true);
            const imageSrc = webcamRef.current.getScreenshot();
            const data = new FormData()
            data.append('file', imageSrc)
            data.append('meeting_id', meeting_id)
            datasetService.takePresence({
                data: data,
                onSuccess: (res) => {
                    console.log(`response = `, res);
                    setResult(res);
                    const listAttend = []
                    const listHasAttended = []
                    res.predictions.forEach(user => {
                        const studentAttendance = attendances.find(attendance => attendance.student.user.username === user.username)
                        if (studentAttendance) {
                            if (studentAttendance?.status === attendanceStatus.attend) {
                                if (!listHasAttended.includes(user)) listHasAttended.push(user)
                            } else {
                                if (!listAttend.includes(user)) listAttend.push(user)
                            }
                        }
                    });
                    setListAttend(listAttend);
                    setListHasAttended(listHasAttended);
                    fetchMeetingAttendances(meeting_id);
                    const listAttendName = listAttend.map(user => user.name);
                    const listHasAttendedName = listHasAttended.map(user => user.name);

                    if (listHasAttendedName.length > 0) {
                        showInfoMessage(
                            <>
                                <Typography.Text strong>{listHasAttendedName.join(", ")}</Typography.Text>
                                <Typography.Text> telah {attendanceStatus.attend}</Typography.Text>
                            </>,
                            listHasAttendedName.length < 3 ? 3 : listHasAttendedName.length + 3
                        );
                    }

                    if (listAttendName.length > 0) {
                        showDataUpdatedMessage(
                            <>
                                <Typography.Text strong>{listAttendName.join(", ")}</Typography.Text>
                                <Typography.Text> {attendanceStatus.attend}</Typography.Text>
                            </>,
                            listAttendName.length < 3 ? 3 : listAttendName.length + 3
                        );
                    }
                    setLoading(false);
                }
            })
        },
        [meeting, webcamRef, attendances]
    )

    const showLastResult = () => {
        if (result) {
            return Modal.info({
                title: "Hasil Pengambilan Presensi",
                okText: 'Tutup',
                style: { top: 10 },
                content: (
                    <Row>
                        <Col span={24}>
                            <a href={BASE_RESULT_URL + result.image_name} target="_blank">
                                <img className="w-100" src={BASE_RESULT_URL + result.image_name} alt="result"/>
                            </a>
                        </Col>
                        {listAttend.length > 0 && (
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <Typography.Text strong>Hadir:</Typography.Text>
                                    </Col>
                                    <Col span={24}>
                                        <Space direction="vertical">
                                            {listAttend.map(user => (
                                                <Typography.Text>{user.username} - {user.name}</Typography.Text>
                                            ))}
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                        {listHasAttended.length > 0 && (
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <Typography.Text strong>Telah Hadir:</Typography.Text>
                                    </Col>
                                    <Col span={24}>
                                        <Space direction="vertical">
                                            {listHasAttended.map(user => (
                                                <Typography.Text>{user.username} - {user.name}</Typography.Text>
                                            ))}
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                        )}
                    </Row>
                )
            })
        }
    }


    return (
        <StyledDiv>
            <div className="full">
                <WebcamCapture ref={webcamRef} className="fullscreen-center"/>
                <canvas id="overlay" ref={canvasRef} className="fullscreen-center"/>
                <div className="buttons-container" style={{opacity: 0.7}}>
                    <Row>
                        <Col xs={24} md={4}>
                            <Space direction="vertical">
                                <Button className="w-100" type="primary" size="large" loading={loading}
                                        disabled={loading} onClick={recognize}>Scan</Button>
                                <Button className="w-100" onClick={showLastResult}>Hasil Scan</Button>
                                <ButtonShowDrawer>Total Hadir : {totalAttend}/{attendances.length}</ButtonShowDrawer>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </div>
        </StyledDiv>
    )
}

export default TakePresence;