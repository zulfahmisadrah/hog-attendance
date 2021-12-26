import React, {useState} from "react";
import {Button} from "antd";
import {AttendancesDrawer} from "../AttendancesDrawer";


export function ButtonShowDrawer(props) {
    const {children} = props

    const [visible, setVisible] = useState(false);

    const show = () => setVisible(true)
    const close = () => setVisible(false)

    return (
        <>
            <Button onClick={show}>{children}</Button>
            {visible && (
                <AttendancesDrawer
                    visible={visible}
                    onClose={close}
                />
            )}
        </>
    )
}