import React, {useState, useEffect} from 'react';
import {Form, Row, Col, Select, TimePicker} from 'antd';
import {dayOfWeekOptions, formatMomentToString, getDateTimeFromString, showErrorModal} from "../../../../utils/Commons";
import {timeFormat, timeTextFormat} from "../../../../utils/Constants";
import {ScheduleService} from "../../../../services/services";
import {FormModal} from "../../../../components";


export function ScheduleFormModal(props) {
    const {data, title, visible, onFinish, onCancel} = props;

    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const scheduleService = new ScheduleService();

    useEffect(() => {
        if (data) setInitialFieldsValue(data)
    }, [data]);

    const setInitialFieldsValue = (data) => {
        const formData = {...data};
        formData.day_of_week = formData.day_of_week.toString();
        formData.start_time = getDateTimeFromString(formData.start_time, timeFormat);
        formData.end_time = getDateTimeFromString(formData.end_time, timeFormat);
        form.setFieldsValue(formData);
    }

    const handleSubmit = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            console.log(values)
            values.day_of_week = parseInt(values.day_of_week)
            values.start_time = formatMomentToString(values.start_time, timeFormat)
            values.end_time = formatMomentToString(values.end_time, timeFormat)
            if (data) {
                updateSchedule(values);
            } else {
                createSchedule(values);
            }
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

    const createSchedule = (formData) => {
        scheduleService.createData({
            data: formData,
            onSuccess: (newData) => {
                onFinish(newData);
                setConfirmLoading(false);
                form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error);
                setConfirmLoading(false);
            },
        })
    }

    const updateSchedule = (formData) => {
        scheduleService.updateData({
            data: formData,
            onSuccess: (updatedData) => {
                onFinish(updatedData);
                setConfirmLoading(false);
                form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error);
                setConfirmLoading(false);
            },
        })
    }

    return (
        <FormModal
            form={form}
            data={data}
            onSubmit={handleSubmit}
            title={title}
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
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