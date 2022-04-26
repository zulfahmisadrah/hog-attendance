import React, {useEffect, useState} from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Select,
    Button,
    Upload, InputNumber
} from 'antd';
import {BASE_AVATAR_URL, listRole} from "../../../../utils/Constants";
import {UploadOutlined} from "@ant-design/icons";
import {FormModal} from "../../../../components";
import {DepartmentService, FacultyService} from "../../../../services/services";
import {listEducationOptions} from "../../../../utils/Commons";


export function UserFormModal(props) {
    const {title, visible, onCancel, data, onSubmit, onFinish} = props;

    const [fileList, setFileList] = useState([]);
    const [formItemVisible, setFormItemVisible] = useState({lecturer: false, student: false});
    const [listFacultiesOptions, setListFacultiesOptions] = useState([]);
    const [listDepartmentOptions, setListDepartmentOptions] = useState([]);

    const facultyService = new FacultyService();
    const departmentService = new DepartmentService();

    useEffect(() => {
        facultyService.getListFacultiesOptions(setListFacultiesOptions);
        departmentService.getListDepartmentsOptions(undefined, setListDepartmentOptions);
    }, []);

    const handleInitFormData = (formData) => {
        const avatarUrl = BASE_AVATAR_URL + formData.avatar;
        const fileList = [{url: avatarUrl, thumbUrl: avatarUrl, status: 'done'}];
        setFileList(fileList);
        formData.fileList = avatarUrl ? fileList : [];
        return formData;
    }

    const onFacultyChange = (faculty_id) => {
        departmentService.getListDepartmentsOptions(faculty_id, setListDepartmentOptions);
    }

    const onRoleChange = (newValue) => {
        const visibility = {lecturer: false, student: false};
        switch (newValue) {
            case "3":
                visibility.lecturer = true;
                break;
            case "4":
                visibility.student = true;
                break;
            default:
                break;
        }
        setFormItemVisible(prevState => ({...prevState, ...visibility}));
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

                return (!file.size && !file.type) || (isJpgOrPng && isLt2M) ? Promise.resolve() : Promise.reject(message)
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
                    <Form.Item label="Name" name="name" required rules={[{required: true}]}>
                        <Input placeholder="Name"/>
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
                <Col xs={24} md={12}>
                    {
                        !data && (
                            <Form.Item label="Role" name="role" required rules={[{required: true}]}>
                                <Select
                                    placeholder="User Role"
                                    options={roleOptions}
                                    disabled={data}
                                    onChange={onRoleChange}
                                />
                            </Form.Item>
                        )
                    }
                    {formItemVisible.lecturer && (
                        <>
                            <Form.Item label="Fakultas" name="faculty">
                                <Select options={listFacultiesOptions} placeholder="Pilih Fakultas"
                                        onChange={onFacultyChange}/>
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
                        </>
                    )}
                    {formItemVisible.student && (
                        <>
                            <Form.Item label="Fakultas" name="faculty">
                                <Select options={listFacultiesOptions} placeholder="Pilih Fakultas"
                                        onChange={onFacultyChange}/>
                            </Form.Item>
                            <Form.Item label="Departemen" name={["student", "department_id"]} required
                                       rules={[{required: true}]}>
                                <Select options={listDepartmentOptions} placeholder="Pilih Departemen"/>
                            </Form.Item>
                            <Form.Item
                                label="Angkatan"
                                name={["student", "year"]}
                                rules={[{required: true, type: "number", min: 0}]}
                            >
                                <InputNumber/>
                            </Form.Item>
                        </>
                    )}
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
        </FormModal>
    )
}