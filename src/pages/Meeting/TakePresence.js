import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {useLocation, useParams} from "react-router-dom";
import {WebcamCapture} from "../../components";
import {Button, Col, Modal, Popconfirm, Row, Space, Typography} from "antd";
import {AttendanceService} from "../../services/services/AttendanceService";
import {MeetingService} from "../../services/services";
import {showDataUpdatedMessage, showInfoMessage} from "../../utils/Commons";
import {attendanceStatus, BASE_RESULT_URL} from "../../utils/Constants";
import {ButtonShowDrawer} from "./components/ButtonShowDrawer";
import {RetweetOutlined} from "@ant-design/icons";

const StyledDiv = styled.div`
  .fullscreen-center {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 9;
    max-width: 100%;
    height: 100%;
  }

  .full {
    margin: 0;
    padding: 0;
    max-width: 100vw;
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
    let {meeting_id} = useParams();
    const location = useLocation();
    const validate = location?.state?.validate;
    const status_key = validate ? 'status_validate' : 'status';

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const [meeting, setMeeting] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [attendances, setAttendances] = useState([]);
    const [listAttend, setListAttend] = useState([]);
    const [listHasAttended, setListHasAttended] = useState([]);
    const [facingMode, setFacingMode] = useState("environment");

    const totalAttend = attendances.filter(attendance => attendance[status_key] === attendanceStatus.attend).length

    const attendanceService = new AttendanceService();
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
            const data = new FormData();
            data.append('file', imageSrc);
            data.append('meeting_id', meeting_id);
            data.append('validate', !!validate);
            attendanceService.takePresence({
                data: data,
                onSuccess: (res) => {
                    console.log(`response = `, res);
                    setResult(res);
                    const listAttend = []
                    const listHasAttended = []
                    res.predictions.forEach(user => {
                        const studentAttendance = attendances.find(attendance => attendance.student.user.username === user.username)
                        if (studentAttendance) {
                            if (studentAttendance[status_key] === attendanceStatus.attend) {
                                if (!listHasAttended.some(item => item.username === user.username)) listHasAttended.push(user)
                            } else {
                                if (!listAttend.some(item => item.username === user.username)) listAttend.push(user)
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

    const handleRemove = (course_id, meeting_id, file_name) => {
        attendanceService.deleteMeetingAttendanceResult({
            course_id: course_id,
            meeting_id: meeting_id,
            file_name: file_name,
            onSuccess: () => {
                showDataUpdatedMessage('Data berhasil dihapus');
                Modal.destroyAll();
            }
        })
    }

    const showLastResult = () => {
        attendanceService.getMeetingAttendanceResults({
            meeting_id: meeting_id,
            onSuccess: (result) => {
                console.log(`response = `, result);
                if (result) {
                    return Modal.info({
                        title: "Hasil Pengambilan Presensi",
                        okText: 'Tutup',
                        style: { top: 10 },
                        content: (
                            <Row gutter={[8,8]}>
                                {
                                    result.map(image_name => (
                                        <Col span={8} key={image_name}>
                                            <Popconfirm
                                                placement="topRight"
                                                title="Yakin ingin menghapus data ini?"
                                                onConfirm={() => handleRemove(0, meeting_id, image_name)}
                                                okText="Hapus"
                                                cancelText="Batal"
                                            >
                                                <Button type="danger" size="small">X</Button>
                                            </Popconfirm>
                                            <a href={BASE_RESULT_URL + "0/" + meeting_id + "/" + image_name} target="_blank" rel="noreferrer">
                                                <img className="w-100" src={BASE_RESULT_URL + "0/" + meeting_id + "/" + image_name} alt="result"/>
                                            </a>
                                        </Col>
                                    ))
                                }
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
            },
        })
    }

    const changeFacingMode = () => {
        const newFacingMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newFacingMode);
    }


    return (
        <StyledDiv>
            <div className="full">
                <WebcamCapture ref={webcamRef} facingMode={facingMode} className="fullscreen-center"/>
                <canvas id="overlay" ref={canvasRef} className="fullscreen-center"/>
                <div className="buttons-container" style={{opacity: 0.7}}>
                    <Row>
                        <Col xs={24} md={4}>
                            <Space direction="vertical">
                                <Button type="primary" onClick={changeFacingMode} icon={<RetweetOutlined/>} />
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