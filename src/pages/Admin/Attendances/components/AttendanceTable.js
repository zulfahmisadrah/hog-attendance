import React, {useEffect, useState} from 'react';
import {Button, Input, Row, Space, Table, Typography} from "antd";
import PropTypes from "prop-types";
import {
    searchData, showDataAddedNotification,
    showDataDeletedNotification,
    showDataUpdatedNotification,
} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnNumber, ColumnCreatedAt, AttendanceFilter} from "../../../../components";
import {AttendanceService} from "../../../../services/services/AttendanceService";

AttendanceTable.propTypes = {
    isSelectDataMode: PropTypes.bool,
    onDataSelected: PropTypes.func
}

const initialVisible = {create: false, edit: false}

export function AttendanceTable(props) {
    const {isSelectDataMode, onDataSelected} = props;

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(initialVisible);

    const hasSelected = selectedRowKeys.length > 0;
    const attendanceService = new AttendanceService();

    const fetchData = () => {
        attendanceService.getListData({
            onSuccess: (data) => {
                setData(data)
                setFilteredData(data)
                setIsLoading(false)
            }
        })
    }

    useEffect(() => {
        fetchData();
    }, []);


    const onUpdateFinished = () => {
        setVisible(prevState => ({...prevState, edit: false}))
        showDataUpdatedNotification()
        fetchData()
    }

    const deleteData = (id) => {
        attendanceService.deleteData({
            id: id,
            onSuccess: () => {
                showDataDeletedNotification()
                fetchData()
            }
        })
    }

    const columns = [
        ...isSelectDataMode ? [] : [ColumnNumber],
        ..._columns,
        ColumnCreatedAt,
    ]

    const onCreateFinished = () => {
        setVisible(prevState => ({...prevState, create: false}))
        showDataAddedNotification()
        fetchData()
    }

    const showModal = (type) => {
        setVisible(prevState => ({...prevState, [type]: true}));
    }

    const handleCancel = () => {
        setVisible(initialVisible);
    }

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
        total: filteredData?.length,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        defaultPageSize: 10,
        position: ["bottomCenter"],
        showSizeChanger: true,
        showQuickJumper: true
    }

    const updateAttendances = (status) => {
        setIsLoading(prevState => ({...prevState, reload: true}));
        selectedRowKeys.forEach((key, index) => {
            const originalData = filteredData.find(data => data.id === key);
            if (originalData && status !== originalData.status) {
                const updatedAttendance = {
                    id: key,
                    status: status
                }
                attendanceService.updateData({
                    data: updatedAttendance,
                    onSuccess: () => {
                        if (index === selectedRowKeys.length - 1) {
                            fetchData();
                            showDataUpdatedNotification();
                            setSelectedRowKeys([]);
                            setIsLoading(prevState => ({...prevState, reload: false}));
                        }
                    },
                    onError: (e) => {
                        console.log(e);
                        setIsLoading(prevState => ({...prevState, reload: false}));
                    }
                })
            }
        })
    }

    return (
        <>
            <Row justify="start">
                <Space>
                    <Button type="secondary" onClick={reload} disabled={!hasSelected}
                            loading={isLoading.reload}>
                        Selesai
                    </Button>
                    <AttendanceFilter type="buttons" onSelected={updateAttendances} disabled={!hasSelected}/>
                    <Typography.Text>{hasSelected ? `${selectedRowKeys.length} data terseleksi` : `Total data: ${filteredData.length}`}</Typography.Text>
                </Space>
            </Row>
            <Table scroll={{scrollToFirstRowOnChange: true, x: 1000, y: 600}} sticky
                   pagination={pagination} loading={isLoading.fetch}
                   rowSelection={rowSelection} columns={columns}
                   dataSource={filteredData} rowKey="id"/>
        </>

    )
}