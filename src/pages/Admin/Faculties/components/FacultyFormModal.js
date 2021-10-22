import React from 'react';
import {Form, Input, Row, Col} from 'antd';
import {FormModal} from "../../../../components";


export function FacultyFormModal(props) {
    const {title, visible, onCancel, data, onSubmit, onFinish} = props;

    return (
        <FormModal
            title={title}
            visible={visible}
            onCancel={onCancel}
            data={data}
            onSubmit={onSubmit}
            onFinish={onFinish}
        >
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Nama"
                        name="name"
                        required
                        rules={[{required: true}]}
                    >
                        <Input placeholder="Nama"/>
                    </Form.Item>
                    <Form.Item label="Singkatan" name="alias">
                        <Input placeholder="Singkatan"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Kode" name="code" rules={[
                        {type: "string", max: 3, message: "Kode tidak boleh lebih dari 3 karakter"}
                    ]}>
                        <Input placeholder="Kode"/>
                    </Form.Item>
                </Col>
            </Row>
        </FormModal>
    )
}