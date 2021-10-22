import React, {useState, useEffect} from 'react';
import {Form, Input, Row, Col, Select} from 'antd';
import {FacultyService} from "../../../../services/services";
import {FormModal} from "../../../../components";


export function DepartmentFormModal(props) {
    const {title, visible, onCancel, data, onSubmit, onFinish} = props;

    const [listFacultiesOptions, setListFacultiesOptions] = useState([]);

    const facultyService = new FacultyService();

    useEffect(() => {
        facultyService.getListFacultiesOptions(setListFacultiesOptions);
    }, []);

    const handleInitFormData = (formData) => {
        formData.faculty_id = formData.faculty?.id;
        return formData;
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
                    <Form.Item label="Fakultas" name="faculty_id" required rules={[{required: true}]}>
                        <Select options={listFacultiesOptions} placeholder="Pilih Fakultas"/>
                    </Form.Item>
                    <Form.Item
                        label="Nama"
                        name="name"
                        required
                        rules={[{required: true}]}
                    >
                        <Input placeholder="Nama"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Kode" name="code" rules={[
                        {type: "string", max: 3, message: "Kode tidak boleh lebih dari 3 karakter"}
                    ]}>
                        <Input placeholder="Kode"/>
                    </Form.Item>
                    <Form.Item label="Singkatan" name="alias">
                        <Input placeholder="Singkatan"/>
                    </Form.Item>
                </Col>
            </Row>
        </FormModal>
    )
}