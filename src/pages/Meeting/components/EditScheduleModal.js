import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Modal, Popconfirm, Row, Select, Space, TimePicker, Typography} from "antd";
import PropTypes from "prop-types";
import {dateFormat, DayOfWeek, DayOfWeekInteger, timeFormat, timeTextFormat} from "../../../utils/Constants";
import {FormModal} from "../../../components";
import {
    formatMomentToString,
    getDateTimeFromString,
    getDayFromMoment,
    showDataUpdatedNotification
} from "../../../utils/Commons";
import {MeetingService} from "../../../services/services";

EditScheduleModal.propTypes = {
    data: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
}

export function EditScheduleModal(props) {
    const {visible, onCancel, data, onSubmit, onFinish} = props;

    const meetingService = new MeetingService();

    const handleInitFormData = (formData) => {
        formData.date = getDateTimeFromString(formData.date, dateFormat);
        formData.start_time = getDateTimeFromString(formData.start_time || formData.schedule?.start_time, timeFormat);
        formData.end_time = getDateTimeFromString(formData.end_time || formData.schedule?.end_time, timeFormat);
        return formData;
    }

    const handleSubmit = (values, onSuccess, onError) => {
        values.day_of_week = DayOfWeekInteger[getDayFromMoment(values.date)];
        values.date = formatMomentToString(values.date, dateFormat);
        values.start_time = formatMomentToString(values.start_time, timeFormat);
        values.end_time = formatMomentToString(values.end_time, timeFormat);
        const updatedData = {
            ...data,
            ...values
        }
        onSubmit(updatedData, onSuccess, onError);
        // meetingService.updateData({
        //     data: updatedData,
        //     onSuccess: () => {
        //         onSuccess();
        //         showDataUpdatedNotification();
        //     },
        //     onError: (e) => {
        //         onError(e);
        //     }
        // })
    }

    return (
        <FormModal
            title="Ubah Jadwal"
            visible={visible}
            onCancel={onCancel}
            data={data}
            onInitFormData={handleInitFormData}
            onSubmit={handleSubmit}
            onFinish={onFinish}
        >
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <Form.Item label="Tanggal" name="date" required rules={[{required: true}]}>
                        <DatePicker
                            format={dateFormat}
                            placeholder="Pilih Tanggal"
                            style={{width: '100%'}}
                        />
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
    );
}