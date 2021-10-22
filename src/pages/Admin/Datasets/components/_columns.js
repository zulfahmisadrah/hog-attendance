import React from "react";
import {ButtonShowDatasets} from "./ButtonShowDatasets";

export const _columns = [
    {
        title: 'NIM',
        dataIndex: ['user', 'username'],
        width: 60,
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.user?.username?.localeCompare(b.user?.username),
    },
    {
        title: 'Nama',
        dataIndex: ['user', 'name'],
        width: 80,
    },
    {
        title: 'Total Data',
        dataIndex: 'total',
        width: 50,
        sorter: (a, b) => a.total - b.total,
    },
    // {
    //     title: 'Sampel',
    //     dataIndex: 'sample',
    //     width: 50,
    //     render: (value) => value && <img width={50} src={"data:image/jpeg;base64," + value} alt="sample" />
    // },
    {
        title: 'Action',
        dataIndex: ['user', 'username'],
        width: 60,
        render: (_, record) => <ButtonShowDatasets data={record}/>
    }
]