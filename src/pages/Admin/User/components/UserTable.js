import React, {useEffect, useState} from 'react';
import {Col, Row, Select, Space, Table} from "antd";
import {
    handleInputPhoneNumber,
    searchData, showDataAddedNotification,
    showDataDeletedNotification,
    showDataUpdatedNotification,
} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnCreatedAt, ColumnActions, SearchField, ButtonAddData} from "../../../../components";
import {_detailRows} from "./_detailRows";
import {UserService} from "../../../../services/services/UserService";
import {UserFormModal} from "./UserFormModal";
import {BASE_AVATAR_URL, listRole} from "../../../../utils/Constants";
import {LecturerService, StudentService} from "../../../../services/services";


export function UserTable() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true);

    const userService = new UserService();
    const studentService = new StudentService();
    const lecturerService = new LecturerService();

    const fetchData = () => {
        userService.getListData({
            onSuccess: (data) => {
                setData(data);
                setFilteredData(data);
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        fetchData();
    }, []);


    const handleSubmit = (values, onSuccess, onError, origin) => {
        values.phone_number = values.phone_number ? handleInputPhoneNumber(values.phone_number) : values.phone_number;
        values.roles = [parseInt(values.role)];
        if (values.fileList) {
            const file = values.fileList[0]?.originFileObj;
            const avatarFormData = new FormData();
            avatarFormData.append('username', values.username);
            avatarFormData.append('avatar', file);
            if (values.id) {
                const avatarUrl = BASE_AVATAR_URL + origin.avatar;
                const avatarModified = values.fileList[0]?.thumbUrl !== avatarUrl;
                delete values.fileList;
                if (file && avatarModified) {
                    userService.uploadUserAvatar({
                        data: avatarFormData,
                        onSuccess: (filePath) => {
                            values.avatar = filePath
                            updateUser(values, onSuccess, onError);
                        }
                    });
                } else {
                    values.avatar = null;
                    updateUser(values, onSuccess, onError);
                }
            } else {
                delete values.fileList
                userService.uploadUserAvatar({
                    data: avatarFormData,
                    onSuccess: (photoUrl) => {
                        values.avatar = photoUrl;
                        createUser(values, onSuccess, onError);
                    }
                });
            }
        } else {
            delete values.fileList;
            createUser(values, onSuccess, onError);
        }
    }

    const getUserRoleService = (role) => {
        let service;
        switch (role) {
            case 3:
                service = lecturerService;
                break;
            case 4:
                service = studentService;
                break;
            default:
                service = userService;
                break;
        }
        return service
    }

    const createUser = (formData, onSuccess, onError) => {
        getUserRoleService(formData.roles[0]).createData({
            data: formData,
            onSuccess: (newData) => {
                onSuccess();
                showDataAddedNotification();
                fetchData();
            },
            onError: (error) => {
                onError(error);
            },
        })
    }

    const updateUser = (formData, onSuccess, onError) => {
        getUserRoleService(formData.roles[0]).updateData({
            data: formData,
            onSuccess: (updatedData) => {
                onSuccess();
                showDataUpdatedNotification();
                fetchData();
            },
            onError: (error) => {
                onError(error);
            },
        })
    }

    const deleteData = (id) => {
        userService.deleteData({
            id: id,
            onSuccess: () => {
                showDataDeletedNotification();
                fetchData();
            }
        })
    }

    const columns = [
        ..._columns,
        ColumnCreatedAt,
        ColumnActions({
            detailRows: _detailRows,
            formModal: UserFormModal,
            onUpdate: handleSubmit,
            onConfirmDelete: deleteData
        })
    ]

    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => onSelectChange(selectedRowKeys, selectedRows),
    }

    const onSearch = keyword => {
        if (keyword !== "") {
            const results = searchData(data, keyword, false, ["name", "username"])
            setFilteredData(results);
        } else {
            setFilteredData(data);
        }
    }

    const pagination = {
        total: filteredData?.length,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        defaultPageSize: 10,
        position: ["bottomCenter"],
        showSizeChanger: true,
        showQuickJumper: true
    }

    const onRoleFilterChange = (selectedRole) => {
        const results = searchData(data, selectedRole, false, [["roles", "[]name"]])
        setFilteredData(results);
    }

    const roleFilter = (
        <Row style={{minWidth: 100}}>
            <Select className="w-100" defaultValue="" onChange={onRoleFilterChange}>
                <Select.Option key={0} value="">All</Select.Option>
                {Object.values(listRole).map(value => (
                    <Select.Option key={value} value={value}>{value}</Select.Option>
                ))}
            </Select>
        </Row>
    )

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Row justify="space-between">
                    <Space>
                        {roleFilter}
                    </Space>
                    <Space>
                        <SearchField placeholder="Nama atau Username" onSearch={onSearch}/>
                        <ButtonAddData formModal={UserFormModal} onSubmit={handleSubmit}/>
                    </Space>
                </Row>
            </Col>
            <Col span={24}>
                <Table
                    scroll={{scrollToFirstRowOnChange: true, x: 500, y: 600}}
                    sticky
                    pagination={pagination}
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                />
            </Col>
        </Row>
    )
}