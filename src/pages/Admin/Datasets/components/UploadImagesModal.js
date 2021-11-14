import React, {useState} from "react";
import {Form, Upload} from "antd";
import PropTypes from "prop-types";
import {DatasetService} from "../../../../services/services";
import {showDataAddedNotification} from "../../../../utils/Commons";
import {FormModal} from "../../../../components";
import {InboxOutlined} from "@ant-design/icons";

UploadImagesModal.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
}

export function UploadImagesModal(props) {
    const {data, visible, onCancel} = props

    const [fileList, setFileList] = useState([]);

    const datasetService = new DatasetService();

    const handleCancel = () => {
        setFileList([]);
        onCancel();
    }

    const normFile = (e) => {
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

    const handleSubmit = (values, onSuccess) => {
        if (values.fileList) {
            values.fileList.forEach((file, index) => {
                const fileData = file.originFileObj;
                console.log(fileData)
                const formData = new FormData();
                formData.append('username', data);
                formData.append('file', fileData);
                datasetService.datasetCapture(formData, (file_path) => {
                    console.log(`response = `, file_path);
                    if (index === values.fileList.length-1) {
                        showDataAddedNotification();
                        onSuccess();
                    }
                })
            })
        }
    }

    return (
        <FormModal
            title="Upload Foto"
            visible={visible}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            onFinish={handleCancel}
            width={500}
        >
            <Form.Item
                name="fileList"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Max. 2 MB"
                rules={[{validator: imageValidator}]}
            >
                <Upload.Dragger
                    name="file"
                    multiple
                    className="file-uploader"
                    beforeUpload={beforeUpload}
                    onRemove={onRemove}
                    onPreview={() => {}}
                    listType="picture-card"
                    fileList={fileList}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Upload.Dragger>
            </Form.Item>
        </FormModal>
    );
}