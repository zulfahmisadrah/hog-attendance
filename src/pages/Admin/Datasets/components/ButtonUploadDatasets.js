import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";
import {UploadImagesModal} from "./UploadImagesModal";

ButtonUploadDatasets.propTypes = {
    data: PropTypes.object.isRequired
}

export function ButtonUploadDatasets(props) {
    const {data} = props

    const [visible, setVisible] = useState(false);

    const showUploadModal = () => {
        showModal();
    }

    const showModal = () => setVisible(true)
    const closeModal = () => setVisible(false)

    return (
        <>
            <Button className="w-100" size="large" onClick={showUploadModal}>
                Upload Foto
            </Button>
            {visible && (
                <UploadImagesModal
                    data={data}
                    visible={visible}
                    onCancel={closeModal}
                />
            )}
        </>
    )
}