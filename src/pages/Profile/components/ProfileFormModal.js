import React, {useState, useEffect} from 'react';
import {Modal, Form, Input, Row, Col, Select, Button, Upload} from 'antd';
import {STORAGE_PREFIX_IMAGE} from "../../../utils/Constants";
import {
    handleInputPhoneNumber,
    showErrorModal,
    listSubjectOptions,
    listEducationOptions,
    isObjectEqual
} from "../../../utils/Commons";
import {UploadOutlined} from "@ant-design/icons";
import {updateTeacher, updateUser, uploadFileToStorage} from "../../../services";

function ProfileFormModal(props) {
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
                    const photoModified = values.fileList[0]?.thumbUrl !== data.photo
                    const teacherDataModified = isObjectEqual(values.teacher, data.teacher)
                    if (!teacherDataModified) {
                        updateTeacherData(values.teacher)
                    }
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
                }
            }
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

    const updateUserFromValues = (values) => {
        console.log("values", values);
        updateUser({
            user: values,
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

    const updateTeacherData = (teacher) => {
        updateTeacher({
            teacher: teacher,
            onSuccess: () => {},
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
                    <Col xs={24} lg={11}>
                        {data ?
                            <Form.Item name="id" hidden required>
                                <Input/>
                            </Form.Item> : null
                        }
                        {data?.teacher ?
                            <Form.Item name={["teacher", "id"]} hidden required>
                                <Input/>
                            </Form.Item> : null
                        }
                        <Form.Item label="Email" name="email" hidden>
                            <Input placeholder="Email"/>
                        </Form.Item>
                        <Form.Item label="Nama" name="name" required
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Field ini harus terisi',
                                       },
                                   ]}>
                            <Input placeholder="Name"/>
                        </Form.Item>
                        <Form.Item label="No. HP" name="phoneNumber">
                            <Input addonBefore="62" style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item
                            name="fileList"
                            label="Foto"
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
                    <Col xs={24} lg={{span: 11, offset: 2}}>
                        <Form.Item label="Bidang" name={["teacher", "field"]} required
                                   rules={[
                                       {
                                           required: true,
                                           message: "Bidang tidak boleh kosong"
                                       }
                                   ]}>
                            <Select options={listSubjectOptions} placeholder="Bidang"/>
                        </Form.Item>
                        <Form.Item label="Pendidikan Terakhir" name={["teacher", "lastEducation"]} required
                                   rules={[
                                       {
                                           required: true,
                                           message: "Pendidikan Terakhir tidak boleh kosong"
                                       }
                                   ]}>
                            <Select options={listEducationOptions} placeholder="Pendidikan Terkahir"/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ProfileFormModal;