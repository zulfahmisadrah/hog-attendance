import {DataType, DayOfWeek} from "../../../../utils/Constants";
import {RowID, RowTimeStamp} from "../../../../components";

export const _detailRows = [
    ...RowID,
    {
        title: 'Nama',
        dataIndex: 'name',
        type: DataType.TEXT
    },
    {
        title: 'Nomor Pertemuan',
        dataIndex: 'number',
        type: DataType.TEXT
    },
    {
        title: 'Status',
        dataIndex: 'status',
        type: DataType.TEXT
    },
    {
        title: 'Mata Kuliah',
        dataIndex: ['course', 'name'],
        type: DataType.TEXT
    },
    {
        title: 'Kode Mata Kuliah',
        dataIndex: ['course', 'code'],
        type: DataType.TEXT
    },
    {
        title: 'Tanggal',
        dataIndex: 'date',
        type: DataType.DATE
    },
    {
        title: 'Jam Mulai',
        dataIndex: ['schedule', 'start_time'],
        type: DataType.TIME
    },
    {
        title: 'Jam Selesai',
        dataIndex: ['schedule', 'end_time'],
        type: DataType.TIME
    },
    {
        title: 'Jam Mulai (Custom)',
        dataIndex:'start_time',
        type: DataType.TIME
    },
    {
        title: 'Jam Selesai (Custom)',
        dataIndex: 'end_time',
        type: DataType.TIME
    },
    ...RowTimeStamp
]