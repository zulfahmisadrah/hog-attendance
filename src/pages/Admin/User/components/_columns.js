import React from "react";
import {BASE_AVATAR_URL} from "../../../../utils/Constants";

export const _columns = [
    {
        title: 'Username',
        dataIndex: 'username',
        width: 100
    },
    {
        title: 'Nama',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: 100,
    },
    {
        title: 'Role',
        dataIndex: 'roles',
        width: 110,
        render: (value) => value.map(role => role.name).join(', ')
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: 130
    },
    {
        title: 'No. HP',
        dataIndex: 'phone_number',
        width: 130,
    },
    {
        title: 'Foto',
        dataIndex: 'avatar',
        width: 70,
        render: (value) => value && <img width={70} src={BASE_AVATAR_URL + value} alt="avatar"/>
    }
]