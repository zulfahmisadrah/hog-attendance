import React from 'react';
import {Card, Space} from "antd";
import {MeetingTable} from "./components/MeetingTable";


export function Meetings() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Pertemuan">
                <MeetingTable />
            </Card>
        </Space>
    )
}