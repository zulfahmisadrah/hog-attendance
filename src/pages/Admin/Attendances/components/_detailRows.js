import {DataType} from "../../../../utils/Constants";
import {RowID, RowTimeStamp} from "../../../../components";

export const _detailRows = [
    ...RowID,
    {
        title: 'Nama',
        dataIndex: ['user', 'name'],
        type: DataType.TEXT
    },
    ...RowTimeStamp
]