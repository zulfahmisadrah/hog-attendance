import React, {useState, useEffect} from 'react';
import {Modal, Form, Input, Row, Col, Select, Button, Upload, InputNumber} from 'antd';
import {BASE_AVATAR_URL} from "../../../utils/Constants";
import {
    handleInputPhoneNumber,
    showErrorModal,
    listEducationOptions,
} from "../../../utils/Commons";
import {UploadOutlined} from "@ant-design/icons";
import {UserService} from "../../../services/services/UserService";
import {useSelector} from "react-redux";
import {FormModal} from "../../../components";

function ProfileFormModal(props) {
    const {title, visible, onCancel, data, onSubmit, onFinish} = props;

    const role = useSelector(state => state.auth.user.role);

    const [fileList, setFileList] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const userService = new UserService();

    const handleInitFormData = (formData) => {
        if (formData.avatar) {
            const avatarUrl = BASE_AVATAR_URL + formData.avatar;
            const fileList = [{url: avatarUrl, thumbUrl: avatarUrl, status: 'done'}];
            setFileList(fileList);
            formData.fileList = fileList;
        } else {
            formData.fileList = [];
        }
        const avatarUrl = BASE_AVATAR_URL + formData.avatar;
        const fileList = [{url: avatarUrl, thumbUrl: avatarUrl, status: 'done'}];
        setFileList(fileList);
        formData.fileList = avatarUrl ? fileList : [];
        return formData;
    }

    const handleOk = (values) => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            values.phone_number = values.phone_number ? handleInputPhoneNumber(values.phone_number) : values.phone_number;
            if (values.fileList) {
                const file = values.fileList[0]?.originFileObj;
                const avatarFormData = new FormData();
                avatarFormData.append('username', values.username);
                avatarFormData.append('avatar', file);
                if (data) {
                    const avatarUrl = BASE_AVATAR_URL + origin.avatar;
                    const avatarModified = values.fileList[0]?.thumbUrl !== avatarUrl;
                    delete values.fileList;
                    if (avatarModified) {
                        if (file) {
                            userService.uploadUserAvatar({
                                data: avatarFormData,
                                onSuccess: (filePath) => {
                                    values.avatar = filePath;
                                    updateUser(values);
                                }
                            });
                        } else {
                            values.avatar = null;
                            updateUser(values);
                        }
                    }
                }
            }
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    }

    const updateUser = (values) => {
        userService.updateMyData({
            data: values,
            onSuccess: (updatedData) => {
                onSubmit(updatedData)
                setConfirmLoading(false)
                form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error)
                setConfirmLoading(false)
            },
        })
    }

    const handleCancel = () => {
        setFileList([])
        onCancel();
    }

    const normFile = (e) => {
        console.log('Upload event:', e);
        return e && e.fileList;
    };

    const onRemove = (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(prevState => ([...prevState, newFileList]))
    }

    const imageValidator = (_, value) => {
        if (value) {
            const file = value[0]
            if (file) {
                let message = "";

                if (data) {
                    const isModified = file.url !== data.avatar;
                    if (!isModified) {
                        return Promise.resolve()
                    }
                }

                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    message = 'You can only upload JPG/PNG file!'
                }

                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    message = 'Image size must be smaller than 2MB!'
                }

                return isJpgOrPng && isLt2M ? Promise.resolve() : Promise.reject(message)
            }
        }
        return Promise.resolve()
    }

    const beforeUpload = () => {
        return false;
    }

    return (
        <FormModal
            title={title}
            visible={visible}
            onCancel={handleCancel}
            data={data}
            onInitFormData={handleInitFormData}
            onSubmit={onSubmit}
            onFinish={onFinish}
        >
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    {data?.teacher ?
                        <Form.Item name={["teacher", "id"]} hidden required>
                            <Input/>
                        </Form.Item> : null
                    }
                    {data?.student ?
                        <Form.Item name={["student", "id"]} hidden required>
                            <Input/>
                        </Form.Item> : null
                    }
                    <Form.Item label="Nama" name="name" required
                               rules={[
                                   {
                                       required: true,
                                       message: 'Field ini harus terisi',
                                   },
                               ]}>
                        <Input placeholder="Name"/>
                    </Form.Item>
                    <Form.Item label="Email" name="email"
                               rules={[
                                   {
                                       type: 'email',
                                       message: 'Email tidak valid',
                                   }
                               ]}
                    >
                        <Input placeholder="Email"/>
                    </Form.Item>
                    <Form.Item label="No. HP" name="phone_number">
                        <Input placeholder="ex.6281234567890" style={{width: '100%'}}/>
                    </Form.Item>
                </Col>
                <Col xs={24} lg={{span: 11, offset: 2}}>
                    {role === 3 ? (
                        <>
                            <Form.Item label="NIP" name={["lecturer", "nip"]}>
                                <Input placeholder="NIP"/>
                            </Form.Item>
                            <Form.Item label="Pendidikan Terakhir" name={["lecturer", "last_education"]}>
                                <Select options={listEducationOptions} placeholder="Pendidikan Terkahir"/>
                            </Form.Item>
                        </>
                    ) : (
                        <Form.Item
                            label="Angkatan"
                            name={["student", "year"]}
                            rules={[
                                {required: true, type: "number", min: 0},
                            ]}
                        >
                            <InputNumber placeholder="ex. 2021"/>
                        </Form.Item>
                    )}
                    <Form.Item
                        name="fileList"
                        label="Foto"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Max. 2 MB"
                        rules={[{validator: imageValidator}]}
                    >
                        <Upload
                            name="avatar"
                            className="avatar-uploader"
                            beforeUpload={beforeUpload}
                            onRemove={onRemove}
                            listType="picture"
                            maxCount={1}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
        </FormModal>
    )
}

export default ProfileFormModal;