import React from 'react';
import {Form, Row, Col, InputNumber} from 'antd';
import {FormModal} from "../../../../components";

export function GenerateMeetingFormModal(props) {
    const {title, visible, onCancel, onSubmit, onFinish} = props;

    return (
        <FormModal
            title={title}
            visible={visible}
            onCancel={onCancel}
            onSubmit={onSubmit}
            onFinish={onFinish}
        >
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <Form.Item label="Jumlah" name="quantity" required
                               help="Jumlah pertemuan yang mau dibuat"
                               rules={[
                                   {type: "number", min: 1, message: "Nilai harus lebih besar dari 0"}
                               ]}>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label="Incremental" name="incremental"
                               help="Kenaikan nomor pertemuan (default: 1)"
                               rules={[
                                   {type: "number", min: 1, message: "Nilai harus lebih besar dari 0"}
                               ]}>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Interval (hari)" name="interval"
                               help="ex. 7, untuk pertemuan sekali seminggu (default: 7)"
                               rules={[
                                   {type: "number", min: 1, message: "Nilai harus lebih besar dari 0"}
                               ]}>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                </Col>
            </Row>
        </FormModal>
    )
}