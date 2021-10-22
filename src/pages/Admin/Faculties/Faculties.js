import React from 'react';
import {Card, Space} from "antd";
import {FacultyTable} from "./components";


export function Faculties() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Fakultas">
                <FacultyTable />
            </Card>
        </Space>
    )
}