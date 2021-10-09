import React from 'react';
import {Card, Space} from "antd";
import {ScheduleTable} from "./components";


export function Schedules() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Jadwal">
                <ScheduleTable />
            </Card>
        </Space>
    )
}