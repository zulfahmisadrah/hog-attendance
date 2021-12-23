import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Button, Card, Col, Row, Modal, Typography, Form, Select, Tabs, Switch} from "antd";
import PropTypes from "prop-types";
import {WebcamCapture} from "../../../components";
import {StudentService, CourseService, DatasetService} from "../../../services/services";
import styled from "styled-components";
import {DatasetTable, Recognize} from "./components";
import {ButtonUploadDatasets} from "./components/ButtonUploadDatasets";
import {showDataAddedNotification} from "../../../utils/Commons";

const StyledDiv = styled.div`
  .card-container p {
    margin: 0;
  }

  .card-container > .ant-tabs-card .ant-tabs-content {
    margin-top: -16px;
  }

  .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
    padding: 16px;
    background: #fff;
  }

  .card-container > .ant-tabs-card > .ant-tabs-nav::before {
    display: none;
  }

  .card-container > .ant-tabs-card .ant-tabs-tab,
  [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
    background: transparent;
    border-color: transparent;
  }

  .card-container > .ant-tabs-card .ant-tabs-tab-active,
  [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
    background: #fff;
    border-color: #fff;
  }

  #components-tabs-demo-card-top .code-box-demo {
    padding: 24px;
    overflow: hidden;
    background: #f5f5f5;
  }
`

const initialVisible = {create: false, edit: false}

Datasets.propTypes = {
    isSelectDataMode: PropTypes.bool,
    onDataSelected: PropTypes.func
}

export function Datasets(props) {
    const {isSelectDataMode, onDataSelected} = props

    const {confirm, info} = Modal;

    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState({fetch: false, filter: false, reload: false});
    const [visible, setVisible] = useState(initialVisible);
    const [studentsData, setStudentsData] = useState([]);
    const [totalDatasets, setTotalDatasets] = useState(0);
    const [studentsOptionData, setStudentsOptionData] = useState([]);
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toggleWebcam, setToggleWebcam] = useState(false);
    const webcamRef = useRef(null);
    const [form] = Form.useForm();

    const hasSelected = selectedRowKeys.length > 0;
    const studentService = new StudentService();
    const courseService = new CourseService();
    const datasetService = new DatasetService();

    useEffect(() => {
        if (data.length === 0) fetchData();
        getListStudentOptions(filteredData);
    }, [filteredData]);

    useEffect(() => {
        initListCourses()
    }, [])

    const fetchData = () => {
        setIsLoading(prevState => ({...prevState, fetch: true}))
        studentService.getListData({
            onSuccess: (listStudents) => {
                setData(listStudents)
                setFilteredData(listStudents)
                setIsLoading(prevState => ({...prevState, fetch: false}))
            }
        })
    }

    const initListCourses = () => {
        courseService.getListCoursesOptions((listCoursesOptions) => setCoursesOptions(listCoursesOptions))
    }

    const detectFromRawDataset = () => {
        setLoading(true);
        const username = selectedData;
        const data = new FormData()
        data.append('username', username);
        datasetService.createFromRawDataset({
            data: data,
            onSuccess: (filePath) => {
                console.log(filePath);
                setLoading(false);
                showDataAddedNotification();
            },
            onError: (e) => {
                console.log(e);
                setLoading(false);
            }
        })
    }

    const snapshot = useCallback(
        () => {
            const username = form.getFieldValue("student");
            const imageSrc = webcamRef.current.getScreenshot();
            const data = new FormData()
            data.append('username', username)
            data.append('file', imageSrc)
            datasetService.datasetCapture(data, (file_path) => {
                console.log(`response = `, file_path)
                datasetService.fetchListStudentDatasets(username, (datasets) => {
                    console.log("DATASET", datasets)
                    setTotalDatasets(datasets.length)
                })
            })
        },
        [webcamRef]
    )

    const train = () => {
        setLoading(true);
        const data = new FormData()
        data.append('course_id', selectedCourse)
        datasetService.trainDatasets({
            data: data,
            onSuccess: (filePath) => {
                console.log(filePath);
                setLoading(false);
                showDataAddedNotification();
            },
            onError: (e) => {
                console.log(e);
                setLoading(false);
            }
        })
    }

    const recognize = useCallback(
        () => {
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
    )

    const onStudentSelected = (username) => {
        setSelectedData(username);
        datasetService.fetchListStudentDatasets(username, (datasets) => {
            setTotalDatasets(datasets.length);
        })
    }

    const onCourseSelected = (course_id) => {
        setSelectedCourse(course_id)
    }

    const getListStudentOptions = (filteredData) => {
        const sortedData = filteredData.sort((a,b) => a?.user?.username.localeCompare(b?.user?.username));
        const studentsOptionData = sortedData.map(student => ({
            label: `${student.user?.username} - ${student.user?.name}`,
            value: student.user?.username
        }))
        setStudentsOptionData(studentsOptionData)
    }

    const onToggleWebcam = (value) => {
        setToggleWebcam(value);
    }

    const handleSubmit = (values, onSuccess) => {
        if (values.fileList) {
            values.fileList.forEach((file, index) => {
                const fileData = file.originFileObj;
                console.log(fileData)
                const formData = new FormData();
                formData.append('username', selectedData);
                formData.append('file', fileData);
                datasetService.datasetCapture(formData, (file_path) => {
                    console.log(`response = `, file_path);
                    if (index === values.fileList.length-1) {
                        showDataAddedNotification();
                        onSuccess();
                    }
                })
            })
        }
    }

    return (
        <Row gutter={[16, 16]}>
            <Col xs={{span: 24, order: 1}} lg={{span: 12, order: 2}}>
                <StyledDiv>
                    <div className="card-container">
                        <Tabs type="card">
                            <Tabs.TabPane tab="Dataset" key="1">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Mahasiswa" name="student" required rules={[{required: true}]}>
                                            <Select
                                                options={studentsOptionData}
                                                placeholder="Pilih Mahasiswa"
                                                showSearch
                                                onChange={onStudentSelected}
                                                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                            />
                                        </Form.Item>
                                        {selectedData && (
                                            <>
                                                <Typography.Text>Total Data: {totalDatasets}</Typography.Text>
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
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Model" key="2">
                                <Row gutter={16}>
                                    <Col span={24}>
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
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Uji" key="3">
                                <Recognize />
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </StyledDiv>
            </Col>
            <Col xs={{span: 24, order: 2}} lg={{span: 12, order: 1}}>
                <Card title="Daftar Dataset">
                    <DatasetTable/>
                </Card>
            </Col>
        </Row>
    )
}