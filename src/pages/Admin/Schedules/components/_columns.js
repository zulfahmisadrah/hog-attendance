import {DayOfWeek, timeFormat, timeTextFormat} from "../../../../utils/Constants";
import {formatDateTime} from "../../../../utils/Commons";

export const _columns = [
    {
        title: 'Hari',
        dataIndex: 'day_of_week',
        width: 120,
        sorter: (a, b) => a.day_of_week - b.day_of_week,
        render: (value) => DayOfWeek[value]
    },
    {
        title: 'Jam Mulai',
        dataIndex: 'start_time',
        width: 120,
        sorter: (a, b) => a.start_time.localeCompare(b.start_time),
        render: (value) => formatDateTime(value, timeTextFormat, timeFormat)
    },
    {
        title: 'Jam Selesai',
        dataIndex: 'end_time',
        width: 120,
        sorter: (a, b) => a.end_time.localeCompare(b.end_time),
        render: (value) => formatDateTime(value, timeTextFormat, timeFormat)
    }
]