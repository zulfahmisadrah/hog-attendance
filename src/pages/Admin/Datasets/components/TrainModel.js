import {Button, Col, Form, Row, Select, Space, Switch, Typography} from "antd";
import {ButtonShowModal, WebcamCapture} from "../../../../components";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CourseService, DatasetService} from "../../../../services/services";
import {ButtonUploadDatasets} from "./ButtonUploadDatasets";
import {UploadImagesModal} from "./UploadImagesModal";
import {BASE_AVATAR_URL, BASE_RESULT_URL} from "../../../../utils/Constants";
import {showDataAddedNotification} from "../../../../utils/Commons";

export function TrainModel() {
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [result, setResult] = useState(null);
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
                        setResult(response);
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

    const train = () => {
        setLoading(true);
        const data = new FormData()
        data.append('course_id', selectedCourse)
        datasetService.trainDatasets({
            data: data,
            onSuccess: (response) => {
                console.log(`response = `, response);
                setResult(response);
                setLoading(false);
                showDataAddedNotification();
            },
            onError: (e) => {
                console.log(e);
                setLoading(false);
            }
        })
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Form form={form}>
                    <Form.Item label="Mata Kuliah" name="course" required
                               rules={[{required: true}]}>
                        <Select
                            options={coursesOptions}
                            placeholder="Pilih Mata Kuliah"
                            showSearch
                            onChange={onCourseSelected}
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                    <Button className="w-100" type="primary" size="large" onClick={train} loading={loading}>
                        Buat Model
                    </Button>
                </Form>
            </Col>
            {
                result && (
                    <Row gutter={[16, 8]} style={{marginTop: 16}}>
                        <Col span={24}>
                            <Typography.Text strong>Hasil Pelatihan Model:</Typography.Text>
                        </Col>
                        <Col span={24}>
                            <Space direction="vertical">
                                <Typography.Text>Akurasi: {result.accuracy} %</Typography.Text>
                                <Typography.Text>Waktu pelatihan: {result.training_time} detik</Typography.Text>
                                <Typography.Text>Waktu validasi: {result.validating_time} detik</Typography.Text>
                                <Typography.Text>Total waktu komputasi: {result.computation_time} detik</Typography.Text>
                            </Space>
                        </Col>
                    </Row>
                )
            }
        </Row>
    )
}