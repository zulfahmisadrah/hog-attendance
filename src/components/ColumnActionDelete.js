import React from "react";
import {Button, Tooltip} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {showModalDelete} from "./ShowModalDelete";

ColumnActionDelete.propTypes = {
    data: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired
}

export function ColumnActionDelete(props) {
    const {data, onConfirm} = props

    return (
        <Tooltip placement="bottom" title="Delete">
            <Button size="small" icon={<DeleteOutlined/>} danger onClick={() => showModalDelete(data, onConfirm)}/>
        </Tooltip>
    )
}