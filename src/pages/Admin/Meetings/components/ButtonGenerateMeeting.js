import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";
import {GenerateMeetingFormModal} from "./GenerateMeetingFormModal";

ButtonGenerateMeeting.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export function ButtonGenerateMeeting(props) {
    const {onSubmit, disabled} = props;

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    return (
        <>
            <Button type="primary" onClick={showModal} disabled={disabled}>Buat Pertemuan Selanjutnya</Button>
            {visible && (
                <GenerateMeetingFormModal
                    title="Buat Pertemuan Selanjutnya"
                    visible={visible}
                    onCancel={closeModal}
                    onSubmit={onSubmit}
                    onFinish={closeModal} />
            )}
        </>
    )
}