import React, {useEffect, useState} from "react";
import {Form, Input, Modal} from "antd";
import PropTypes from "prop-types";
import {showErrorModal} from "../utils/Commons";

FormModal.propTypes = {
    form: PropTypes.object,
    data: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
}

export function FormModal(props) {
    const {data, onInitFormData, onSubmit, onFinish, children, ...modalProps} = props;

    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const setInitialFieldsValue = (data) => {
        const formData = {...data};
        onInitFormData(formData);
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
            onSubmit(values, onSuccess, onError);
        }).catch((info) => {
            console.log('Validate Failed:', info);
            setConfirmLoading(false);
        });
    }

    return (
        <Modal
            {...modalProps}
            onOk={handleSubmit}
            confirmLoading={confirmLoading}
            okText="Simpan"
            cancelText="Batal"
            width={640}
            bodyStyle={{height: '500px', overflowY: 'auto'}}
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