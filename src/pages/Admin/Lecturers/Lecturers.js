import React from 'react';

import {Card, Space} from "antd";
import {LecturerTable} from "./components/LecturerTable";

export function Lecturers() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Pengajar">
                <LecturerTable />
            </Card>
        </Space>
    )
}