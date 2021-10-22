import {Space} from "antd";
import {ButtonShowLecturers} from "./ButtonShowLecturers";
import {ButtonShowStudents} from "./ButtonShowStudents";

export const _columns = [
    {
        title: 'Kode',
        dataIndex: 'code',
        width: 60,
    },
    {
        title: 'Nama',
        dataIndex: 'name',
        width: 120,
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Departemen',
        dataIndex: ['department', 'name'],
        width: 120,
    },
    {
        title: 'Jenis',
        dataIndex: 'type',
        width: 60,
    },
    {
        title: 'SKS',
        dataIndex: 'sks',
        width: 60,
    },
    {
        title: 'Semester',
        dataIndex: 'semester',
        width: 60,
    },
    {
        title: 'Daya Tampung',
        dataIndex: 'quota',
        width: 60,
    },
    {
        title: 'Data',
        dataIndex: 'id',
        width: 120,
        render: (_, record) => {
            return (
                <Space direction="vertical">
                    <ButtonShowLecturers course={record} />
                    <ButtonShowStudents course={record} />
                </Space>
            )
        },
    }
]