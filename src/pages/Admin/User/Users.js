import React, {useEffect, useState} from 'react';

import {
    Button,
    Card,
    Col,
    Row,
    Space,
    Table,
    Tag,
    Modal,
    Input,
    Tooltip,
    Typography,
    Select
} from "antd";
import {
    formatDateTime,
    getRoleName,
    searchData,
    showDataAddedNotification,
    showDataUpdatedNotification,
    showEmailSentNotification,
    sortStringDateTime
} from "../../../utils/Commons";
import {EditOutlined, UnlockOutlined, ExclamationCircleOutlined, EyeOutlined} from "@ant-design/icons";
import {fetchUsers} from "../../../services";
import {emailStatus, listRole} from "../../../utils/Constants";
import UserFormModal from "./components/UserFormModal";

const initialVisible = {create: false, edit: false}

function Users() {

    const {confirm, info} = Modal;

    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState({fetch: false, filter: false, reload: false});
    const [visible, setVisible] = useState(initialVisible);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(prevState => ({...prevState, fetch: true}))
        fetchUsers((data) => {
            setData(data)
            setFilteredData(data)
            setIsLoading(prevState => ({...prevState, fetch: false}))
        })
    }

    const generateDetails = (record) => {
        const listTitle = {
            id: "id",
            name: "Nama",
            email: "Email",
            role: "Role",
            phoneNumber: "No. HP",
            emailVerified: "Status email",
            emailVerifiedAt: "Tanggal verifikasi",
            dateCreated: "Tanggal dibuat",
            lastUpdated: "Tanggal diperbarui",
            photo: "Foto",
        }
        let details = [];
        Object.keys(listTitle).forEach(key => {
            let value = record[key]
            if (key === "photo") {
                details.push(
                    <>
                        <Row key={listTitle[key]}>
                            <Typography.Text strong>{listTitle[key]}</Typography.Text>
                        </Row>
                        <Row key={key}>
                            {value ? <img src={value} alt="avatar" style={{width: "25%"}}/> : null}
                        </Row>
                    </>
                )
            } else {
                if (key === "role") value = listRole[record[key]]
                if (key === "emailVerified") value = value ? emailStatus.verified : emailStatus.unverified
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
            const results = searchData(data, keyword, ["name", "email"])
            setFilteredData(results);
        } else {
            setFilteredData(data);
        }
    }

    const columns = [
        {
            title: 'No',
            isDummyField: true,
            width: 60,
            render: (_, __, index) => index + 1
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            width: 100,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: 110,
            sorter: (a, b) => getRoleName(a.role).localeCompare(getRoleName(b.role)),
            render: text => getRoleName(text)
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 130,
            render: (value, record) => (
                <>
                    {value}<br/>
                    {record.emailVerified ?
                        <Tag color="green">{emailStatus.verified}</Tag> :
                        <Tag color="red">{emailStatus.unverified}</Tag>
                    }
                </>
            )
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            width: 130,
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            width: 90,
            render: (value) => value ? <img src={value} alt="avatar" className="w-100"/> : null
        },
        {
            title: 'Created at',
            dataIndex: 'dateCreated',
            width: 90,
            defaultSortOrder: 'descend',
            sorter: (a, b) => sortStringDateTime(a.dateCreated, b.dateCreated),
            render: (text) => text ? formatDateTime(text) : ""
        },
        {
            title: 'Updated at',
            dataIndex: 'lastUpdated',
            width: 90,
            render: (text) => text ? formatDateTime(text) : ""
        },
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
        },
    ];

    const pagination = {
        hideOnSinglePage: true,
        defaultPageSize: 10,
        position: ["bottomCenter"]
    }

    const onRoleFilterChange = (selectedRole) => {
        const results = searchData(data, selectedRole, ["role"])
        setFilteredData(results);
    }

    const roleFilter = (
        <Row style={{minWidth: 100}}>
            <Select className="w-100" defaultValue="" onChange={onRoleFilterChange}>
                <Select.Option key={0} value="">All</Select.Option>
                {Object.keys(listRole).map(key => (
                    <Select.Option key={key} value={key}>{listRole[key]}</Select.Option>
                ))}
            </Select>
        </Row>
    )

    return (
        <Space className="w-100" direction="vertical" size="middle">
            <Card title="List User">
                <Row justify="space-between">
                    <Space>
                        {roleFilter}
                    </Space>
                    <Space>
                        <Input.Search placeholder="Name or Email" allowClear enterButton onSearch={onSearch}
                                      style={{width: 200}}/>
                        <Button type="primary" onClick={() => showModal('create')}>Add User</Button>
                    </Space>
                    <UserFormModal title="Tambah Data" visible={visible.create} onSubmit={onCreateFinished}
                                   onCancel={handleCancel}/>
                    <UserFormModal title="Edit Data" data={selectedData} visible={visible.edit}
                                   onSubmit={onUpdateFinished} onCancel={handleCancel}/>
                </Row>
                <Table scroll={{scrollToFirstRowOnChange: true, x: 1000, y: 600}} sticky pagination={pagination}
                       loading={isLoading.fetch} columns={columns} dataSource={filteredData} rowKey="id"/>
            </Card>
        </Space>
    )
}

export default Users;