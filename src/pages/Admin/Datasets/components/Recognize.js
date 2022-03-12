import {Alert, Button, Col, Form, Row, Select, Space, Switch, Typography} from "antd";
import {ButtonShowModal, WebcamCapture} from "../../../../components";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CourseService, DatasetService} from "../../../../services/services";
import {ButtonUploadDatasets} from "./ButtonUploadDatasets";
import {UploadImagesModal} from "./UploadImagesModal";
import {BASE_AVATAR_URL, BASE_RESULT_URL} from "../../../../utils/Constants";

export function Recognize() {
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
                const course_id = values.course;
                const imageSrc = webcamRef.current.getScreenshot();
                const data = new FormData()
                data.append('file', imageSrc)
                data.append('course_id', course_id)
                datasetService.recognizeUser({
                    data: data,
                    onSuccess: (response) => {
                        console.log(`response = `, response)
                        setResult(response);
                    }
                })
            }).catch(e => {
                console.log("Validate failed: ", e);
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

    return (
        <Row gutter={[16, 8]}>
            <Col xs={24} lg={12}>
                <Form form={form}>
                    <Row gutter={[8, 8]}>
                        <Col span={24}>
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
                        </Col>
                        <Col span={24}>
                            <ButtonShowModal
                                modal={UploadImagesModal}
                                className="w-100"
                                size="large"
                                type="primary"
                                modalProps={{maxSize: 3, onSubmit: recognize}}
                            >
                                Upload Gambar
                            </ButtonShowModal>
                        </Col>
                        {result && (
                            <Col span={24}>
                                <Alert className="w-100" type="success" closable onClose={() => setResult(null)}
                                       message={<Typography.Text strong>Hasil Pengenalan Wajah:</Typography.Text>}
                                       description={(
                                           <Row gutter={[16, 8]} style={{marginTop: 16}}>
                                               <Col span={24}>
                                                   <Space direction="vertical">
                                                       <Typography.Text>
                                                           Waktu Komputasi: {result.computation_time} detik
                                                       </Typography.Text>
                                                       <Typography.Text>
                                                           Wajah Terdeteksi: {result.total_detection}
                                                       </Typography.Text>
                                                       {/*<Typography.Text>*/}
                                                       {/*    Waktu Pengenalan: {result.recognition_time} detik*/}
                                                       {/*</Typography.Text>*/}
                                                       {/*<Typography.Text>*/}
                                                       {/*    Waktu Pendeteksian: {result.detection_time} detik*/}
                                                       {/*</Typography.Text>*/}
                                                   </Space>
                                               </Col>
                                               {result.predictions.length > 0 && (
                                                   <Col span={24}>
                                                       <Space direction="vertical">
                                                           <Typography.Text>Daftar Mahasiswa:</Typography.Text>
                                                           {result.predictions?.map(user => (
                                                               <Typography.Text>{user.username} - {user.name}</Typography.Text>
                                                           ))}
                                                       </Space>
                                                   </Col>
                                               )}
                                               <Col span={24}>
                                                   <a href={BASE_RESULT_URL + selectedCourse + "/0/" + result.image_name} target="_blank">
                                                       <img className="w-100" src={BASE_RESULT_URL + selectedCourse + "/0/" + result.image_name}
                                                            alt="result"/>
                                                   </a>
                                               </Col>
                                           </Row>
                                       )}
                                />
                            </Col>
                        )}
                    </Row>
                </Form>
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
                            <Button className="w-100" type="primary" size="large"
                                    onClick={recognizeFromWebcam}>
                                Ambil Foto
                            </Button>
                        </Col>
                    </Row>
                )}
            </Col>
        </Row>
    )
}