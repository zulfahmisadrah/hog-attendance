import {Col, Row, Space, Typography} from "antd";
import {AttendanceBadge} from "./AttendanceBadge";
import {attendanceStatus} from "../utils/Constants";
import React from "react";

export function AttendanceBadgesLegend() {
    return (
        <>
            <Space direction="vertical">
                <Typography.Text strong>Status Kehadiran yang Diajukan Mahasiswa</Typography.Text>
                <Typography.Text>Keterangan:</Typography.Text>
            </Space>
            <Row gutter={[16, 8]}>
                <Col xs={12} lg={4}>
                    <AttendanceBadge data={attendanceStatus.sick} text={attendanceStatus.sick}/>
                </Col>
                <Col xs={12} lg={4}>
                    <AttendanceBadge data={attendanceStatus.attend} text={attendanceStatus.attend}/>
                </Col>
                <Col xs={12} lg={4}>
                    <AttendanceBadge data={attendanceStatus.permitted} text={attendanceStatus.permitted}/>
                </Col>
                <Col xs={12} lg={4}>
                    <AttendanceBadge data={attendanceStatus.absent} text={attendanceStatus.absent}/>
                </Col>
            </Row>
        </>
    )
}