import {Button, Col, Form, Row, Select, Space, Switch, Typography} from "antd";
import {ButtonShowModal, WebcamCapture} from "../../../../components";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CourseService, DatasetService} from "../../../../services/services";
import {ButtonUploadDatasets} from "./ButtonUploadDatasets";
import {UploadImagesModal} from "./UploadImagesModal";

export function Recognize() {
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [message, setMessage] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toggleWebcam, setToggleWebcam] = useState(false);

    const webcamRef = useRef(null);
    const [form] = Form.useForm();

    const datasetService = new DatasetService();
    const courseService = new CourseService();

    useEffect(() => {
        initListCourses();
    }, []);

    const initListCourses = () => {
        courseService.getListCoursesOptions((listCoursesOptions) => setCoursesOptions(listCoursesOptions));
    }

    const onToggleWebcam = (value) => {
        setToggleWebcam(value);
    }

    const onCourseSelected = (course_id) => {
        setSelectedCourse(course_id);
    }

    const recognizeFromWebcam = useCallback(
        () => {
            form.validateFields().then(values => {
                console.log(values);
            }).catch(e => {
                console.log("Validate failed: ", e);
            })
            const course_id = form.getFieldValue("course")
            const imageSrc = webcamRef.current.getScreenshot();
            const data = new FormData()
            data.append('file', imageSrc)
            data.append('course_id', course_id)
            datasetService.recognizeUser({
                data: data,
                onSuccess: (file_path) => {
                    console.log(`response = `, file_path)
                    // setName(res.data)
                    // fetchListStudentDatasets(student_id, (datasets) => {
                    //     console.log("DATASET", datasets)
                    //     setTotalDatasets(datasets.data.length)
                    // })
                }
            })
        },
        [webcamRef]
    );

    const recognize = (uploadedFiles, onSuccess, onError) => {
        form.validateFields().then(values => {
            console.log(values);
            const course_id = values.course;
            uploadedFiles.fileList.forEach(file => {
                const imageSrc = file.originFileObj;
                console.log(imageSrc);
                const data = new FormData();
                data.append('file', imageSrc);
                data.append('course_id', course_id);
                datasetService.recognizeUser({
                    data: data,
                    onSuccess: (response) => {
                        console.log(`response = `, response);
                        setMessage(response.result);
                        onSuccess();
                    },
                    onError: e => {
                        console.log(e);
                        onError();
                    }
                });
            });
        }).catch(e => {
            console.log("Validate failed: ", e);
        })
    }

    const recognizeFromTestFolder = () => {

    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Form form={form}>
                    <Form.Item label="Mata Kuliah" name="course" required
                               rules={[{required: true, message: 'Mata Kuliah harus terisi'}]}>
                        <Select
                            options={coursesOptions}
                            placeholder="Pilih Mata Kuliah"
                            showSearch
                            onChange={onCourseSelected}
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                </Form>
            </Col>
            <Col span={24}>
                <Row gutter={16}>
                    <Col>
                        <Switch size="default" onChange={onToggleWebcam}/>
                    </Col>
                    <Col>
                        <Typography.Text>Webcam</Typography.Text>
                    </Col>
                </Row>
                {
                    toggleWebcam && (
                        <WebcamCapture ref={webcamRef} className="w-100"/>
                    )
                }
            </Col>
            <Col span={24}>
                <Row gutter={[16, 8]} style={{marginTop: 16}}>
                    <Col span={12}>
                        <Button className="w-100" type="primary" size="large" onClick={recognizeFromWebcam}>Kenali</Button>
                    </Col>
                    <Col span={12}>
                        <ButtonShowModal
                            modal={UploadImagesModal}
                            onSubmit={recognize}
                            buttonProps={{className: "w-100", size: "large"}}
                            modalProps={{maxSize: 3}}
                        >
                            Upload Gambar
                        </ButtonShowModal>
                    </Col>
                    <Col span={12}>
                        <Button className="w-100" size="large"
                                onClick={recognizeFromTestFolder} loading={loading}>
                            Kenali dari Test Folder
                        </Button>
                    </Col>
                </Row>
            </Col>
            {
                message && (
                    <Space direction="vertical">
                        <Typography.Text>{message.length} wajah terdeteksi</Typography.Text>
                        <Typography.Text strong>Hasil Pengenalan Wajah:</Typography.Text>
                        {message.map(user => (
                            <Typography.Text>{user.name}</Typography.Text>
                        ))}
                    </Space>
                )
            }
            <Col span={24}>
            </Col>
        </Row>
    )
}