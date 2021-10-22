import React, {useState, useEffect} from 'react';
import {Form, Input, Row, Col, Select, InputNumber, DatePicker, TimePicker,} from 'antd';
import {dateFormat, DayOfWeekInteger, timeFormat, timeTextFormat} from "../../../../utils/Constants";
import {formatMomentToString, getDateTimeFromString, getDayFromMoment} from "../../../../utils/Commons";
import {CourseService, ScheduleService} from "../../../../services/services";
import {FormModal} from "../../../../components";

export function MeetingFormModal(props) {
    const {title, visible, onCancel, data, onSubmit, onFinish} = props;

    const [coursesOptions, setCoursesOptions] = useState([]);
    const [scheduleOptions, setScheduleOptions] = useState([]);

    const courseService = new CourseService();
    const scheduleService = new ScheduleService();

    useEffect(() => {
        courseService.getListCoursesOptions((listCoursesOptions) => setCoursesOptions(listCoursesOptions))
        scheduleService.getListScheduleOptions((listOptions) => setScheduleOptions(listOptions))
    }, []);

    const handleInitFormData = (formData) => {
        formData.course_id = formData.course?.id;
        formData.schedule_id = formData.schedule?.id;
        formData.date = getDateTimeFromString(formData.date, dateFormat);
        formData.start_time = formData.start_time && getDateTimeFromString(formData.start_time, timeFormat);
        formData.end_time = formData.end_time && getDateTimeFromString(formData.end_time, timeFormat);
        return formData;
    }

    const handleSubmit = (values, onSuccess, onError) => {
        values.day_of_week = DayOfWeekInteger[getDayFromMoment(values.date)];
        values.date = formatMomentToString(values.date, dateFormat);
        values.start_time = values.start_time && formatMomentToString(values.start_time, timeFormat);
        values.end_time = values.end_time && formatMomentToString(values.end_time, timeFormat);
        onSubmit(values, onSuccess, onError);
    }

    return (
        <FormModal
            title={title}
            visible={visible}
            onCancel={onCancel}
            data={data}
            onInitFormData={handleInitFormData}
            onSubmit={handleSubmit}
            onFinish={onFinish}
        >
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <Form.Item label="Mata Kuliah" name="course_id" required rules={[{required: true}]}>
                        <Select
                            options={coursesOptions}
                            placeholder="Pilih Mata Kuliah"
                            showSearch
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                    <Form.Item label="Pertemuan ke" name="number" rules={[
                        {type: "number", min: 1, message: "Nilai harus lebih besar dari 0"}
                    ]}>
                        <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label="Nama" name="name">
                        <Input placeholder="Nama Pertemuan"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Jadwal" name="schedule_id" required rules={[{required: true}]}>
                        <Select
                            options={scheduleOptions}
                            placeholder="Pilih jadwal"
                            showSearch
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                    <Form.Item label="Tanggal" name="date" required rules={[{required: true}]}>
                        <DatePicker
                            format={dateFormat}
                            placeholder="Pilih Tanggal"
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="Jam Mulai" name="start_time">
                                <TimePicker format={timeTextFormat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Jam Selesai" name="end_time">
                                <TimePicker format={timeTextFormat}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </FormModal>
    )
}