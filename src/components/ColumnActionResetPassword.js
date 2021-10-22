import React from "react";
import {Button, Modal, Tooltip} from "antd";
import {ExclamationCircleOutlined, UnlockOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";

ColumnActionResetPassword.propTypes = {
    data: PropTypes.object.isRequired,
}

export function ColumnActionResetPassword(props) {
    const {data} = props

    const resetPassword = (data) => {
        console.log(data)
    }

    return (
        <Tooltip placement="left" title="Reset Password">
            <Button size="small" icon={<UnlockOutlined/>} onClick={() => {
                Modal.confirm({
                    icon: <ExclamationCircleOutlined/>,
                    title: 'Reset Password',
                    content: 'Yakin ingin melakukan reset password? Password baru akan terkirim ke email pengguna',
                    okText: 'Reset',
                    okType: "primary",
                    okButtonProps: {danger: true},
                    onOk: () => resetPassword(data)
                })
            }}/>
        </Tooltip>
    )
}