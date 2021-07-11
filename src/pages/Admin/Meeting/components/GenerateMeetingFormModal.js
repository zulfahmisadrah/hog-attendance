import React, {useState} from 'react';
import {Modal, Form, Row, Col, InputNumber} from 'antd';
import {formatMomentToString, getDateTimeFromString, showErrorModal} from "../../../../utils/Commons";
import {createMeeting} from "../../../../services";

function GenerateMeetingFormModal(props) {
    const {data, title, visible, onSubmit, onCancel} = props;

    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            generateMeetingFromValues(values)
            setConfirmLoading(false);
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

    const generateMeetingFromValues = (values) => {
        const {quantity, interval} = values
        const incremental = values.incremental || 1
        data.forEach(meeting => {
            const {name, duration, teacher, number, schedule} = meeting
            for (let i = 1; i <= quantity; i++) {
                const newMeetingNumber = number + incremental * i
                const newMeetingSchedule = formatMomentToString(getDateTimeFromString(schedule).add(interval * i, "days"))
                const newMeeting = {
                    name: name,
                    duration: duration,
                    teacher: teacher.id,
                    number: newMeetingNumber,
                    schedule: newMeetingSchedule
                }
                createMeeting({
                    meeting: newMeeting,
                    onSuccess: () => {
                        if (i === quantity) {
                            onSubmit(values)
                            setConfirmLoading(false)
                            form.resetFields()
                        }
                    },
                    onError: (error) => {
                        showErrorModal(error)
                        setConfirmLoading(false)
                    },
                })
            }
        })
    }

    const handleCancel = () => {
        onCancel();
    }

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            okText="Buat"
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
                    <Col span={11} offset={2}>
                        <Form.Item label="Interval (hari)" name="interval" required
                                   help="ex. 7, untuk pertemuan sekali seminggu"
                                   rules={[
                                       {type: "number", min: 1, message: "Nilai harus lebih besar dari 0"}
                                   ]}>
                            <InputNumber style={{width: '100%'}}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default GenerateMeetingFormModal;