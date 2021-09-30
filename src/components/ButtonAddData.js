import React, {useState} from "react";
import {Button} from "antd";

export function ButtonAddData(props) {
    const {formModal: FormModal, onFinish} = props;

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const onCreateFinished = () => {
        closeModal()
        onFinish()
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>Tambah Data</Button>
            {visible && (
                <FormModal
                    title="Tambah Data"
                    visible={visible}
                    onCancel={closeModal}
                    onFinish={onCreateFinished} />
            )}
        </>
    )
}