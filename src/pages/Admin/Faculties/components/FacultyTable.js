import React, {useEffect, useState} from 'react';
import {Col, Row, Space, Table} from "antd";
import {
    searchData,
    showDataAddedNotification,
    showDataDeletedNotification,
    showDataUpdatedNotification
} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnCreatedAt, ColumnActions, SearchField, ButtonAddData} from "../../../../components";
import {_detailRows} from "./_detailRows";
import {FacultyService} from "../../../../services/services";
import {FacultyFormModal} from "./FacultyFormModal";


export function FacultyTable() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    const facultyService = new FacultyService();

    const fetchData = () => {
        facultyService.getListData({
            limit: 20,
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

    const handleSubmit = (values, onSuccess, onError) => {
        if (values.id) {
            updateFaculty(values, onSuccess, onError);
        } else {
            createFaculty(values, onSuccess, onError);
        }
    }

    const createFaculty = (formData, onSuccess, onError) => {
        facultyService.createData({
            data: formData,
            onSuccess: (newData) => {
                onSuccess();
                showDataAddedNotification();
                fetchData();
            },
            onError: (error) => {
                onError(error);
            }
        })
    }

    const updateFaculty = (formData, onSuccess, onError) => {
        facultyService.updateData({
            data: formData,
            onSuccess: (updatedData) => {
                onSuccess();
                showDataUpdatedNotification();
                fetchData();
            },
            onError: (error) => {
                onError(error);
            }
        })
    }

    const deleteData = (id) => {
        facultyService.deleteData({
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
            formModal: FacultyFormModal,
            onUpdate: handleSubmit,
            onConfirmDelete: deleteData
        })
    ]

    const onSearch = (keyword) => {
        if (keyword !== "") {
            const results = searchData(data, keyword, false, ["name", "code"]);
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
                        <SearchField placeholder="Nama atau Kode" onSearch={onSearch}/>
                        <ButtonAddData formModal={FacultyFormModal} onSubmit={handleSubmit}/>
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