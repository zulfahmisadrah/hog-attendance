import {formatDateTime, sortStringDateTime} from "../utils/Commons";

export const ColumnCreatedAt = {
    title: 'Tanggal dibuat',
    dataIndex: 'created_at',
    width: 90,
    defaultSortOrder: 'descend',
    sorter: (a, b) => sortStringDateTime(a.created_at, b.created_at),
    render: (value) => value ? formatDateTime(value) : ''
}