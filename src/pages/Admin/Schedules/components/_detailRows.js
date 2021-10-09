import {DataType, DayOfWeek} from "../../../../utils/Constants";
import {RowID, RowTimeStamp} from "../../../../components";

export const _detailRows = [
    ...RowID,
    {
        title: 'Hari',
        dataIndex: 'day_of_week',
        type: DataType.CUSTOM,
        render: (value) => DayOfWeek[value]
    },
    {
        title: 'Jam Mulai',
        dataIndex: 'start_time',
        type: DataType.TIME
    },
    {
        title: 'Jam Selesai',
        dataIndex: 'end_time',
        type: DataType.TIME
    },
    ...RowTimeStamp
]