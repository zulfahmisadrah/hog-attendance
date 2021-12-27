import {Button, Col, Form, Row, Select, Space, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {CourseService, DatasetService} from "../../../../services/services";
import {showDataAddedNotification} from "../../../../utils/Commons";

export function TrainModel() {
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const datasetService = new DatasetService();
    const courseService = new CourseService();

    useEffect(() => {
        initListCourses();
    }, []);

    const initListCourses = () => {
        courseService.getListCoursesOptions((listCoursesOptions) => setCoursesOptions(listCoursesOptions));
    }

    const onCourseSelected = (course_id) => {
        setSelectedCourse(course_id);
    }

    const train = () => {
        setLoading(true);
        const data = new FormData();
        data.append('course_id', selectedCourse);
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
                    <Form.Item label="Mata Kuliah" name="course" required rules={[{required: true}]}>
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