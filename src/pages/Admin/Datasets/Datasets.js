import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Button, Card, Col, Row, Modal, Typography, Form, Select, Tabs} from "antd";
import PropTypes from "prop-types";
import {WebcamCapture} from "../../../components";
import {StudentService, CourseService, DatasetService} from "../../../services/services";
import styled from "styled-components";
import {DatasetTable} from "./components";
import {ButtonUploadDatasets} from "./components/ButtonUploadDatasets";

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
        const data = new FormData()
        data.append('course_id', selectedCourse)
        datasetService.trainDatasets({
            data: data,
            onSuccess: (filePath) => {
                console.log(filePath)
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
        const studentsOptionData = filteredData.map(student => ({
            label: `${student.user?.username} - ${student.user?.name}`,
            value: student.user?.username
        }))
        setStudentsOptionData(studentsOptionData)
    }

    // const showUploadModal = () => {
    //
    //     return (
    //         <M
    //     )
    //
    // }

    return (
        <Row gutter={[16, 16]}>
            <Col xs={{span: 24, order: 1}} md={{span: 12, order: 2}}>
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
                                                <WebcamCapture ref={webcamRef}/>
                                                <Row gutter={16}>
                                                    <Col span={12}>
                                                        <Button className="w-100" type="primary" size="large"
                                                                onClick={snapshot}>
                                                            Ambil Foto
                                                        </Button>
                                                    </Col>
                                                    <Col span={12}>
                                                        <ButtonUploadDatasets data={selectedData}/>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Model" key="2">
                                <Row gutter={16}>
                                    <Col span={12}>
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
                                        <Button className="w-100" type="primary" size="large" onClick={train}>Buat
                                            Model</Button>
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Uji" key="3">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <WebcamCapture ref={webcamRef}/>
                                    </Col>
                                    <Col span={12}>
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
                                        <Button className="w-100" type="primary" size="large"
                                                onClick={recognize}>Kenali</Button>
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </StyledDiv>
            </Col>
            <Col xs={{span: 24, order: 2}} md={{span: 12, order: 1}}>
                <Card title="Daftar Dataset">
                    <DatasetTable/>
                </Card>
            </Col>
        </Row>
    )
}