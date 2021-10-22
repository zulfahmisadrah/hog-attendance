import React, {useEffect, useState} from "react";
import {Form, Input, Modal} from "antd";
import PropTypes from "prop-types";
import {showErrorModal} from "../utils/Commons";

FormModal.propTypes = {
    data: PropTypes.object,
    onInitFormData: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onFinish: PropTypes.func,
}

export function FormModal(props) {
    const {data, onInitFormData, onSubmit, onFinish, children, ...modalProps} = props;

    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const setInitialFieldsValue = (data) => {
        let formData = {...data};
        if (onInitFormData instanceof Function) formData = onInitFormData(formData);
        form.setFieldsValue(formData);
    }

    useEffect(() => {
        if (data) setInitialFieldsValue(data)
    }, [data]);

    const onSuccess = () => {
        setConfirmLoading(false);
        onFinish();
        form.resetFields();
    }

    const onError = (error) => {
        setConfirmLoading(false);
        showErrorModal(error);
    }

    const handleSubmit = () => {
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            onSubmit(values, onSuccess, onError, data);
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    }

    return (
        <Modal
            onOk={handleSubmit}
            confirmLoading={confirmLoading}
            okText="Simpan"
            cancelText="Batal"
            width={640}
            bodyStyle={{maxHeight: '500px', overflowY: 'auto'}}
            {...modalProps}
        >
            <Form
                layout='vertical'
                form={form}
            >
                {data && (
                    <Form.Item name="id" hidden>
                        <Input/>
                    </Form.Item>
                )}
                {children}
            </Form>
        </Modal>
    )
}