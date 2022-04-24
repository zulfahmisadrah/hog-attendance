import React, {useEffect, useState} from 'react';
import {Col, Row, Space, Table} from "antd";
import {
    searchData,
    handleInputPhoneNumber,
    showDataAddedNotification,
    showDataDeletedNotification,
    showDataUpdatedNotification,
} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnCreatedAt, ColumnActions, ButtonAddData, SearchField} from "../../../../components";
import {_detailRows} from "./_detailRows";
import {StudentService} from "../../../../services/services";
import {StudentFormModal} from "./StudentFormModal";
import {UserService} from "../../../../services/services/UserService";
import {BASE_AVATAR_URL} from "../../../../utils/Constants";


export function StudentTable() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    const studentService = new StudentService();
    const userService = new UserService();

    const fetchData = () => {
        studentService.getListData({
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
                            updateStudent(values, onSuccess, onError);
                        }
                    });
                } else {
                    values.avatar = null;
                    updateStudent(values, onSuccess, onError);
                }
            } else {
                delete values.fileList
                userService.uploadUserAvatar({
                    data: avatarFormData,
                    onSuccess: (photoUrl) => {
                        values.avatar = photoUrl;
                        createStudent(values, onSuccess, onError);
                    }
                });
            }
        } else {
            delete values.fileList;
            createStudent(values, onSuccess, onError);
        }
    }

    const createStudent = (formData, onSuccess, onError) => {
        studentService.createData({
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

    const updateStudent = (formData, onSuccess, onError) => {
        studentService.updateData({
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
        studentService.deleteData({
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
            formModal: StudentFormModal,
            onUpdate: handleSubmit,
            onConfirmDelete: deleteData
        })
    ]

    const onSearch = (keyword) => {
        if (keyword !== "") {
            const dataUser = data.map(value => ({...value, ...value.user}))
            const results = searchData(dataUser, keyword, false, ["name", "username"])
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

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <Row justify="end">
                    <Space>
                        <SearchField placeholder="Nama atau NIM" onSearch={onSearch}/>
                        <ButtonAddData formModal={StudentFormModal} onSubmit={handleSubmit}/>
                    </Space>
                </Row>
            </Col>
            <Col span={24}>
                <Table
                    scroll={{scrollToFirstRowOnChange: true, x: 500, y: 600}}
                    sticky
                    pagination={pagination}
                    loading={loading}
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                />
            </Col>
        </Row>
    )
}