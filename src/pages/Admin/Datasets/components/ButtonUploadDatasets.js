import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";
import {UploadImagesModal} from "./UploadImagesModal";

ButtonUploadDatasets.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export function ButtonUploadDatasets(props) {
    const {onSubmit} = props

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true)
    const closeModal = () => setVisible(false)

    return (
        <>
            <Button className="w-100" size="large" onClick={showModal}>
                Upload Foto
            </Button>
            {visible && (
                <UploadImagesModal
                    visible={visible}
                    onSubmit={onSubmit}
                    onCancel={closeModal}
                />
            )}
        </>
    )
}