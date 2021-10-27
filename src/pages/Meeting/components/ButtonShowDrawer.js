import React, {useState} from "react";
import {Button} from "antd";
import {EditAttendances} from "../EditAttendances";


export function ButtonShowDrawer(props) {
    const {children} = props

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