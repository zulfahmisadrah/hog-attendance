import {Alert, Button, Checkbox, Col, Collapse, Form, Row, Select, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {CourseService, DatasetService} from "../../../../services/services";
import {showDataAddedNotification} from "../../../../utils/Commons";

export function TrainModel() {
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [result, setResult] = useState(null);
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

    const train = () => {
        setLoading(true);
        form.validateFields().then(values => {
            const data = {
                course_id: values.course,
                save_preprocessing: values.save_preprocessing,
                deep_training: values.deep_training,
                validate_model: values.validate_model
            }
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
        }).catch(e => {
            console.log("Validate failed", e);
            setLoading(false);
        });
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
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                    <Collapse ghost>
                        <Collapse.Panel header="Konfigurasi" key="1">
                            <Row gutter={[8, 8]}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="save_preprocessing" valuePropName="checked" noStyle>
                                        <Checkbox>Simpan preprocessing</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="deep_training" valuePropName="checked" noStyle>
                                        <Checkbox>Deep training</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="validate_model" valuePropName="checked" noStyle>
                                        <Checkbox>Validasi</Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                    <Button className="w-100" type="primary" size="large" onClick={train} loading={loading}>
                        Buat Model
                    </Button>
                </Form>
            </Col>
            {result && (
                <Alert className="w-100" type="success" closable onClose={() => setResult(null)}
                       message={<Typography.Text strong>Model berhasil dibuat:</Typography.Text>}
                       description={(
                           <Row gutter={[16, 8]} style={{marginTop: 16}}>
                               <Col span={24}>
                                   <Row gutter={[8, 8]}>
                                       {result.accuracy !== 0 && (
                                           <>
                                               <Col xs={24} md={12}>
                                                   <Typography.Text>
                                                       Akurasi: {result.accuracy} %
                                                   </Typography.Text>
                                               </Col>
                                               <Col xs={24} md={12}>
                                                   <Typography.Text>
                                                       Waktu Pelatihan: {result.training_time} detik
                                                   </Typography.Text>
                                               </Col>
                                               <Col xs={24} md={12}>
                                                   <Typography.Text>
                                                       Waktu Validasi: {result.validating_time} detik
                                                   </Typography.Text>
                                               </Col>
                                           </>
                                       )}
                                       <Col xs={24} md={12}>
                                           <Typography.Text>
                                               Total Waktu Komputasi: {result.computation_time} detik
                                           </Typography.Text>
                                       </Col>
                                   </Row>
                               </Col>
                           </Row>
                       )}
                />
            )}
        </Row>
    )
}