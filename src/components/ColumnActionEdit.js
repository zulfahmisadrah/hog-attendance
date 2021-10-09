import React, {useState} from "react";
import {Button, Tooltip} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {COLOR_ACCENT} from "../utils/colors";
import PropTypes from "prop-types";

ColumnActionEdit.propTypes = {
    formModal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    onFinish: PropTypes.func.isRequired
}

export function ColumnActionEdit(props) {
    const {formModal: FormModal, data, onFinish} = props

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const onUpdateFinished = () => {
        closeModal()
        onFinish()
    }

    return (
        <>
            <Tooltip placement="bottom" title="Edit">
                <Button size="small" icon={<EditOutlined/>} style={{borderColor: COLOR_ACCENT, color: COLOR_ACCENT}}
                        onClick={showModal}/>
            </Tooltip>
            {visible && (
                <FormModal
                    data={data}
                    title="Edit Data"
                    visible={visible}
                    onCancel={closeModal}
                    onFinish={onUpdateFinished} />
            )}
        </>
    )
}