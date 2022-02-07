import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {useLocation, useParams} from "react-router-dom";
import {WebcamCapture} from "../../components";
import {Button, Col, Modal, Row, Space, Typography} from "antd";
import {AttendanceService} from "../../services/services/AttendanceService";
import {DatasetService, MeetingService} from "../../services/services";
import {showDataAddedNotification, showDataUpdatedMessage, showErrorModal, showInfoMessage} from "../../utils/Commons";
import {attendanceStatus, BASE_DATASET_RAW_TRAIN_URL, BASE_RESULT_URL, DatasetType} from "../../utils/Constants";
import {CameraFilled, HistoryOutlined, RetweetOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";

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
    position: fixed;
    width: 100%;
    z-index: 99;
    //left: 0;
    bottom: 0;
    padding: 16px;
  }

`

export function TakePhoto() {
    const user = useSelector(state => state.auth?.user);

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [facingMode, setFacingMode] = useState("user");

    const datasetService = new DatasetService();

    const snapshot = useCallback(
        () => {
            setLoading(true);
            const imageSrc = webcamRef.current.getScreenshot();
            const formData = new FormData();
            formData.append('username', user?.username)
            formData.append('dataset_type', DatasetType.TRAINING);
            formData.append('files', imageSrc)
            datasetService.datasetCapture({
                data: formData,
                onSuccess: (res) => {
                    console.log(`response = `, res)
                    setResult(res);
                    showDataUpdatedMessage("Foto berhasil disimpan");
                    setLoading(false);
                },
                onError: (e) => {
                    console.log(e);
                    showErrorModal();
                    setLoading(false);
                }
            })
        },
        [webcamRef]
    )

    const showLastResult = () => {
        if (result) {
            return Modal.info({
                title: "Hasil Foto",
                okText: 'Tutup',
                style: { top: 10 },
                content: (
                    <Row>
                        <Col span={24}>
                            <a href={BASE_DATASET_RAW_TRAIN_URL + user?.username + "/" + result.image_name} target="_blank" rel="noreferrer">
                                <img className="w-100" src={BASE_DATASET_RAW_TRAIN_URL + user?.username + "/" + result.image_name} alt="result"/>
                            </a>
                        </Col>
                    </Row>
                )
            })
        }
    }

    const changeFacingMode = () => {
        const newFacingMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newFacingMode);
    }


    return (
        <StyledDiv>
            <div className="full">
                <WebcamCapture ref={webcamRef} facingMode={facingMode} orientation="portrait" className="fullscreen-center"/>
                <canvas id="overlay" ref={canvasRef} className="fullscreen-center"/>
                <div className="buttons-container" style={{opacity: 0.7}}>
                    <Row justify="center" align="middle" className="w-100">
                        <Col flex={1}>
                            <Row justify="center" className="w-100">
                                <Button type="primary" onClick={changeFacingMode} icon={<RetweetOutlined/>} />
                            </Row>
                        </Col>
                        <Col flex={1}>
                            <Row justify="center" className="w-100">
                                <Button
                                    className="w-100"
                                    type="primary"
                                    size="large"
                                    loading={loading}
                                    icon={<CameraFilled/>}
                                    disabled={loading}
                                    onClick={snapshot}
                                    style={{width: 60, height: 60, borderRadius: 60}}
                                />
                            </Row>
                        </Col>
                        <Col flex={1}>
                            <Row justify="center" className="w-100">
                                <Button type="primary" onClick={showLastResult} icon={<HistoryOutlined/>}/>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </StyledDiv>
    )
}
