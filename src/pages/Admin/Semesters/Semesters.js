import React from 'react';
import {Card, Space} from "antd";
import {SemesterTable} from "./components";


export function Semesters() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Semester">
                <SemesterTable />
            </Card>
        </Space>
    )
}