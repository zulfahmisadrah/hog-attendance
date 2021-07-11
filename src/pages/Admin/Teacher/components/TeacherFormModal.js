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
import {
    handleInputPhoneNumber,
    listEducationOptions,
    listSubjectOptions,
    showErrorModal
} from "../../../../utils/Commons";
import {UploadOutlined} from "@ant-design/icons";
import {STORAGE_PREFIX_IMAGE} from "../../../../utils/Constants";
import {createTeacher, updateTeacher, uploadFileToStorage} from "../../../../services";


function TeacherFormModal(props) {
    const {data, title, visible, onSubmit, onCancel} = props;

    const [fileList, setFileList] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        setInitialFieldsValue(data, form)
    }, [data, form]);

    const setInitialFieldsValue = (data, form) => {
        if (data) {
            if (Object.keys(data).length !== 0) {
                const formData = {...data}
                const fileList = [{url: formData.user.photo, thumbUrl: formData.user.photo, status: 'done'}]
                setFileList(fileList)
                formData.fileList = formData.user.photo ? fileList : []
                form.setFieldsValue(formData);
            }
        }
    }

    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            values.user.phoneNumber = values.user.phoneNumber ? handleInputPhoneNumber(values.user.phoneNumber) : values.user.phoneNumber
            if (values.fileList) {
                const file = values.fileList[0]?.originFileObj
                if (data) {
                    delete values['password']
                    const photoModified = values.fileList[0]?.thumbUrl !== data.user.photo
                    if (photoModified) {
                        if (file) {
                            uploadFileToStorage({
                                file: file,
                                fileNamePrefix: [STORAGE_PREFIX_IMAGE, data.name].join('_'),
                                onSuccess: (photoUrl) => {
                                    values.user.photo = photoUrl
                                    updateTeacherFromValues(values)
                                }
                            });
                        } else {
                            values.user.photo = null
                            updateTeacherFromValues(values)
                        }
                    } else {
                        values.user.photo = data.user.photo;
                        updateTeacherFromValues(values);
                    }
                } else {
                    uploadFileToStorage({
                        file: file,
                        fileNamePrefix: [STORAGE_PREFIX_IMAGE, values.name].join('_'),
                        onSuccess: (photoUrl) => {
                            values.user.photo = photoUrl
                            createTeacherFromValues(values)
                        }
                    });
                }
            } else {
                createTeacherFromValues(values)
            }
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

    const createTeacherFromValues = (values) => {
        createTeacher({
            teacher: values,
            onSuccess: (newData) => {
                onSubmit(newData)
                setConfirmLoading(false)
                form.resetFields();
            },
            onError: (error) => {
                showErrorModal(error)
                setConfirmLoading(false)
            },
        })
    }

    const updateTeacherFromValues = (values) => {
        updateTeacher({
            teacher: values,
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
                    const isModified = file.url !== data.user.photo;
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
                        <Form.Item label="Nama" name={["user", "name"]} required
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Name is required',
                                       },
                                   ]}>
                            <Input placeholder="Nama"/>
                        </Form.Item>
                        <Form.Item label="Email" name={["user", "email"]} style={{marginBottom: 0}} required
                                   rules={[
                                       {
                                           type: 'email',
                                           message: 'Email invalid',
                                       },
                                       {
                                           required: true,
                                           message: 'Field ini harus terisi',
                                       },
                                   ]}
                        >
                            <Input placeholder="Email" disabled={data}/>
                        </Form.Item>
                        <Form.Item name={["user", "emailVerified"]} valuePropName="checked" style={{marginBottom: 9}}>
                            <Checkbox>
                                Email verified
                            </Checkbox>
                        </Form.Item>
                        <Form.Item label="Password" name={["user", "password"]} required={!data}
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
                        <Form.Item label="Bidang" name="field" required
                                   rules={[
                                       {
                                           required: true,
                                       }
                                   ]}>
                            <Select options={listSubjectOptions} placeholder="Bidang"/>
                        </Form.Item>
                        <Form.Item label="Pendidikan Terakhir" name="lastEducation" required
                                   rules={[
                                       {
                                           required: true,
                                       }
                                   ]}>
                            <Select options={listEducationOptions} placeholder="Pendidikan Terkahir"/>
                        </Form.Item>
                        <Form.Item label="No. HP" name={["user", "phoneNumber"]}>
                            <Input addonBefore="62" style={{width: '100%'}}/>
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

export default TeacherFormModal;