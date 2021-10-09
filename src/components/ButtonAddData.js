import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";

ButtonAddData.propTypes = {
    title: PropTypes.string,
    formModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export function ButtonAddData(props) {
    const {title, formModal: FormModal, onSubmit} = props;

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    return (
        <>
            <Button type="primary" onClick={showModal}>Tambah Data</Button>
            {visible && (
                <FormModal
                    title={title || "Tambah Data"}
                    visible={visible}
                    onCancel={closeModal}
                    onSubmit={onSubmit}
                    onFinish={closeModal} />
            )}
        </>
    )
}