import React, {useState, useEffect} from 'react';
import {Form, Input, Select, InputNumber, Row, Col} from 'antd';
import {listCourseTypeOptions} from "../../../../utils/Commons";
import {FacultyService, DepartmentService} from "../../../../services/services";
import {FormModal} from "../../../../components";


export function CourseFormModal(props) {
    const {title, visible, onCancel, data, onSubmit, onFinish} = props;

    const [listFacultiesOptions, setListFacultiesOptions] = useState([]);
    const [listDepartmentOptions, setListDepartmentOptions] = useState([]);

    const facultyService = new FacultyService();
    const departmentService = new DepartmentService();

    const handleInitFormData = (formData) => {
        formData.faculty = formData.department?.faculty?.id;
        formData.department_id = formData.department?.id;
        return formData;
    }

    useEffect(() => {
        facultyService.getListFacultiesOptions(setListFacultiesOptions)
        departmentService.getListDepartmentsOptions(undefined, setListDepartmentOptions)
    }, []);

    const onFacultyChange = (faculty_id) => {
        departmentService.getListDepartmentsOptions(faculty_id, setListDepartmentOptions)
    }

    return (
        <FormModal
            title={title}
            visible={visible}
            onCancel={onCancel}
            data={data}
            onInitFormData={handleInitFormData}
            onSubmit={onSubmit}
            onFinish={onFinish}
        >
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <Form.Item label="Nama" name="name" required rules={[{required: true}]}>
                        <Input placeholder="Nama"/>
                    </Form.Item>
                    <Form.Item label="Kode" name="code" required rules={[{required: true}]}>
                        <Input placeholder="Kode"/>
                    </Form.Item>
                    <Form.Item label="Semester" name="semester" required
                               rules={[
                                   {required: true},
                                   {required: true, type: "number", min: 0}
                               ]}>
                        <InputNumber className="w-100"/>
                    </Form.Item>
                    <Form.Item label="SKS" name="sks" required
                               rules={[
                                   {required: true},
                                   {required: true, type: "number", min: 0}
                               ]}
                    >
                        <InputNumber className="w-100"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Jenis" name="type" required rules={[{required: true}]}>
                        <Select options={listCourseTypeOptions} placeholder="Pilih Jenis"/>
                    </Form.Item>
                    <Form.Item label="Fakultas" name="faculty">
                        <Select options={listFacultiesOptions} placeholder="Pilih Fakultas"
                                onChange={onFacultyChange}/>
                    </Form.Item>
                    <Form.Item label="Departemen" name="department_id" required rules={[{required: true}]}>
                        <Select options={listDepartmentOptions} placeholder="Pilih Departemen"/>
                    </Form.Item>
                    <Form.Item label="Daya Tampung" name="quota" required
                               rules={[
                                   {required: true},
                                   {required: true, type: "number", min: 0}
                               ]}
                    >
                        <InputNumber className="w-100"/>
                    </Form.Item>
                </Col>
            </Row>
        </FormModal>
    )
}