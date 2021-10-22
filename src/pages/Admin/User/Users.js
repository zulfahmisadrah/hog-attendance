import React from 'react';
import {Card, Space,} from "antd";
import {UserTable} from "./components";

export function Users() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="List User">
                <UserTable/>
            </Card>
        </Space>
    )
}