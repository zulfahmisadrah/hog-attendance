import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";
import {UploadImagesModal} from "./UploadImagesModal";

ButtonUploadDatasets.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export function ButtonUploadDatasets(props) {
    const {onShowModal, onSubmit, children, ...rest} = props

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true)
    const closeModal = () => setVisible(false)

    const handleClick = () => {
        onShowModal(showModal);
    }

    return (
        <>
            <Button onClick={handleClick} {...rest}>{children}</Button>
            {visible && (
                <UploadImagesModal
                    visible={visible}
                    onSubmit={onSubmit}
                    onCancel={closeModal}
                    maxSize={3}
                />
            )}
        </>
    )
}