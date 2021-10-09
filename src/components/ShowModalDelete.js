import React from "react";
import {Modal} from "antd";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";

showModalDelete.propTypes = {
    data: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired
}

export function showModalDelete(data, onConfirm) {
    Modal.confirm({
        icon: <ExclamationCircleOutlined/>,
        title: 'Hapus data',
        content: 'Yakin ingin menghapus data ini?',
        cancelText: 'Batal',
        okText: 'Hapus',
        okType: "primary",
        okButtonProps: {danger: true},
        onOk: () => onConfirm(data.id)
    })
}