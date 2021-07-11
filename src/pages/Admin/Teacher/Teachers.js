import React, {useEffect, useState} from 'react';

import {Button, Card, Col, Row, Space, Table, Tag, Modal, Input, Tooltip, Typography} from "antd";
import {
    formatDateTime,
    searchData,
    showDataAddedNotification,
    showDataUpdatedNotification,
    sortStringDateTime
} from "../../../utils/Commons";
import {EditOutlined, UnlockOutlined, ExclamationCircleOutlined, EyeOutlined} from "@ant-design/icons";
import {fetchTeachers} from "../../../services";
import {emailStatus} from "../../../utils/Constants";
import PropTypes from "prop-types";
import {TeacherFormModal} from "./components";

const initialVisible = {create: false, edit: false}

Teachers.propTypes = {
    isSelectDataMode: PropTypes.bool,
    onDataSelected: PropTypes.func
}

function Teachers(props) {
    const {isSelectDataMode, onDataSelected} = props

    const {confirm, info} = Modal;

    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState({fetch: false, filter: false, reload: false});
    const [visible, setVisible] = useState(initialVisible);

    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(prevState => ({...prevState, fetch: true}))
        fetchTeachers((data) => {
            setData(data)
            setFilteredData(data)
            setIsLoading(prevState => ({...prevState, fetch: false}))
        })
    }

    const generateDetails = (record) => {
        const listTitle = {
            id: "id",
            user: {
                id: "id User",
                name: "Nama",
                email: "Email",
                phoneNumber: "No. HP",
                emailVerified: "Status email",
                emailVerifiedAt: "Tanggal verifikasi",
                photo: "Foto"
            },
            field: "Bidang",
            lastEducation: "Pendidikan Terakhir",
            dateCreated: "Tanggal dibuat",
            lastUpdated: "Tanggal diperbarui"
        }

        let details = [];
        Object.keys(listTitle).forEach(key => {
            let value = record[key]
            if (key === "user") {
                Object.keys(listTitle.user).forEach(userKey => {
                    value = record.user[userKey]
                    if (userKey === "photo") {
                        details.push(
                            <>
                                <Row key={listTitle.user[userKey]}>
                                    <Typography.Text strong>{listTitle.user[userKey]}</Typography.Text>
                                </Row>
                                <Row key={userKey}>
                                    {value ? <img src={value} alt="avatar" style={{width: "25%"}}/> : null}
                                </Row>
                            </>
                        );
                    } else {
                        if (userKey === "emailVerified") value = value ? emailStatus.verified : emailStatus.unverified;
                        details.push(
                            <Row key={userKey}>
                                <Col span={6}>
                                    <Typography.Text strong>{listTitle.user[userKey]}</Typography.Text>
                                </Col>
                                <Col span={18}>
                                    <Typography.Text>: {value}</Typography.Text><br/>
                                </Col>
                            </Row>
                        );
                    }
                })
            } else {
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
            }
        })
        return details
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

    const resetPassword = (email) => {
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

    const onSearch = keyword => {
        if (keyword !== "") {
            const dataUser = data.map(value => ({...value, ...value.user}))
            const results = searchData(dataUser, keyword, ["name", "email"])
            setFilteredData(results);
        } else {
            setFilteredData(data);
        }
    }

    const columns = [
        ...isSelectDataMode ? [] :
            [{
                title: 'No',
                isDummyField: true,
                width: 60,
                render: (_, __, index) => index + 1
            }],
        {
            title: 'Nama',
            dataIndex: ['user', 'name'],
            width: 100,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Bidang',
            dataIndex: 'field',
            width: 110,
        },
        {
            title: 'Pendidikan Terakhir',
            dataIndex: 'lastEducation',
            width: 110,
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            width: 130,
            render: (value, record) => (
                <>
                    {value}<br/>
                    {record.user.emailVerified ?
                        <Tag color="green">{emailStatus.verified}</Tag> :
                        <Tag color="red">{emailStatus.unverified}</Tag>
                    }
                </>
            )
        },
        {
            title: 'No. HP',
            dataIndex: ['user', 'phoneNumber'],
            width: 130,
        },
        {
            title: 'Foto',
            dataIndex: ['user', 'photo'],
            width: 90,
            render: (value) => value ? <img src={value} alt="avatar" className="w-100"/> : null
        },
        {
            title: 'Tanggal dibuat',
            dataIndex: 'dateCreated',
            width: 90,
            defaultSortOrder: 'descend',
            sorter: (a, b) => sortStringDateTime(a.dateCreated, b.dateCreated),
            render: (text) => text ? formatDateTime(text) : ""
        },
        ...isSelectDataMode ? [] : [
            {
                key: 'action',
                title: 'Action',
                isDummyField: true,
                width: 60,
                fixed: 'right',
                align: 'center',
                render: (_, record) => (
                    <Space wrap>
                        <Tooltip placement="left" title="Show Details">
                            <Button icon={<EyeOutlined/>} style={{borderColor: "#662038", color: "#662038"}}
                                    onClick={() =>
                                        info({
                                            title: 'Rincian data',
                                            okText: 'Tutup',
                                            width: 640,
                                            bodyStyle: {height: '450px', overflowY: 'auto'},
                                            content: (
                                                <>
                                                    {generateDetails(record)}
                                                </>
                                            )
                                        })
                                    }/>
                        </Tooltip>
                        <Tooltip placement="left" title="Edit">
                            <Button icon={<EditOutlined/>} style={{borderColor: "#d09228", color: "#d09228"}}
                                    onClick={() => showModal('edit', record)}/>
                        </Tooltip>
                        <Tooltip placement="left" title="Reset Password">
                            <Button icon={<UnlockOutlined/>} onClick={() => {
                                confirm({
                                    icon: <ExclamationCircleOutlined/>,
                                    title: 'Reset Password',
                                    content: 'Yakin ingin melakukan reset password? Password baru akan terkirim ke email pengguna',
                                    okText: 'Reset',
                                    okType: "primary",
                                    okButtonProps: {danger: true},
                                    onOk: () => resetPassword(record.email)
                                })
                            }}/>
                        </Tooltip>
                    </Space>
                )
            }]
    ];

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        if (isSelectDataMode) onDataSelected(selectedRows)
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => onSelectChange(selectedRowKeys, selectedRows),
    }

    const reload = () => {
        setIsLoading(prevState => ({...prevState, reload: true}));
        setSelectedRowKeys([]);
        setIsLoading(prevState => ({...prevState, reload: false}));
    }

    const pagination = {
        hideOnSinglePage: true,
        defaultPageSize: 10,
        position: ["bottomCenter"]
    }

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="Daftar Pengajar">
                <Row justify={isSelectDataMode ? "space-between" : "end"}>
                    {isSelectDataMode &&
                    <Space>
                        <Button type="secondary" onClick={reload} disabled={!hasSelected}
                                loading={isLoading.reload}>
                            Batal
                        </Button>
                        <Typography.Text>{hasSelected ? `${selectedRowKeys.length} data terseleksi` : `Total data: ${filteredData.length}`}</Typography.Text>
                    </Space>
                    }
                    <Space>
                        <Input.Search placeholder="Name or Email" allowClear enterButton onSearch={onSearch}
                                      style={{width: 200}}/>
                        {
                            isSelectDataMode ? null :
                                <Button type="primary" onClick={() => showModal('create')}>Tambah Data</Button>
                        }
                    </Space>
                    <TeacherFormModal title="Tambah Data" visible={visible.create} onSubmit={onCreateFinished}
                                      onCancel={handleCancel}/>
                    <TeacherFormModal title="Edit Data" data={selectedData} visible={visible.edit}
                                      onSubmit={onUpdateFinished} onCancel={handleCancel}/>
                </Row>
                <Table scroll={{scrollToFirstRowOnChange: true, x: 1000, y: 600}} sticky
                       pagination={!isSelectDataMode && pagination} loading={isLoading.fetch}
                       rowSelection={isSelectDataMode && rowSelection} columns={columns}
                       dataSource={filteredData} rowKey="id"/>
            </Card>
        </Space>
    )
}

export default Teachers;