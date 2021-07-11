import React, {useState, useEffect} from 'react';
import {Modal, Form, Input, Row, Col, Select, InputNumber, DatePicker,} from 'antd';
import {dateTimeFormat, listMeetingDuration, listTopic, scheduleFormat,} from "../../../../utils/Constants";
import {formatMomentToString, getDateTimeFromString, showErrorModal} from "../../../../utils/Commons";
import {createMeeting, fetchTeachers, updateMeeting,} from "../../../../services";

function MeetingFormModal(props) {
    const {data, title, visible, onSubmit, onCancel} = props;

    const [listTeacher, setListTeacher] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        setInitialFieldsValue(data, form)
        if (listTeacher.length === 0) fetchListTeacher()
    }, [data, form]);

    const fetchListTeacher = () => {
        fetchTeachers((listData) => {
            const sortedData = listData.sort((a,b) => a.user.name.localeCompare(b.user.name))
            setListTeacher(sortedData)
        })
    }

    const setInitialFieldsValue = (data, form) => {
        if (data) {
            if (Object.keys(data).length !== 0) {
                const formData = {...data}
                formData.teacher = formData.teacher.id
                formData.duration = formData.duration.toString()
                formData.schedule = getDateTimeFromString(formData.schedule)
                form.setFieldsValue(formData);
            }
        }
    }

    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            values.schedule = formatMomentToString(values.schedule, dateTimeFormat)
            values.duration = parseInt(values.duration.split(" ")[0])
            if (data) {
                updateMeetingFromValues(values)
            } else {
                createMeetingFromValues(values)
            }
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

    const createMeetingFromValues = (values) => {
        createMeeting({
            meeting: values,
            onSuccess: () => {
                onSubmit(values)
                setConfirmLoading(false)
                form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error)
                setConfirmLoading(false)
            },
        },)
    }

    const updateMeetingFromValues = (values) => {
        updateMeeting({
            meeting: values,
            onSuccess: () => {
                onSubmit(values)
                setConfirmLoading(false)
                form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error)
                setConfirmLoading(false)
            }
        })
    }

    const handleCancel = () => {
        onCancel();
    }

    const getListTeacherOptions = () => listTeacher.map(value => (
        <Select.Option key={value.id} value={value.id}>{value.user.name} ({value.field})</Select.Option>
    ))

    const listDurationOptions = Object.keys(listMeetingDuration).map(key => ({
            label: listMeetingDuration[key],
            value: key
        })
    )

    const listSubjectOptions = Object.keys(listTopic).map(key => ({
            label: key,
            value: key
        })
    )

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            okText="Simpan"
            cancelText="Batal"
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={640}
            bodyStyle={{height: '500px', overflowY: 'auto'}}
        >
            <Form
                layout='vertical'
                form={form}
            >
                <Row>
                    <Col span={11}>
                        {data ?
                            <Form.Item name="id" hidden required>
                                <Input/>
                            </Form.Item> : null
                        }
                        <Form.Item label="Mata Pelajaran" name="name" required
                                   rules={[
                                       {
                                           required: true,
                                       }
                                   ]}>
                            <Select options={listSubjectOptions} placeholder="Pilih Mata Pelajaran"/>
                        </Form.Item>
                        <Form.Item label="Jadwal" name="schedule">
                            <DatePicker
                                showTime
                                format={scheduleFormat}
                                placeholder="Pilih jadwal"
                                style={{width: '100%'}}
                            />
                        </Form.Item>
                        <Form.Item label="Pengajar" name="teacher">
                            <Select placeholder="Pilih Pengajar" showSearch
                                    filterOption={(input, option) =>
                                        option.children.includes(input)
                                    }>
                                {getListTeacherOptions()}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                        <Form.Item label="Pertemuan ke" name="number" rules={[
                            {type: "number", min: 1, message: "Nilai harus lebih besar dari 0"}
                        ]}>
                            <InputNumber style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item label="Durasi" name="duration">
                            <Select placeholder="Pilih durasi" options={listDurationOptions}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MeetingFormModal;