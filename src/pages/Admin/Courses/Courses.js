import React from 'react';
import {Card, Space} from "antd";
import {CoursesTable} from "./components";

export function Courses() {

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Mata Kuliah">
                <CoursesTable />
            </Card>
        </Space>
    )
}