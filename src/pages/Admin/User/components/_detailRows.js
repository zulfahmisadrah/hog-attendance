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
        title: 'Username',
        dataIndex: 'username',
        type: DataType.TEXT
    },
    {
        title: 'Email',
        dataIndex: 'email',
        type: DataType.TEXT
    },
    {
        title: 'No. HP',
        dataIndex: 'phone_number',
        type: DataType.TEXT
    },
    ...RowTimeStamp,
    {
        title: 'Foto',
        dataIndex: 'avatar',
        type: DataType.IMAGE
    }
]