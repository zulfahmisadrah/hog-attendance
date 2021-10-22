import React, {useState, useEffect} from 'react';
import {Form, Input, Row, Col, Select, Button, Upload} from 'antd';
import {listEducationOptions,} from "../../../../utils/Commons";
import {UploadOutlined} from "@ant-design/icons";
import {BASE_AVATAR_URL} from "../../../../utils/Constants";
import {DepartmentService, FacultyService} from "../../../../services/services";
import {FormModal} from "../../../../components";


export function LecturerFormModal(props) {
    const {title, visible, onCancel, data, onSubmit, onFinish} = props;

    const [fileList, setFileList] = useState([]);
    const [listFacultiesOptions, setListFacultiesOptions] = useState([]);
    const [listDepartmentOptions, setListDepartmentOptions] = useState([]);

    const facultyService = new FacultyService();
    const departmentService = new DepartmentService();

    useEffect(() => {
        facultyService.getListFacultiesOptions(setListFacultiesOptions);
        departmentService.getListDepartmentsOptions(undefined, setListDepartmentOptions);
    }, []);

    const handleInitFormData = (formData) => {
        let {user, ...lecturer} = formData;
        const newFormData = {...user};
        newFormData.lecturer = {...lecturer};
        newFormData.id = newFormData.lecturer?.id;
        newFormData.lecturer.department_id = newFormData.lecturer?.department?.id;
        newFormData.faculty = newFormData.lecturer?.department?.faculty?.id;
        if (newFormData.avatar) {
            const avatarUrl = BASE_AVATAR_URL + newFormData.avatar;
            const fileList = [{url: avatarUrl, thumbUrl: avatarUrl, status: 'done'}];
            setFileList(fileList);
            newFormData.fileList = fileList;
        } else {
            newFormData.fileList = [];
        }
        return newFormData;
    }

    const onFacultyChange = (faculty_id) => {
        departmentService.getListDepartmentsOptions(faculty_id, setListDepartmentOptions)
    }

    const handleCancel = () => {
        setFileList([]);
        onCancel();
    }

    const normFile = (e) => {
        console.log('Upload event:', e);
        return e && e.fileList;
    }

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
                    <Form.Item label="Nama" name="name" required rules={[{required: true}]}>
                        <Input placeholder="Nama"/>
                    </Form.Item>
                    <Form.Item label="Username" name="username" required rules={[{required: true}]}>
                        <Input placeholder="Username"/>
                    </Form.Item>
                    <Form.Item label="Password" name="password" required={!data}
                               rules={[
                                   {
                                       min: 6,
                                       message: 'Password minimal 6 karakter',
                                   },
                                   {
                                       required: !data,
                                   }
                               ]}
                    >
                        <Input.Password placeholder="Password"/>
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
                <Col span={12}>
                    <Form.Item label="Fakultas" name="faculty">
                        <Select options={listFacultiesOptions} placeholder="Pilih Fakultas" onChange={onFacultyChange}/>
                    </Form.Item>
                    <Form.Item label="Departemen" name={["lecturer", "department_id"]} required
                               rules={[{required: true}]}>
                        <Select options={listDepartmentOptions} placeholder="Pilih Departemen"/>
                    </Form.Item>
                    <Form.Item
                        label="Pendidikan Terakhir"
                        name={["lecturer", "last_education"]}
                    >
                        <Select options={listEducationOptions} placeholder="Pilih Pendidikan Terkahir"/>
                    </Form.Item>
                    <Form.Item
                        name="fileList"
                        label="Photo"
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
