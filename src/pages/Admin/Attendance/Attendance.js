import React, {useEffect, useState} from 'react';

import {dateTimeISOFormat} from "../../../utils/Constants";
import {Button, Card, Col, Row, Space, Table, Tag, Modal, Tooltip, Typography, Collapse} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined, EyeOutlined} from "@ant-design/icons";
import {formatDateTime, showDataDeletedNotification, sortStringDateTime} from "../../../utils/Commons";
import {fetchAttendances, removeAttendance} from '../../../services';


function Attendance() {

    const {confirm, info} = Modal;

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState({fetch: false, filter: false, reload: false});

    const fetchData = () => {
        setIsLoading(prevState => ({...prevState, fetch: true}))
        fetchAttendances((data) => {
            setData(data)
            setIsLoading(prevState => ({...prevState, fetch: false}))
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    const deleteData = (id) => {
        removeAttendance(id, () => {
            showDataDeletedNotification()
            fetchData()
        })
    }

    const generateDetails = (record) => {
        const listTitle = {
            id: "id",
            name: "Nama",
            meeting: "Pertemuan",
            status: "Status",
            location: "Lokasi",
            notes: "Keterangan",
            checkInTime: "check in",
            checkOutTime: "check out",
            dateCreated: "Tanggal dibuat",
        }
        let details = [];
        Object.keys(listTitle).forEach(key => {
            let value = record[key]
            if (key === "name") value = record.meeting.teacher.user.name
            if (key === "meeting") value = record.meeting.name + " " + record.meeting.number
            details.push(
                <Row key={key}>
                    <Col span={6}>
                        <Typography.Text strong>{listTitle[key]}</Typography.Text>
                    </Col>
                    <Col span={18}>
                        <Typography.Text>: {value}</Typography.Text><br/>
                    </Col>
                </Row>
            )
        })
        return details
    }

    const columns = [
        {
            title: 'Check in',
            dataIndex: 'checkInTime',
            width: 90,
            defaultSortOrder: 'descend',
            sorter: (a, b) => a && b && sortStringDateTime(a.checkInTime, b.checkInTime),
            render: (text) => {
                if (!text) return ""
                const isISOFormat = text.includes('T')
                if (isISOFormat) return formatDateTime(text, undefined, dateTimeISOFormat)
                else return formatDateTime(text)
            }
        },
        {
            title: 'Nama',
            dataIndex: ['meeting', 'teacher', 'user', 'name'],
            width: 60,
        },
        {
            title: 'Pertemuan',
            dataIndex: ['meeting', 'name'],
            width: 60,
            render: (text, record) => text + " " + record.meeting.number
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 60,
            render: (text) => {
                let color
                switch (text) {
                    case "Hadir":
                        color = "green"
                        break;
                    case "Izin":
                        color = "blue"
                        break;
                    case "Sakit":
                        color = "orange"
                        break;
                    case "Tanpa Keterangan":
                        color = "red"
                        break;
                    default:
                        break;
                }
                return <Tag color={color}>{text}</Tag>
            }
        },
        {
            title: 'Lokasi',
            dataIndex: 'location',
            width: 100,
        },
        {
            title: 'Keterangan',
            dataIndex: 'notes',
            width: 100,
        },
        {
            title: 'Check out',
            dataIndex: 'checkOutTime',
            width: 60,
            render: (text) => {
                if (!text) return ""
                const isISOFormat = text.includes('T')
                if (isISOFormat) return formatDateTime(text, undefined, dateTimeISOFormat)
                else return formatDateTime(text)
            }
        },
        {
            key: 'action',
            title: 'Action',
            isDummyField: true,
            fixed: 'right',
            width: 60,
            align: 'center',
            render: (_, record) => (
                <Space wrap>
                    <Tooltip placement="left" title="Show Details">
                        <Button icon={<EyeOutlined/>} style={{borderColor: "#662038", color: "#662038"}}
                                onClick={() =>
                                    info({
                                        title: 'Rincian data',
                                        okText: 'Tutup',
                                        width: 800,
                                        bodyStyle: {height: '450px', overflowY: 'auto'},
                                        content: (
                                            <>
                                                {generateDetails(record)}
                                            </>
                                        )
                                    })
                                }/>
                    </Tooltip>
                    <Tooltip placement="left" title="Delete">
                        <Button icon={<DeleteOutlined/>} danger onClick={() => {
                            confirm({
                                icon: <ExclamationCircleOutlined/>,
                                title: 'Hapus data',
                                content: 'Yakin ingin menghapus data ini?',
                                okText: 'Hapus',
                                okType: "primary",
                                okButtonProps: {danger: true},
                                onOk: () => deleteData(record.id)
                            })
                        }}/>
                    </Tooltip>
                </Space>
            )
        },
    ];

    const pagination = {
        hideOnSinglePage: true,
        defaultPageSize: 10,
        position: ["bottomCenter"]
    }

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Collapse defaultActiveKey="1" expandIconPosition="right">
                <Collapse.Panel header="Peta" key="1" >
                </Collapse.Panel>
            </Collapse>
            <Card title="Daftar Kehadiran">
                <Typography.Text>Total data: {data.length}</Typography.Text>
                <Table scroll={{scrollToFirstRowOnChange: true, x: 1000, y: 600}} sticky pagination={pagination}
                       loading={isLoading.fetch} columns={columns} dataSource={data} rowKey="id"/>
            </Card>
        </Space>
    )
}

export default Attendance;