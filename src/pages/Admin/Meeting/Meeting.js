import React, {useEffect, useState} from 'react';

import {Button, Card, Col, Modal, Row, Space, Table, Tooltip, Typography} from "antd";
import {
    formatDateTime,
    showDataAddedNotification,
    showDataDeletedNotification,
    showDataUpdatedNotification,
    sortStringDateTime
} from "../../../utils/Commons";
import {dateTimeISOFormat} from "../../../utils/Constants";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined} from "@ant-design/icons";
import {fetchMeetings, removeMeeting} from "../../../services";
import {GenerateMeetingFormModal, MeetingFormModal} from "./components";

const initialVisible = {create: false, edit: false, detail: false, generate: false}

function Meetings() {

    const {confirm, info} = Modal;

    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(undefined);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState({fetch: false, filter: false, reload: false});
    const [visible, setVisible] = useState(initialVisible);

    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        if (data.length === 0) fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(prevState => ({...prevState, fetch: true}))
        fetchMeetings((listData) => {
            setData(listData)
            setFilteredData(listData)
            setIsLoading(prevState => ({...prevState, fetch: false}))
        })
    }

    const onCreateFinished = () => {
        setVisible(prevState => ({...prevState, create: false}))
        showDataAddedNotification()
        fetchData()
    }

    const onUpdateFinished = () => {
        setVisible(prevState => ({...prevState, edit: false}))
        showDataUpdatedNotification()
        fetchData()
    }

    const onMeetingGenerated = () => {
        setVisible(prevState => ({...prevState, generate: false}))
        showDataUpdatedNotification()
        reload()
        fetchData()
    }

    const deleteData = (id) => {
        removeMeeting(id, () => {
            showDataDeletedNotification()
            fetchData()
        })
    }

    const generateDetails = (record) => {
        const listTitle = {
            id: "id",
            teacher: {
                name: "Pengajar",
            },
            name: "Mata Pelajaran",
            number: "Pertemuan Ke-",
            duration: "Durasi",
            schedule: "Jadwal",
            dateCreated: "Tanggal dibuat",
            lastUpdated: "Tanggal diperbarui"
        }
        let details = [];
        Object.keys(listTitle).forEach(key => {
            let value = record[key]
            if (key === "teacher") value = record.teacher.user.name
            details.push(
                <Row key={key}>
                    <Col span={6}>
                        <Typography.Text
                            strong>{key === "teacher" ? listTitle.teacher.name : listTitle[key]}</Typography.Text>
                    </Col>
                    <Col span={18}>
                        <Typography.Text>: {value}</Typography.Text><br/>
                    </Col>
                </Row>
            )
        })
        return details
    }

    const showModal = (type, data) => {
        if (type === 'edit' || type === 'detail') {
            setSelectedData(data);
        }
        setVisible(prevState => ({...prevState, [type]: true}));
    }

    const handleCancel = () => {
        setVisible(initialVisible);
    }

    const reload = () => {
        setIsLoading(prevState => ({...prevState, reload: true}));
        setSelectedRowKeys([]);
        setIsLoading(prevState => ({...prevState, reload: false}));
    }

    const columns = [
        {
            title: 'Mata Pelajaran',
            dataIndex: 'name',
            width: 100,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Ke-',
            width: 45,
            dataIndex: 'number',
            defaultSortOrder: 'descend',
            sorter: {
                compare: (a, b) => a.number - b.number,
                multiple: 2
            },
        },
        {
            title: 'Pengajar',
            dataIndex: ['teacher', 'user', 'name'],
            width: 100,
        },
        {
            title: 'Durasi',
            dataIndex: 'duration',
            width: 60,
            render: (text) => text + " Menit"
        },
        {
            title: 'Jadwal',
            dataIndex: 'schedule',
            width: 90,
            sorter: (a, b) => sortStringDateTime(a.schedule, b.schedule),
            render: (text) => {
                if (!text) return ""
                const isISOFormat = text.includes('T')
                if (isISOFormat) return formatDateTime(text, undefined, dateTimeISOFormat)
                else return formatDateTime(text)
            }
        },
        {
            title: 'Tanggal dibuat',
            dataIndex: 'dateCreated',
            width: 90,
            defaultSortOrder: 'descend',
            sorter: {
                compare: (a, b) => sortStringDateTime(a.dateCreated, b.dateCreated),
                multiple: 1
            },
            render: (text) => text ? formatDateTime(text) : ""
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
                                onClick={() => {
                                    showModal('detail', record)
                                    info({
                                        title: 'Rincian  data',
                                        okText: 'Tutup',
                                        width: 640,
                                        bodyStyle: {height: '450px', overflowY: 'auto'},
                                        content: (
                                            <>
                                                {generateDetails(record)}
                                            </>
                                        )
                                    })
                                }}/>
                    </Tooltip>
                    <Tooltip placement="left" title="Edit">
                        <Button icon={<EditOutlined/>} style={{borderColor: "#d09228", color: "#d09228"}}
                                onClick={() => showModal('edit', record)}/>
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
    ]
    
    const pagination = {
        hideOnSinglePage: true,
        defaultPageSize: 10,
        position: ["bottomCenter", "topCenter"]
    }

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => onSelectChange(selectedRowKeys, selectedRows),
    };

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Pertemuan">
                <Row justify="space-between" style={{marginBottom: 6}}>
                    <Space>
                        <Button type="secondary" onClick={reload} disabled={!hasSelected} loading={isLoading.reload}>
                            Batal
                        </Button>
                        <Button type="primary" onClick={() => showModal('generate')} disabled={!hasSelected}
                                loading={isLoading.reload}>
                            Buat Pertemuan Selanjutnya
                        </Button>
                        <Typography.Text>{hasSelected ? `${selectedRowKeys.length} data terseleksi` : `Total data: ${filteredData.length}`}</Typography.Text>
                    </Space>
                    <Space>
                        <Button type="primary" onClick={() => showModal('create')}>Tambah Data</Button>
                    </Space>
                    <GenerateMeetingFormModal title="Buat Pertemuan Selanjutnya" visible={visible.generate}
                                              onSubmit={onMeetingGenerated} data={selectedRows}
                                              onCancel={handleCancel}/>
                    <MeetingFormModal title="Tambah Data" visible={visible.create} onSubmit={onCreateFinished}
                                      onCancel={handleCancel}/>
                    <MeetingFormModal title="Edit Data" data={selectedData} visible={visible.edit}
                                      onSubmit={onUpdateFinished} onCancel={handleCancel}/>
                </Row>
                <Table scroll={{scrollToFirstRowOnChange: true, x: 1000, y: 600}} sticky pagination={pagination}
                       rowSelection={rowSelection} loading={isLoading.fetch} columns={columns} dataSource={filteredData}
                       rowKey="id"/>
            </Card>
        </Space>
    )
}

export default Meetings;
