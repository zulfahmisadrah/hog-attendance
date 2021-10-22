import {BASE_AVATAR_URL} from "../../../../utils/Constants";
import React from "react";

export const _columns = [
    {
        title: 'NIM',
        dataIndex: ['user', 'username'],
        width: 100,
    },
    {
        title: 'Nama',
        dataIndex: ['user', 'name'],
        width: 130,
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Departemen',
        dataIndex: ['department', 'name'],
        width: 100,
    },
    {
        title: 'Angkatan',
        dataIndex: 'year',
        width: 100,
    },
    {
        title: 'Email',
        dataIndex: ['user', 'email'],
        width: 100,
    },
    {
        title: 'Foto',
        dataIndex: ['user', 'avatar'],
        width: 70,
        render: (value) => value && <img width={70} src={BASE_AVATAR_URL + value} alt="avatar"/>
    }
]