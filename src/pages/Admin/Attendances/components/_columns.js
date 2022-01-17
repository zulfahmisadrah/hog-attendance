import {AttendanceTag} from "../../../../components";

export const _columns = [
    {
        title: 'NIM',
        dataIndex: ['student', 'user', 'username'],
        width: 130,
        sorter: (a, b) => a.student?.user?.username.localeCompare(b.student?.user?.username),
    },
    {
        title: 'Nama',
        dataIndex: ['student', 'user', 'name'],
        width: 130,
        sorter: (a, b) => a.student?.user?.name.localeCompare(b.student?.user?.name),
    },
    {
        title: 'Pertemuan',
        dataIndex: ['meeting', 'name'],
        width: 130,
        sorter: (a, b) => a.meeting?.name.localeCompare(b.meeting?.name),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: 60,
        render: (value) => <AttendanceTag data={value} />,
    },
    {
        title: 'Status Diajukan',
        dataIndex: 'status_by_student',
        width: 60,
        render: (value) => value && <AttendanceTag data={value} />,
    }
]