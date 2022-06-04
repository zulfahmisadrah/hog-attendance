import {formatDateTime, sortStringDateTime} from "../../../../utils/Commons";
import {dateFormat, dateTextFormat, timeFormat, timeTextFormat} from "../../../../utils/Constants";

export const _columns = [
    {
        title: 'Mata Kuliah',
        dataIndex: ['course', 'name'],
        width: 130,
        sorter: (a, b) => a.course?.name.localeCompare(b.course?.name)
    },
    {
        title: 'Pertemuan Ke-',
        dataIndex: 'number',
        width: 80,
        sorter: (a, b) => a.number - b.number
    },
    {
        title: 'Nama',
        dataIndex: 'name',
        width: 130,
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Tanggal',
        dataIndex: 'date',
        width: 100,
        sorter: (a, b) => sortStringDateTime(a.date, b.date),
        render: (value) => value ? formatDateTime(value, dateTextFormat, dateFormat) : ''
    },
    {
        title: 'Jam',
        width: 80,
        render: (_, record) => {
            const strStartTime = formatDateTime(record.start_time || record.schedule?.start_time, timeTextFormat, timeFormat)
            const strEndTime = formatDateTime(record.end_time || record.schedule?.end_time, timeTextFormat, timeFormat)
            return `${strStartTime} - ${strEndTime}`
        }
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: 80,
    }
]