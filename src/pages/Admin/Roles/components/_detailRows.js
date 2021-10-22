import {DataType} from "../../../../utils/Constants";
import {RowID, RowTimeStamp} from "../../../../components";

export const _detailRows = [
    ...RowID,
    {
        title: 'Kode',
        dataIndex: 'code',
        type: DataType.TEXT
    },
    {
        title: 'Nama',
        dataIndex: 'name',
        type: DataType.TEXT
    },
    {
        title: 'Deskripsi',
        dataIndex: 'description',
        type: DataType.TEXT
    },
    ...RowTimeStamp
]