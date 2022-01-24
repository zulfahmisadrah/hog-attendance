import React from "react";
import {Space} from "antd";
import {ColumnActionDetails} from "./ColumnActionDetails";
import {ColumnActionEdit} from "./ColumnActionEdit";
import {ColumnActionDelete} from "./ColumnActionDelete";

const initialVisible = {
    details: true,
    edit: true,
    delete: true
}

export const ColumnActions = ({detailRows, formModal, onUpdate, onConfirmDelete, visible = initialVisible}) => {
    const isVisible = {...initialVisible, ...visible}
    return ({
        key: 'action',
        title: 'Action',
        isDummyField: true,
        width: 80,
        fixed: 'right',
        align: 'center',
        render: (_, record) => (
            <Space wrap>
                {isVisible.details && <ColumnActionDetails data={record} detailRows={detailRows}/>}
                {isVisible.edit && <ColumnActionEdit formModal={formModal} data={record} onSubmit={onUpdate}/>}
                {isVisible.delete && <ColumnActionDelete data={record} onConfirm={onConfirmDelete}/>}
            </Space>
        )
    })
}