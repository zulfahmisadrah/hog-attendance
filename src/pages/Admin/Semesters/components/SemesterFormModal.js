import React from 'react';
import {Form, Row, Col, Select, InputNumber} from 'antd';
import {semesterTypeOptions} from "../../../../utils/Commons";
import {FormModal} from "../../../../components";


export function SemesterFormModal(props) {
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
                    <Form.Item label="Tahun" name="year" required rules={[{required: true}]}>
                        <InputNumber className="w-100" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Jenis" name="type" required rules={[{required: true}]}>
                        <Select options={semesterTypeOptions} placeholder="Pilih Jenis"/>
                    </Form.Item>
                </Col>
            </Row>
        </FormModal>
    )
}