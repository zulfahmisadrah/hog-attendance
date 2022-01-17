import React from 'react';
import {Card, Space} from "antd";
import {AttendanceExport, AttendanceTable} from "./components";


export function Attendances() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <AttendanceExport />
            <Card title="Daftar Kehadiran">
                <AttendanceTable />
            </Card>
        </Space>
    )
}