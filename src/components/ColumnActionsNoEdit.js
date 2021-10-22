import React from "react";
import {Space} from "antd";
import {ColumnActionDetails} from "./ColumnActionDetails";
import {ColumnActionDelete} from "./ColumnActionDelete";


export const ColumnActionsNoEdit = ({detailRows, onConfirmDelete}) => ({
    key: 'action',
    title: 'Action',
    isDummyField: true,
    width: 80,
    fixed: 'right',
    align: 'center',
    render: (_, record) => (
        <Space wrap>
            <ColumnActionDetails data={record} detailRows={detailRows} />
            <ColumnActionDelete data={record} onConfirm={onConfirmDelete} />
        </Space>
    )
})