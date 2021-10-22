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
        title: 'Tahun Ajaran',
        dataIndex: 'academic_year',
        type: DataType.TEXT
    },
    {
        title: 'Tahun',
        dataIndex: 'year',
        type: DataType.TEXT
    },
    {
        title: 'Jenis',
        dataIndex: 'type',
        type: DataType.TEXT
    },
    {
        title: 'Status',
        dataIndex: 'is_active',
        type: DataType.CUSTOM,
        render: (value) => value ? "Aktif" : "Tidak Aktif"
    },
    ...RowTimeStamp
]