import {Button, Col, Form, Row, Select, Switch, Typography} from "antd";
import {WebcamCapture} from "../../../../components";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {DatasetService, StudentService} from "../../../../services/services";
import {ButtonUploadDatasets} from "./ButtonUploadDatasets";
import {showDataAddedNotification, showErrorModal} from "../../../../utils/Commons";
import {DatasetType} from "../../../../utils/Constants";

export function RawDataset() {

    const [studentsOptionData, setStudentsOptionData] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [totalDatasets, setTotalDatasets] = useState({});
    const [toggleWebcam, setToggleWebcam] = useState(false);

    const webcamRef = useRef(null);
    const [form] = Form.useForm();

    const datasetService = new DatasetService();
    const studentService = new StudentService();

    useEffect(() => {
        getListStudentOptions();
    }, []);

    const getListStudentOptions = () => {
        studentService.getListData({
            onSuccess: (listStudents) => {
                const sortedData = listStudents.sort((a, b) => a?.user?.username.localeCompare(b?.user?.username));
                const studentsOptionData = sortedData.map(student => ({
                    label: `${student.user?.username} - ${student.user?.name}`,
                    value: student.user?.username
                }))
                setStudentsOptionData(studentsOptionData)
            }
        })
    }

    const onToggleWebcam = (value) => {
        setToggleWebcam(value);
    }

    const onStudentSelected = (username) => {
        setSelectedStudent(username);
        fetchStudentTotalDatasets(username);
    }

    const fetchStudentTotalDatasets = (username) => {
        datasetService.fetchStudentTotalDatasets(username, (totalDatasest) => {
            setTotalDatasets(totalDatasest);
        });
    }

    const snapshot = useCallback(
        (datasetType) => {
            form.validateFields().then((values) => {
                const imageSrc = webcamRef.current.getScreenshot();
                const formData = new FormData();
                formData.append('username', values.username);
                formData.append('dataset_type', datasetType);
                formData.append('files', imageSrc);
                formData.append('detect_face', false);
                datasetService.datasetCapture({
                    data: formData,
                    onSuccess: (res) => {
                        showDataAddedNotification();
                        fetchStudentTotalDatasets(values.username);
                    },
                    onError: (e) => {
                        console.log(e);
                        showErrorModal();
                    }
                })
            }).catch(e => {
                console.log("Validate failed", e);
            });

        },
        [webcamRef]
    );

    const handleUpload = (datasetType, values, onSuccess, onError) => {
        if (values.fileList) {
            const files = values.fileList.map((file) => file.originFileObj)
            const formData = new FormData();
            formData.append('username', selectedStudent);
            formData.append('dataset_type', datasetType);
            files.forEach(file => {
                formData.append('files', file);
            })
            formData.append('detect_face', false);
            datasetService.datasetCapture({
                data: formData,
                onSuccess: (response) => {
                    console.log(`response = `, response)
                    showDataAddedNotification();
                    fetchStudentTotalDatasets(selectedStudent);
                    onSuccess();
                },
                onError: (e) => {
                    console.log(e);
                    onError();
                }
            });
        }
    }

    const handleUploadTraining = (files, onSuccess, onError) => {
        handleUpload(DatasetType.TRAINING, files, onSuccess, onError)
    }

    const handleUploadValidation = (files, onSuccess, onError) => {
        handleUpload(DatasetType.VALIDATION, files, onSuccess, onError)
    }

    const handleClickUpload = (showModal) => {
        form.validateFields().then(() => {
            showModal();
        }).catch(e => {
            console.log("Validate failed", e);
        });
    }

    return (
        <Form form={form}>
            <Row gutter={[16, 8]}>
                <Col xs={24} lg={12}>
                    <Row gutter={[8, 8]}>
                        <Col span={24}>
                            <Form.Item label="Mahasiswa" name="username" required rules={[{required: true}]}>
                                <Select
                                    options={studentsOptionData}
                                    placeholder="Pilih Mahasiswa"
                                    showSearch
                                    onChange={onStudentSelected}
                                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[8, 8]}>
                                <Col xs={24} md={12}>
                                    <Typography.Text>
                                        Total Raw Dataset Latih: {totalDatasets.datasets_raw_train || 0}
                                    </Typography.Text>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Typography.Text>
                                        Total Raw Dataset Uji: {totalDatasets.datasets_raw_val || 0}
                                    </Typography.Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={12}>
                            <ButtonUploadDatasets onShowModal={handleClickUpload} onSubmit={handleUploadTraining}
                                                  type="primary" className="w-100" size="large">
                                Upload Raw Dataset Latih
                            </ButtonUploadDatasets>
                        </Col>
                        <Col xs={24} sm={12}>
                            <ButtonUploadDatasets onShowModal={handleClickUpload} onSubmit={handleUploadValidation}
                                                  className="w-100" size="large">
                                Upload Raw Dataset Uji
                            </ButtonUploadDatasets>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} lg={12}>
                    <Row gutter={16}>
                        <Col>
                            <Switch defaultChecked={toggleWebcam} size="default" onChange={onToggleWebcam}/>
                        </Col>
                        <Col>
                            <Typography.Text>Webcam</Typography.Text>
                        </Col>
                    </Row>
                    {toggleWebcam && (
                        <Row>
                            <Col span={24}>
                                <WebcamCapture ref={webcamRef} className="w-100" style={{marginTop: 8}}/>
                            </Col>
                            <Col span={24}>
                                <Row gutter={[8, 8]}>
                                    <Col xs={24} sm={12}>
                                        <Button className="w-100" type="primary" size="large"
                                                onClick={() => snapshot(DatasetType.TRAINING)}>
                                            Foto Raw Dataset Latih
                                        </Button>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Button className="w-100" size="large"
                                                onClick={() => snapshot(DatasetType.VALIDATION)}>
                                            Foto Raw Dataset Uji
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Form>
    )
}