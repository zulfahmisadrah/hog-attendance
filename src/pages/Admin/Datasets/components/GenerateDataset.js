import {Button, Col, Form, Row, Select, Space, Switch, Typography} from "antd";
import {WebcamCapture} from "../../../../components";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {DatasetService, StudentService} from "../../../../services/services";
import {ButtonUploadDatasets} from "./ButtonUploadDatasets";
import {showDataAddedNotification, showErrorModal} from "../../../../utils/Commons";

export function GenerateDataset() {
    const [result, setResult] = useState(null);
    const [studentsOptionData, setStudentsOptionData] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [totalDatasets, setTotalDatasets] = useState(0);
    const [loading, setLoading] = useState(false);
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
                const sortedData = listStudents.sort((a,b) => a?.user?.username.localeCompare(b?.user?.username));
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
        datasetService.fetchListStudentDatasets(username, (datasets) => {
            setTotalDatasets(datasets.length);
        })
    }

    const snapshot = useCallback(
        () => {
            const username = form.getFieldValue("student");
            const imageSrc = webcamRef.current.getScreenshot();
            const data = new FormData()
            data.append('username', username)
            data.append('file', imageSrc)
            datasetService.datasetCapture({
                data: data,
                onSuccess: (file_path) => {
                    console.log(`response = `, file_path)
                    datasetService.fetchListStudentDatasets(username, (datasets) => {
                        console.log("DATASET", datasets)
                        setTotalDatasets(datasets.length)
                    })
                },
                onError: (e) => {
                    console.log(e);
                    showErrorModal();
                    setLoading(false);
                }
            })
        },
        [webcamRef]
    );

    const detectFromRawDataset = () => {
        setLoading(true);
        const username = selectedStudent;
        const data = new FormData()
        data.append('username', username);
        datasetService.createFromRawDataset({
            data: data,
            onSuccess: (response) => {
                console.log(`response = `, response);
                setResult(response);
                setTotalDatasets(response.total_datasets);
                setLoading(false);
                showDataAddedNotification();
            },
            onError: (e) => {
                console.log(e);
                setLoading(false);
            }
        })
    }

    const handleSubmit = (values, onSuccess, onError) => {
        if (values.fileList) {
            let total_computation_time = 0;
            values.fileList.forEach((file, index) => {
                const fileData = file.originFileObj;
                console.log(fileData)
                const formData = new FormData();
                formData.append('username', selectedStudent);
                formData.append('file', fileData);
                datasetService.datasetCapture({
                    data: formData,
                    onSuccess: (response) => {
                        console.log(`response = `, response)
                        total_computation_time += response.computation_time;
                        if (index === values.fileList.length-1) {
                            response.computation_time = total_computation_time;
                            setResult(response);
                            setTotalDatasets(response.total_datasets);
                            showDataAddedNotification();
                            onSuccess();
                        }
                    },
                    onError: (e) => {
                        console.log(e);
                        onError();
                    }
                });
            })
        }
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Form form={form}>
                    <Form.Item label="Mahasiswa" name="student" required rules={[{required: true}]}>
                        <Select
                            options={studentsOptionData}
                            placeholder="Pilih Mahasiswa"
                            showSearch
                            onChange={onStudentSelected}
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                    {selectedStudent && (
                        <>
                            <Typography.Text>Total Dataset: {totalDatasets}</Typography.Text>
                            <Row gutter={16}>
                                <Col>
                                    <Switch size="default" onChange={onToggleWebcam}/>
                                </Col>
                                <Col>
                                    <Typography.Text>Webcam</Typography.Text>
                                </Col>
                            </Row>
                            {toggleWebcam && (
                                <WebcamCapture ref={webcamRef} className="w-100"/>
                            )}
                            <Row gutter={[16, 8]} style={{marginTop: 16}}>
                                <Col span={12}>
                                    <Button className="w-100" type="primary" size="large"
                                            onClick={snapshot}>
                                        Ambil Foto
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <ButtonUploadDatasets onSubmit={handleSubmit}/>
                                </Col>
                                <Col span={12}>
                                    <Button className="w-100" size="large"
                                            onClick={detectFromRawDataset} loading={loading}>
                                        Buat dari Raw Dataset
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form>
            </Col>
            {
                result && (
                    <Row gutter={[16, 8]} style={{marginTop: 16}}>
                        <Col span={24}>
                            <Typography.Text strong>Hasil Pembuatan Dataset:</Typography.Text>
                        </Col>
                        <Col span={24}>
                            <Space direction="vertical">
                                <Typography.Text>Total Dataset: {result.total_datasets}</Typography.Text>
                                <Typography.Text>Waktu komputasi: {result.computation_time} detik</Typography.Text>
                            </Space>
                        </Col>
                    </Row>
                )
            }
        </Row>
    )
}