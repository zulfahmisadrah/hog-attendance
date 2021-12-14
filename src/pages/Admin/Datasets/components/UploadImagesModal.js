import React, {useState} from "react";
import {Form, Upload} from "antd";
import PropTypes from "prop-types";
import {FormModal} from "../../../../components";
import {InboxOutlined} from "@ant-design/icons";

UploadImagesModal.propTypes = {
    visible: PropTypes.bool,
    maxSize: PropTypes.number,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
}

export function UploadImagesModal(props) {
    const {visible, maxSize, onSubmit, onCancel} = props

    const [fileList, setFileList] = useState([]);

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
        setFileList(prevState => ([...prevState, newFileList]));
    }

    const imageValidator = (_, value) => {
        if (value) {
            const file = value[0];
            if (file) {
                let message = "";

                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    message = 'You can only upload JPG/PNG file!';
                }

                const isSizeValid = file.size / 1024 / 1024 < maxSize;
                if (!isSizeValid) {
                    message = `Image size must be smaller than ${maxSize} MB!`;
                }

                return isJpgOrPng && isSizeValid ? Promise.resolve() : Promise.reject(message);
            }
        }
        return Promise.resolve()
    }

    const beforeUpload = () => {
        return false;
    }

    return (
        <FormModal
            title="Upload Foto"
            visible={visible}
            okText="Submit"
            onCancel={handleCancel}
            onSubmit={onSubmit}
            onFinish={handleCancel}
            width={500}
        >
            <Form.Item
                name="fileList"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra={`Max. ${maxSize} MB`}
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