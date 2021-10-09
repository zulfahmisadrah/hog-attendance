import React from "react";
import {Space} from "antd";
import {ColumnActionDetails} from "./ColumnActionDetails";
import {ColumnActionEdit} from "./ColumnActionEdit";
import {ColumnActionDelete} from "./ColumnActionDelete";


export const ColumnActions = ({detailRows, formModal, onUpdateFinished, onConfirmDelete}) => ({
    key: 'action',
    title: 'Action',
    isDummyField: true,
    width: 80,
    fixed: 'right',
    align: 'center',
    render: (_, record) => (
        <Space wrap>
            <ColumnActionDetails data={record} detailRows={detailRows} />
            <ColumnActionEdit formModal={formModal} data={record} onFinish={onUpdateFinished} />
            <ColumnActionDelete data={record} onConfirm={onConfirmDelete} />
        </Space>
    )
})