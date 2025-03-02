import React, {useState} from 'react';
import {Modal, Form, Input,} from 'antd';
import {showErrorModal,} from "../../../utils/Commons";
import {UserService} from "../../../services/services/UserService";

function ChangePasswordModal(props) {
    const {title, visible, onSubmit, onCancel} = props;

    const [form] = Form.useForm();

    const [confirmLoading, setConfirmLoading] = useState(false);
    const userService = new UserService();

    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            const data = {
                current_password: values.current_password,
                new_password: values.new_password
            }
            userService.updateMyPassword({
                data: data,
                onSuccess: (updatedData) => {
                    console.log(updatedData)
                    onSubmit(updatedData)
                    setConfirmLoading(false)
                    form.resetFields();
                },
                onError: (error) => {
                    showErrorModal(error)
                    setConfirmLoading(false)
                }
            })
            // authLogin({username: username, password: values.currentPassword}).then(res => {
            //     updateUserPassword({
            //         payload: values,
            //         onSuccess: () => {
            //             onSubmit(values)
            //             setConfirmLoading(false)
            //             form.resetFields();
            //         },
            //         onError: (error) => {
            //             showErrorModal(error)
            //             setConfirmLoading(false)
            //         }
            //     })
            // }).catch(e => {
            //     if (e.response.status === 401) showErrorModal("Password tidak sesuai")
            //     else {
            //         console.log(e)
            //     }
            //     setConfirmLoading(false);
            // })
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

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
            width={340}
            bodyStyle={{height: '300px', overflowY: 'auto'}}
        >
            <Form
                layout='vertical'
                form={form}
            >
                <Form.Item
                    name="current_password"
                    label="Password saat ini"
                    rules={[
                        {
                            required: true,
                            message: 'Masukkan password Anda',
                        },
                    ]}
                >
                    <Input.Password className="input" placeholder="Current Password"/>
                </Form.Item>
                <Form.Item
                    name="new_password"
                    label="Password baru"
                    rules={[
                        {
                            min: 6,
                            message: 'Password minimal 6 karakter',
                        },
                        {
                            required: true,
                            message: 'Masukkan password baru Anda',
                        },
                    ]}
                >
                    <Input.Password className="input" placeholder="New Password"/>
                </Form.Item>
                <Form.Item
                    name="confirm_password"
                    label="Konfirmasi Password baru"
                    dependencies={['new_password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Konfirmasi password baru Anda',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Password tidak sesuai')
                            }
                        })
                    ]}
                >
                    <Input.Password className="input" placeholder="Confirm New Password"/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ChangePasswordModal;
