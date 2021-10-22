import React from "react";
import {BASE_AVATAR_URL} from "../../../../utils/Constants";

export const _columns = [
    {
        title: 'NIDN',
        dataIndex: ['user', 'username'],
        width: 100
    },
    {
        title: 'Nama',
        dataIndex: ['user', 'name'],
        width: 100,
        sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Departemen',
        dataIndex: ['department', 'name'],
        width: 110,
    },
    {
        title: 'Pendidikan Terakhir',
        dataIndex: 'last_education',
        width: 110,
    },
    {
        title: 'Email',
        dataIndex: ['user', 'email'],
        width: 130,
    },
    {
        title: 'No. HP',
        dataIndex: ['user', 'phone_number'],
        width: 130,
    },
    {
        title: 'Foto',
        dataIndex: ['user', 'avatar'],
        width: 70,
        render: (value) => value && <img width={70} src={BASE_AVATAR_URL + value} alt="avatar"/>
    }
]