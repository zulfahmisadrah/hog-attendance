import React from "react";
import {Space} from "antd";
import {ColumnActionDetails} from "./ColumnActionDetails";
import {ColumnActionEdit} from "./ColumnActionEdit";
import {ColumnActionDelete} from "./ColumnActionDelete";
import {ColumnActionResetPassword} from "./ColumnActionResetPassword";


export const ColumnActionsWithResetPassword = ({detailRows, formModal, onUpdate, onConfirmDelete}) => ({
    key: 'action',
    title: 'Action',
    isDummyField: true,
    width: 60,
    fixed: 'right',
    align: 'center',
    render: (_, record) => (
        <Space wrap>
            <ColumnActionDetails data={record} detailRows={detailRows} />
            <ColumnActionEdit formModal={formModal} data={record} onSubmit={onUpdate} />
            <ColumnActionDelete data={record} onConfirm={onConfirmDelete} />
            <ColumnActionResetPassword data={record} />
        </Space>
    )
})