import React, {useState, useEffect} from 'react';
import {Modal, Form, Input, Row, Col} from 'antd';


export function RoleFormModal(props) {
    const {data, title, visible, onSubmit, onCancel} = props;

    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        setInitialFieldsValue(data)
    }, [data]);


    const setInitialFieldsValue = (data) => {
    }

    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {

        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    }

    const handleCancel = () => {
        onCancel();
    }

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
                        <Form.Item
                            label="Nama"
                            name="name"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: 'Name is required',
                                }
                            ]}
                        >
                            <Input placeholder="Nama" />
                        </Form.Item>
                        <Form.Item label="Username" name="username" required rules={[{required: true}]}>
                            <Input placeholder="Username" disabled={data} />
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}