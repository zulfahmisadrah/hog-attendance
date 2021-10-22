import React from 'react';
import {Card, Space} from "antd";
import {DepartmentTable} from "./components";


export function Departments() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Departemen">
                <DepartmentTable />
            </Card>
        </Space>
    )
}