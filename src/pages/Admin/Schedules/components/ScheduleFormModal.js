import React from 'react';
import {Form, Row, Col, Select, TimePicker} from 'antd';
import {dayOfWeekOptions, getDateTimeFromString} from "../../../../utils/Commons";
import {timeFormat, timeTextFormat} from "../../../../utils/Constants";
import {FormModal} from "../../../../components";


export function ScheduleFormModal(props) {
    const {title, visible, onCancel, data, onSubmit, onFinish} = props;

    const handleInitFormData = (formData) => {
        formData.day_of_week = formData.day_of_week.toString();
        formData.start_time = getDateTimeFromString(formData.start_time, timeFormat);
        formData.end_time = getDateTimeFromString(formData.end_time, timeFormat);
        return formData
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
                    <Form.Item label="Hari" name="day_of_week" required rules={[{required: true}]}>
                        <Select options={dayOfWeekOptions} placeholder="Pilih Hari"/>
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item label="Jam Mulai" name="start_time" required rules={[{required: true}]}>
                        <TimePicker format={timeTextFormat}/>
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item label="Jam Selesai" name="end_time" required rules={[{required: true}]}>
                        <TimePicker format={timeTextFormat}/>
                    </Form.Item>
                </Col>
            </Row>
        </FormModal>
    )
}