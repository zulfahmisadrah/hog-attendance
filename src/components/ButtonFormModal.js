import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";
import {EditOutlined} from "@ant-design/icons";

ButtonFormModal.propTypes = {
    title: PropTypes.string,
    formModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export function ButtonFormModal(props) {
    const {title, formModal: FormModal, data, onSubmit, children, ...buttonProps} = props;

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    return (
        <>
            <Button type="primary" onClick={showModal} {...buttonProps}>{children}</Button>
            {visible && (
                <FormModal
                    data={data}
                    title={title || "Tambah Data"}
                    visible={visible}
                    onCancel={closeModal}
                    onSubmit={onSubmit}
                    onFinish={closeModal} />
            )}
        </>
    )
}