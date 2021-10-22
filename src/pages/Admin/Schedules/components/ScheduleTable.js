import React, {useEffect, useState} from 'react';
import {Col, Row, Table} from "antd";
import {
    formatMomentToString,
    showDataAddedNotification,
    showDataDeletedNotification,
    showDataUpdatedNotification,
} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnCreatedAt, ColumnActions, ButtonAddData} from "../../../../components";
import {_detailRows} from "./_detailRows";
import {ScheduleService} from "../../../../services/services";
import {ScheduleFormModal} from "./ScheduleFormModal";
import {timeFormat} from "../../../../utils/Constants";


export function ScheduleTable() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    const scheduleService = new ScheduleService();

    const fetchData = () => {
        scheduleService.getListData({
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
        values.day_of_week = parseInt(values.day_of_week);
        values.start_time = formatMomentToString(values.start_time, timeFormat);
        values.end_time = formatMomentToString(values.end_time, timeFormat);
        if (values.id) {
            updateSchedule(values, onSuccess, onError);
        } else {
            createSchedule(values, onSuccess, onError);
        }
    }

    const createSchedule = (formData, onSuccess, onError) => {
        scheduleService.createData({
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

    const updateSchedule = (formData, onSuccess, onError) => {
        scheduleService.updateData({
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
        scheduleService.deleteData({
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
            formModal: ScheduleFormModal,
            onUpdate: handleSubmit,
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
                    <ButtonAddData formModal={ScheduleFormModal} onSubmit={handleSubmit}/>
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