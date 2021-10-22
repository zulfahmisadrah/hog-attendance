import {DataType} from "../../../../utils/Constants";
import {RowID, RowTimeStamp} from "../../../../components";

export const _detailRows = [
    ...RowID,
    {
        title: 'Nama',
        dataIndex: 'name',
        type: DataType.TEXT
    },
    {
        title: 'Kode',
        dataIndex: 'code',
        type: DataType.TEXT
    },
    {
        title: 'Nama Fakultas',
        dataIndex: ['faculty', 'name'],
        type: DataType.TEXT
    },
    {
        title: 'Kode Fakultas',
        dataIndex: ['faculty', 'code'],
        type: DataType.TEXT
    },
    {
        title: 'Singkatan',
        dataIndex: 'alias',
        type: DataType.TEXT
    },
    ...RowTimeStamp
]