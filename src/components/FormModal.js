import React from "react";
import {Form, Input, Modal} from "antd";
import PropTypes from "prop-types";

FormModal.propTypes = {
    form: PropTypes.object,
    data: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
}

export function FormModal(props) {
    const {form, data, onSubmit, children, ...modalProps} = props;

    return (
        <Modal
            {...modalProps}
            onOk={onSubmit}
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