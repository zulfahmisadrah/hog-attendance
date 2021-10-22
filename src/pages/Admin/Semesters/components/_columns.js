export const _columns = [
    {
        title: 'Kode',
        dataIndex: 'code',
        width: 80,
        sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
        title: 'Tahun Ajaran',
        dataIndex: 'academic_year',
        width: 100,
        sorter: (a, b) => a.academic_year.localeCompare(b.academic_year),
    },
    {
        title: 'Tahun',
        dataIndex: 'year',
        width: 80,
        sorter: (a, b) => a.year.localeCompare(b.year),
    },
    {
        title: 'Jenis',
        dataIndex: 'type',
        width: 80,
    }
]