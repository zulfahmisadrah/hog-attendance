import React, {useEffect, useState} from 'react';
import {Button, Col, Input, Row, Space, Table, Typography} from "antd";
import PropTypes from "prop-types";
import {
    searchData, showDataAddedNotification,
    showDataDeletedNotification,
    showDataUpdatedNotification,
} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnNumber, ColumnCreatedAt, ColumnActions, ButtonAddData, SearchField} from "../../../../components";
import {_detailRows} from "./_detailRows";
import {ScheduleService} from "../../../../services/services";
import {ScheduleFormModal} from "./ScheduleFormModal";

ScheduleTable.propTypes = {
    isSelectDataMode: PropTypes.bool,
    onDataSelected: PropTypes.func
}

const initialVisible = {create: false, edit: false}

export function ScheduleTable() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    const scheduleService = new ScheduleService();

    const fetchData = () => {
        scheduleService.getListData({
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

    const onCreateFinished = () => {
        showDataAddedNotification()
        fetchData()
    }

    const onUpdateFinished = () => {
        showDataUpdatedNotification()
        fetchData()
    }

    const deleteData = (id) => {
        scheduleService.deleteData({
            id: id,
            onSuccess: () => {
                showDataDeletedNotification()
                fetchData()
            }
        })
    }

    const columns = [
        ..._columns,
        ColumnCreatedAt,
        ColumnActions({
            detailRows: _detailRows,
            formModal: ScheduleFormModal,
            onUpdateFinished: onUpdateFinished,
            onConfirmDelete: deleteData
        })
    ]

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
                    <ButtonAddData formModal={ScheduleFormModal} onFinish={onCreateFinished}/>
                </Row>
            </Col>
            <Col span={24}>
                <Table
                    scroll={{scrollToFirstRowOnChange: true, x: 450, y: 600}}
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