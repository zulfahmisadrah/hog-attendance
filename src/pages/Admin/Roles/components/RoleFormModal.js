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
    InputNumber
} from 'antd';
import {
    handleInputPhoneNumber,
    showErrorModal
} from "../../../../utils/Commons";
import {UploadOutlined} from "@ant-design/icons";
import {STORAGE_PREFIX_IMAGE} from "../../../../utils/Constants";
import {updateTeacher, uploadFileToStorage} from "../../../../services";
import {FacultyService, DepartmentService, StudentService} from "../../../../services/services";


export function RoleFormModal(props) {
    const {data, title, visible, onSubmit, onCancel} = props;

    const [fileList, setFileList] = useState([]);
    const [listFacultiesOptions, setListFacultiesOptions] = useState([]);
    const [listDepartmentOptions, setListDepartmentOptions] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();
    const facultyService = new FacultyService();
    const departmentService = new DepartmentService();
    const studentService = new StudentService();

    useEffect(() => {
        setInitialFieldsValue(data)
    }, [data]);

    useEffect(() => {
        facultyService.getListFacultiesOptions(setListFacultiesOptions)
        departmentService.getListDepartmentsOptions(undefined, setListDepartmentOptions)
    }, []);

    const setInitialFieldsValue = (data) => {
        if (data) {
            if (Object.keys(data).length !== 0) {
                let {user, ...student} = data
                const formData = {...user}
                formData.student = {...student}
                // delete formData.student.user

                // const fileList = [{url: formData.user.photo, thumbUrl: formData.user.photo, status: 'done'}]
                // setFileList(fileList)
                // formData.fileList = formData.user.photo ? fileList : []
                console.log("formData", formData)
                form.setFieldsValue(formData);
            }
        }
    }

    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            values.phone_number = values.phone_number ? handleInputPhoneNumber(values.phone_number) : values.phone_number
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
                                    updateStudent(values)
                                }
                            });
                        } else {
                            values.user.photo = null
                            updateStudent(values)
                        }
                    } else {
                        values.user.photo = data.user.photo;
                        updateStudent(values);
                    }
                } else {
                    uploadFileToStorage({
                        file: file,
                        fileNamePrefix: [STORAGE_PREFIX_IMAGE, values.name].join('_'),
                        onSuccess: (photoUrl) => {
                            values.user.photo = photoUrl
                            createStudent(values)
                        }
                    });
                }
            } else {
                createStudent(values)
            }
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    };

    const createStudent = (formData) => {
        studentService.createData({
            data: formData,
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

    const updateStudent = (formData) => {
        updateTeacher({
            data: formData,
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

    const onFacultyChange = (faculty_id) => {
        departmentService.getListDepartmentsOptions(faculty_id, setListDepartmentOptions)
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
                        <Form.Item label="Email" name="email"
                                   rules={[
                                       {
                                           type: 'email',
                                           message: 'Email invalid',
                                       }
                                   ]}
                        >
                            <Input placeholder="Email" disabled={data}/>
                        </Form.Item>
                        <Form.Item label="No. HP" name="phone_number">
                            <Input addonBefore="62" style={{width: '100%'}}/>
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                        <Form.Item label="Fakultas" name="faculty">
                            <Select options={listFacultiesOptions} placeholder="Pilih Fakultas" onChange={onFacultyChange}/>
                        </Form.Item>
                        <Form.Item label="Departemen" name={["student", "department_id"]} required rules={[{required: true}]}>
                            <Select options={listDepartmentOptions} placeholder="Pilih Departemen"/>
                        </Form.Item>
                        <Form.Item
                            label="Angkatan"
                            name={["student", "year"]}
                            rules={[
                                {required: true, type: "number", min: 0},
                            ]}
                        >
                            <InputNumber placeholder="ex. 2021"/>
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