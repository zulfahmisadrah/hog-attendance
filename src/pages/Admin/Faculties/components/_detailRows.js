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
        title: 'Singkatan',
        dataIndex: 'alias',
        type: DataType.TEXT
    },
    ...RowTimeStamp
]