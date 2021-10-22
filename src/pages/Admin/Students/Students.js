import React from 'react';
import {Card, Space} from "antd";
import {StudentTable} from "./components";


export function Students() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Mahasiswa">
                <StudentTable />
            </Card>
        </Space>
    )
}