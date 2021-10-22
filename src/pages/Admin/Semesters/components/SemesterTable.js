import React, {useEffect, useState} from 'react';
import {Button, Col, Row, Space, Table, Tag} from "antd";
import PropTypes from "prop-types";
import {showDataAddedNotification, showDataDeletedNotification, showDataUpdatedNotification} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnCreatedAt, ButtonAddData, ColumnActionsNoEdit} from "../../../../components";
import {_detailRows} from "./_detailRows";
import {SemesterService} from "../../../../services/services";
import {SemesterFormModal} from "./SemesterFormModal";

SemesterTable.propTypes = {
    isSelectDataMode: PropTypes.bool,
    onDataSelected: PropTypes.func
}

export function SemesterTable() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    const semesterService = new SemesterService();

    const fetchData = () => {
        semesterService.getListData({
            onSuccess: (data) => {
                setData(data)
                setFilteredData(data)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (values, onSuccess, onError) => {
        if (values.id) {
            updateSemester(values, onSuccess, onError);
        } else {
            createSemester(values, onSuccess, onError);
        }
    }

    const createNextSemester = () => {
        semesterService.createNextSemester({
            onSuccess: (newData) => {
                showDataAddedNotification();
                fetchData();
            }
        })
    }

    const createSemester = (formData, onSuccess, onError) => {
        semesterService.createData({
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

    const updateSemester = (formData, onSuccess, onError) => {
        semesterService.updateData({
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
        semesterService.deleteData({
            id: id,
            onSuccess: () => {
                showDataDeletedNotification()
                fetchData()
            }
        })
    }

    const changeActiveSemester = (id) => {
        semesterService.activateSemester({
            semester_id: id,
            onSuccess: () => {
                showDataUpdatedNotification()
                fetchData()
            }
        })
    }

    const columns = [
        {
            title: 'Status',
            dataIndex: 'is_active',
            width: 80,
            render: (value, record) => value ? (
                <Tag color="green">AKTIF</Tag>
            ) : (
                <Button size="small" onClick={() => changeActiveSemester(record.id)}>AKTIFKAN</Button>
            )
        },
        ..._columns,
        ColumnCreatedAt,
        ColumnActionsNoEdit({
            detailRows: _detailRows,
            onConfirmDelete: deleteData
        })
    ];

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
                        <Button type="primary" onClick={createNextSemester}>Buat Semester Selanjutnya</Button>
                        <ButtonAddData formModal={SemesterFormModal} onSubmit={handleSubmit}/>
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