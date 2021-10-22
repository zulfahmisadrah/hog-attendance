import React, {useState} from "react";
import {Button, Tooltip} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {COLOR_ACCENT} from "../utils/colors";
import PropTypes from "prop-types";

ColumnActionEdit.propTypes = {
    title: PropTypes.string,
    formModal: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export function ColumnActionEdit(props) {
    const {title, formModal: FormModal, data, onSubmit} = props

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    return (
        <>
            <Tooltip placement="bottom" title="Edit">
                <Button size="small" icon={<EditOutlined/>} style={{borderColor: COLOR_ACCENT, color: COLOR_ACCENT}}
                        onClick={showModal}/>
            </Tooltip>
            {visible && (
                <FormModal
                    data={data}
                    title={title || "Edit Data"}
                    visible={visible}
                    onCancel={closeModal}
                    onSubmit={onSubmit}
                    onFinish={closeModal} />
            )}
        </>
    )
}