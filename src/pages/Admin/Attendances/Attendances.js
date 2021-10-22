import React from 'react';
import {Card, Space} from "antd";
import {AttendanceTable} from "./components";


export function Attendances() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Kehadiran">
                <AttendanceTable />
            </Card>
        </Space>
    )
}