import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";

ButtonShowModal.propTypes = {
    modal: PropTypes.func.isRequired,
    modalProps: PropTypes.object
}

export function ButtonShowModal(props) {
    const {modal: Modal, modalProps, children, ...rest} = props;

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    return (
        <>
            <Button onClick={showModal} {...rest}>
                {children}
            </Button>
            {visible && (
                <Modal
                    visible={visible}
                    onCancel={closeModal}
                    {...modalProps}
                />
            )}
        </>
    )
}