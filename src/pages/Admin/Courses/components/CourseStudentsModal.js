import React, {useState, useEffect} from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Row,
    Col, Space, Button, Typography, Table
} from 'antd';
import {listCourseTypeOptions, showErrorModal} from "../../../../utils/Commons";
import {FacultyService, DepartmentService, CourseService} from "../../../../services/services";
import {ButtonAddData, SearchField} from "../../../../components";


export function CourseFormModal(props) {
    const {data, title, visible, onSubmit, onCancel} = props;

    const [listFacultiesOptions, setListFacultiesOptions] = useState([]);
    const [listDepartmentOptions, setListDepartmentOptions] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();
    const courseService = new CourseService();
    const facultyService = new FacultyService();
    const departmentService = new DepartmentService();

    useEffect(() => {
        setInitialFieldsValue(data)
    }, [data]);

    useEffect(() => {
        facultyService.getListFacultiesOptions(setListFacultiesOptions)
        departmentService.getListDepartmentsOptions(undefined, setListDepartmentOptions)
    }, []);

    const setInitialFieldsValue = (data, form) => {
        if (data) {
            if (Object.keys(data).length !== 0) {
                const formData = {...data}
                form.setFieldsValue(formData);
            }
        }
    }

    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            if (data) {
                updateCourse(values)
            } else {
                createCourse(values)
            }
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

    const createCourse = (formData) => {
        courseService.createData({
            data: formData,
            onSuccess: (newData) => {
                onSubmit(newData)
                setConfirmLoading(false)
                // form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error)
                setConfirmLoading(false)
            },
        })
    }

    const updateCourse = (formData) => {
        courseService.updateData({
            data: formData,
            onSuccess: (updatedData) => {
                onSubmit(updatedData)
                setConfirmLoading(false)
                form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error)
                setConfirmLoading(false)
            },
        })
    }

    const handleCancel = () => {
        onCancel();
    }

    const onFacultyChange = (faculty_id) => {
        departmentService.getListDepartmentsOptions(faculty_id, setListDepartmentOptions)
    }

    return (
        <Space direction="vertical">
            <Row justify="space-between">
                <Space>
                    <Button type="secondary" onClick={reload} disabled={!hasSelected}>
                        Batal
                    </Button>
                    <Typography.Text>{hasSelected ? `${selectedRowKeys.length} data terseleksi` : `Total data: ${filteredData.length}`}</Typography.Text>
                </Space>
                <Space>
                    <SearchField placeholder="Nama atau Kode" onSearch={onSearch} />
                    <ButtonAddData formModal={CourseFormModal} onSubmit={onCreateFinished} />
                </Space>
            </Row>
            <Table
                scroll={{scrollToFirstRowOnChange: true, x: 1000, y: 600}}
                sticky
                loading={loading}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
            />
        </Space>
    )
}