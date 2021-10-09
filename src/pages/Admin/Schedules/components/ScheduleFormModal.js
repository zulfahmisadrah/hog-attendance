import React from 'react';
import {Form, Row, Col, Select, TimePicker} from 'antd';
import {dayOfWeekOptions} from "../../../../utils/Commons";
import {timeTextFormat} from "../../../../utils/Constants";
import {FormModal} from "../../../../components";


export function ScheduleFormModal(props) {
    const {title, visible, onCancel, data, onInitFormData, onSubmit, onFinish} = props;

    return (
        <FormModal
            title={title}
            visible={visible}
            onCancel={onCancel}
            data={data}
            onInitFormData={onInitFormData}
            onSubmit={onSubmit}
            onFinish={onFinish}
        >
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <Form.Item label="Hari" name="day_of_week" required rules={[{required: true}]}>
                        <Select options={dayOfWeekOptions} placeholder="Pilih Hari"/>
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item label="Jam Mulai" name="start_time">
                        <TimePicker format={timeTextFormat}/>
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item label="Jam Selesai" name="end_time">
                        <TimePicker format={timeTextFormat}/>
                    </Form.Item>
                </Col>
            </Row>
        </FormModal>
    )
}