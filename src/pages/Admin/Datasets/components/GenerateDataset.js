import {Alert, Button, Checkbox, Col, Collapse, Form, Row, Select, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {DatasetService, StudentService} from "../../../../services/services";
import {showDataAddedNotification} from "../../../../utils/Commons";
import {DatasetType} from "../../../../utils/Constants";

export function GenerateDataset() {

    const initialLoadingDataset = {[DatasetType.TRAINING]: false, [DatasetType.VALIDATION]: false}

    const [result, setResult] = useState(null);
    const [studentsOptionData, setStudentsOptionData] = useState([]);
    const [loading, setLoading] = useState(initialLoadingDataset);

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

    const detectFromRawDataset = (datasetType) => {
        setLoading(prevState => ({...prevState, [datasetType]: true}));
        form.validateFields().then(values => {
            const data = {
                usernames: values.students,
                dataset_type: datasetType,
                save_preprocessing: values.save_preprocessing
            }
            datasetService.createFromRawDataset({
                data: data,
                onSuccess: (response) => {
                    console.log(`response = `, response);
                    setResult(response);
                    setLoading(initialLoadingDataset);
                    showDataAddedNotification();
                },
                onError: (e) => {
                    console.log(e);
                    setLoading(initialLoadingDataset);
                }
            })
        }).catch(e => {
            console.log("Validate failed", e);
            setLoading(initialLoadingDataset);
        });
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Form form={form}>
                    <Form.Item label="Mahasiswa" name="students" required rules={[{required: true}]}>
                        <Select
                            mode="multiple"
                            options={studentsOptionData}
                            placeholder="Pilih Mahasiswa"
                            showSearch
                            allowClear
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                            maxTagCount="responsive"
                        />
                    </Form.Item>
                    <Collapse ghost>
                        <Collapse.Panel header="Konfigurasi" key="1">
                            <Row gutter={[8, 8]}>
                                <Col span={24}>
                                    <Form.Item name="save_preprocessing" valuePropName="checked" noStyle>
                                        <Checkbox>Simpan preprocessing</Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                    <Row gutter={[16, 8]}>
                        <Col span={12}>
                            <Button className="w-100" size="large" type="primary"
                                    onClick={() => detectFromRawDataset(DatasetType.TRAINING)}
                                    loading={loading[DatasetType.TRAINING]}>
                                Buat Dataset Latih
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button className="w-100" size="large"
                                    onClick={() => detectFromRawDataset(DatasetType.VALIDATION)}
                                    loading={loading[DatasetType.VALIDATION]}>
                                Buat Dataset Uji
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
            {result && (
                <Alert className="w-100" type="success" closable onClose={() => setResult(null)}
                       message={<Typography.Text strong>Dataset berhasil dibuat:</Typography.Text>}
                       description={(
                           <Row gutter={[16, 8]}>
                               <Col span={24}>
                                   <Row gutter={[8, 8]}>
                                       <Col xs={24} md={12}>
                                           <Typography.Text>Total Dataset: {result.total_datasets}</Typography.Text>
                                       </Col>
                                       <Col xs={24} md={12}>
                                           <Typography.Text>Total Mahasiswa: {result.total_users}</Typography.Text>
                                       </Col>
                                       <Col xs={24} md={12}>
                                           <Typography.Text>Waktu
                                               Komputasi: {result.computation_time} detik</Typography.Text>
                                       </Col>
                                       <Col xs={24} md={12}>
                                           <Typography.Text>
                                               Rata-rata Waktu
                                               Komputasi: {result.average_computation_time} detik/mahasiswa
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