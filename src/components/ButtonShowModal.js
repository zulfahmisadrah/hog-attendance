import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";

ButtonShowModal.propTypes = {
    modal: PropTypes.func.isRequired,
    data: PropTypes.object,
    buttonProps: PropTypes.object,
    modalProps: PropTypes.object
}

export function ButtonShowModal(props) {
    const {modal: Modal, data, onSubmit, buttonProps, modalProps, children} = props;

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    return (
        <>
            <Button onClick={showModal} {...buttonProps}>
                {children}
            </Button>
            {visible && (
                <Modal
                    data={data}
                    visible={visible}
                    onSubmit={onSubmit}
                    onCancel={closeModal}
                    {...modalProps}
                />
            )}
        </>
    )
}