import React from 'react';
import {Card, Space} from "antd";
import {RoleTable} from "./components";


export function Roles() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="List Role">
                <RoleTable />
            </Card>
        </Space>
    )
}