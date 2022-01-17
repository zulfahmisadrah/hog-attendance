import {DataType} from "../../../../utils/Constants";
import {RowID, RowTimeStamp} from "../../../../components";

export const _detailRows = [
    ...RowID,
    {
        title: 'NIM',
        dataIndex: ['student', 'user', 'username'],
        type: DataType.TEXT
    },
    {
        title: 'Nama',
        dataIndex: ['student', 'user', 'name'],
        type: DataType.TEXT
    },
    {
        title: 'Nama Pertemuan',
        dataIndex: ['meeting', 'name'],
        type: DataType.TEXT
    },
    {
        title: 'Mata Kuliah',
        dataIndex: ['meeting', 'course', 'name'],
        type: DataType.TEXT
    },
    {
        title: 'Pertemuan Ke',
        dataIndex: ['meeting', 'number'],
        type: DataType.TEXT
    },
    {
        title: 'Status',
        dataIndex: 'status',
        type: DataType.TEXT,
    },
    {
        title: 'Status Validasi',
        dataIndex: 'status_validate',
        type: DataType.TEXT
    },
    {
        title: 'Status Diajukan',
        dataIndex: 'status_by_student',
        type: DataType.TEXT
    },
    ...RowTimeStamp
]