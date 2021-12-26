import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";
import {EditScheduleModal} from "./EditScheduleModal";
import {EditOutlined} from "@ant-design/icons";

ButtonEditSchedule.propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export function ButtonEditSchedule(props) {
    const {data, onSubmit, children} = props

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true)
    const closeModal = () => setVisible(false)

    return (
        <>
            <Button onClick={showModal}><EditOutlined/>{children}</Button>
            {visible && (
                <EditScheduleModal
                    data={data}
                    visible={visible}
                    onSubmit={onSubmit}
                    onCancel={closeModal}
                    onFinish={closeModal}
                />
            )}
        </>
    )
}