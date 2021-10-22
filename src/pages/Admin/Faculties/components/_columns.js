export const _columns = [
    {
        title: 'Kode',
        dataIndex: 'code',
        width: 60,
        sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
        title: 'Nama',
        dataIndex: 'name',
        width: 130,
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Singkatan',
        dataIndex: 'alias',
        width: 60,
    }
]