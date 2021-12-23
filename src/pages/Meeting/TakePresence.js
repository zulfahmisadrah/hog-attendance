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
    const [attendances, setAttendances] = useState([]);

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
            const course_id = meeting?.course?.id
            const imageSrc = webcamRef.current.getScreenshot();
            const data = new FormData()
            data.append('file', imageSrc)
            data.append('course_id', course_id)
            datasetService.recognizeUser({
                data: data,
                onSuccess: (res) => {
                    console.log(`response = `, res);
                    setResult(res);
                    res.predictions.forEach(user => {
                        const studentAttendance = attendances.find(attendance => attendance.student.user.username === user.username)
                        // console.log(`studentAttendance = `, studentAttendance);
                        if (studentAttendance) {
                            if (studentAttendance?.status === attendanceStatus.attend) {
                                showInfoMessage(
                                    <>
                                        <Typography.Text strong>{studentAttendance.student.user.name}</Typography.Text>
                                        <Typography.Text> telah {attendanceStatus.attend}</Typography.Text>
                                    </>,
                                    3
                                );
                            } else {
                                const updatedAttendance = {
                                    id: studentAttendance?.id,
                                    status: attendanceStatus.attend
                                }
                                attendanceService.updateData({
                                    data: updatedAttendance,
                                    onSuccess: () => {
                                        fetchMeetingAttendances(meeting_id);
                                        showDataUpdatedMessage(
                                            <>
                                                <Typography.Text strong>{studentAttendance.student.user.name}</Typography.Text>
                                                <Typography.Text> {attendanceStatus.attend}</Typography.Text>
                                            </>
                                        );
                                    }
                                })
                            }
                        }
                    })
                }
            })
        },
        [meeting, webcamRef, attendances]
    )

    const showLastResult = () => {
        if (result) {
            return Modal.info({
                title: "Hasil Pengenalan Wajah",
                okText: 'Tutup',
                style: { top: 10 },
                content: (
                    <img className="w-100" src={BASE_RESULT_URL + result.image_name} alt="result"/>
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
                                <Button className="w-100" type="primary" size="large" onClick={recognize}>Scan</Button>
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