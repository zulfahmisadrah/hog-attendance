import {DataType} from "../utils/Constants";

export const RowTimeStamp = [
    {
        title: 'Tanggal dibuat',
        dataIndex: 'created_at',
        type: DataType.DATETIME
    },
    {
        title: 'Tanggal diperbarui',
        dataIndex: 'updated_at',
        type: DataType.DATETIME
    }
]