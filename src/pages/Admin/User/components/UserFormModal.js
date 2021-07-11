import React, {useState, useEffect} from 'react';
import {
    Modal,
    Form,
    Input,
    Row,
    Col,
    Select,
    Button,
    Upload,
    Checkbox
} from 'antd';
import {listRole, STORAGE_PREFIX_IMAGE} from "../../../../utils/Constants";
import {
    handleInputPhoneNumber,
    listEducationOptions,
    listSubjectOptions,
    showErrorModal
} from "../../../../utils/Commons";
import {UploadOutlined} from "@ant-design/icons";
import {createUser, updateUser, uploadFileToStorage} from "../../../../services";


function UserFormModal(props) {
    const {data, title, visible, onSubmit, onCancel} = props;

    const [fileList, setFileList] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [formItemVisible, setFormItemVisible] = useState({teacher: false, student: false});

    const [form] = Form.useForm();

    useEffect(() => {
        setInitialFieldsValue(data, form)
    }, [data, form]);

    const setInitialFieldsValue = (data, form) => {
        if (data) {
            if (Object.keys(data).length !== 0) {
                const formData = {...data}
                formData.role = formData.role.toString()
                const fileList = [{url: formData.photo, thumbUrl: formData.photo, status: 'done'}]
                setFileList(fileList)
                formData.fileList = formData.photo ? fileList : []
                form.setFieldsValue(formData);
            }
        }
    }

    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            values.phoneNumber = values.phoneNumber ? handleInputPhoneNumber(values.phoneNumber) : values.phoneNumber
            if (values.fileList) {
                const file = values.fileList[0]?.originFileObj
                if (data) {
                    delete values['password']
                    const photoModified = values.fileList[0]?.thumbUrl !== data.photo
                    if (photoModified) {
                        if (file) {
                            uploadFileToStorage({
                                file: file,
                                fileNamePrefix: [STORAGE_PREFIX_IMAGE, data.name].join('_'),
                                onSuccess: (photoUrl) => {
                                    values.photo = photoUrl
                                    updateUserFromValues(values)
                                }
                            });
                        } else {
                            values.photo = null
                            updateUserFromValues(values)
                        }
                    } else {
                        values.photo = data.photo;
                        updateUserFromValues(values);
                    }
                } else {
                    uploadFileToStorage({
                        file: file,
                        fileNamePrefix: [STORAGE_PREFIX_IMAGE, values.name].join('_'),
                        onSuccess: (photoUrl) => {
                            values.photo = photoUrl
                            createUserFromValues(values)
                        }
                    });
                }
            } else {
                createUserFromValues(values)
            }
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

    const createUserFromValues = (values) => {
        let user = values
        if (values.role === "3") {
            const {field, lastEducation, ...userData} = values
            user = {
                field,
                lastEducation,
                user: userData
            }
        }
        createUser({
            user: user,
            role: values.role,
            onSuccess: () => {
                onSubmit(values)
                setConfirmLoading(false)
                form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error)
                setConfirmLoading(false)
            },
        })
    }

    const updateUserFromValues = (values) => {
        updateUser({
            user: values,
            onSuccess: () => {
                onSubmit(values)
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

    const roleOptions = Object.keys(listRole).map(key => ({
            label: listRole[key],
            value: key
        })
    )

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
                    const isModified = file.url !== data.photo;
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

    const onFormValuesChange = (changedValues) => {
        const name = changedValues
        if (name.role) {
            const visibility = {teacher: false, student: false};
            switch (name.role) {
                case "3":
                    visibility.teacher = true
                    break;
                case "4":
                    visibility.student = false
                    break;
                default:
                    break;
            }
            setFormItemVisible(prevState => ({...prevState, ...visibility}))
        }
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
                onValuesChange={onFormValuesChange}
            >
                <Row>
                    <Col span={11}>
                        {data ?
                            <Form.Item name="id" hidden required>
                                <Input/>
                            </Form.Item> : null
                        }
                        <Form.Item label="Name" name="name" required
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Name is required',
                                       },
                                   ]}>
                            <Input placeholder="Name"/>
                        </Form.Item>
                        <Form.Item label="Email" name="email" style={{marginBottom: 0}} required
                                   rules={[
                                       {
                                           type: 'email',
                                           message: 'Email is invalid',
                                       },
                                       {
                                           required: true,
                                           message: 'Email is required',
                                       },
                                   ]}
                        >
                            <Input placeholder="Email" disabled={data}/>
                        </Form.Item>
                        <Form.Item name="emailVerified" valuePropName="checked" style={{marginBottom: 9}}>
                            <Checkbox>
                                Email verified
                            </Checkbox>
                        </Form.Item>
                        <Form.Item label="Password" name="password" required={!data}
                                   rules={[
                                       {
                                           min: 6,
                                           message: 'Password should at least 6 characters',
                                       },
                                       {
                                           required: !data,
                                           message: 'Password is required',
                                       },
                                   ]}
                        >
                            <Input placeholder="Password" disabled={data}/>
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                        <Form.Item label="Role" name="role" required
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Role is required',
                                       }
                                   ]}>
                            <Select
                                placeholder="User Role"
                                options={roleOptions}
                                disabled={data}
                            />
                        </Form.Item>
                        <Form.Item label="Phone number" name="phoneNumber">
                            <Input addonBefore="62" style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item label="Field" name="field" hidden={!formItemVisible.teacher} required={formItemVisible.teacher}
                                   rules={[
                                       {
                                           required: formItemVisible.teacher,
                                           message: 'Field is required',
                                       }
                                   ]}>
                            <Select options={listSubjectOptions} placeholder="Field"/>
                        </Form.Item>
                        <Form.Item label="Last Education" name="lastEducation" hidden={!formItemVisible.teacher}
                                   required={formItemVisible.teacher}
                                   rules={[
                                       {
                                           required: formItemVisible.teacher,
                                           message: 'Last Education is required',
                                       }
                                   ]}>
                            <Select options={listEducationOptions} placeholder="Last Education"/>
                        </Form.Item>
                        <Form.Item
                            name="fileList"
                            label="Photo"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            extra="Max. 2 MB"
                            rules={[
                                {
                                    validator: imageValidator
                                },
                            ]}
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
            </Form>
        </Modal>
    )
}

export default UserFormModal;