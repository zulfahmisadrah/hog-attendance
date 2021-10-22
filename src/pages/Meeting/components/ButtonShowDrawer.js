import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";
import {EditScheduleModal} from "./EditScheduleModal";
import {EditOutlined} from "@ant-design/icons";
import {EditAttendances} from "../EditAttendances";

// ButtonShowDrawer.propTypes = {
//     data: PropTypes.object.isRequired,
//     onSubmit: PropTypes.func.isRequired
// }

export function ButtonShowDrawer(props) {
    const {data, onSubmit, children} = props

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true)
    const closeModal = () => setVisible(false)

    return (
        <>
            <Button onClick={showModal}>{children}</Button>
            {visible && (
                <EditAttendances
                    visible={visible}
                    onClose={closeModal}
                />
            )}
        </>
    )
}