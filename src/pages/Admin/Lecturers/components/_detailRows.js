import {DataType} from "../../../../utils/Constants";
import {RowID, RowTimeStamp} from "../../../../components";

export const _detailRows = [
    ...RowID,
    {
        title: 'Nama',
        dataIndex: ['user', 'name'],
        type: DataType.TEXT
    },
    {
        title: 'NIDN',
        dataIndex: ['user', 'username'],
        type: DataType.TEXT
    },
    {
        title: 'NIP',
        dataIndex: 'nip',
        type: DataType.TEXT
    },
    {
        title: 'Departemen',
        dataIndex: ['department', 'name'],
        type: DataType.TEXT
    },
    {
        title: 'Pendidikan Terakhir',
        dataIndex: 'last_education',
        type: DataType.TEXT
    },
    {
        title: 'Email',
        dataIndex: ['user', 'email'],
        type: DataType.TEXT
    },
    {
        title: 'No. HP',
        dataIndex: ['user', 'phone_number'],
        type: DataType.TEXT
    },
    ...RowTimeStamp,
    {
        title: 'Foto',
        dataIndex: ['user', 'avatar'],
        type: DataType.IMAGE
    }
]