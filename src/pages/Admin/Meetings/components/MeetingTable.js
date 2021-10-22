import React, {useEffect, useState} from 'react';
import {Button, Col, Row, Space, Table, Typography} from "antd";
import {
    searchData,
    formatMomentToString,
    getDateTimeFromString,
    showDataAddedNotification,
    showDataDeletedNotification,
    showDataUpdatedNotification
} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnCreatedAt, ColumnActions, ButtonAddData, SearchField} from "../../../../components";
import {_detailRows} from "./_detailRows";
import {MeetingService} from "../../../../services/services";
import {MeetingFormModal} from "./MeetingFormModal";
import {ButtonGenerateMeeting} from "./ButtonGenerateMeeting";
import {dateFormat} from "../../../../utils/Constants";


export function MeetingTable() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const hasSelected = selectedRowKeys.length > 0;
    const meetingService = new MeetingService();

    const fetchData = () => {
        meetingService.getListData({
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
            updateMeeting(values, onSuccess, onError);
        } else {
            createMeeting(values, onSuccess, onError);
        }
    }

    const createMeeting = (formData, onSuccess, onError) => {
        meetingService.createData({
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

    const updateMeeting = (formData, onSuccess, onError) => {
        meetingService.updateData({
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
        meetingService.deleteData({
            id: id,
            onSuccess: () => {
                showDataDeletedNotification();
                fetchData();
            }
        })
    }

    const batchDelete = () => {
        selectedRows.forEach((meeting, index) => {
            meetingService.deleteData({
                id: meeting.id,
                onSuccess: () => {
                    if (index === selectedRows.length-1) {
                        reload();
                        showDataDeletedNotification();
                        fetchData();
                    }
                }
            })
        })
    }

    const generateMeeting = (values, onSuccess, onError) => {
        const quantity = values.quantity
        const incremental = values.incremental || 1
        const interval = values.interval || 7
        selectedRows.forEach(meeting => {
            const {date, course, number, schedule} = meeting
            for (let i = 1; i <= quantity; i++) {
                const newMeetingNumber = number + incremental * i
                const newMeetingName = `${course.name} #${newMeetingNumber}`
                const newMeetingSchedule = formatMomentToString(getDateTimeFromString(date).add(interval * i, "days"))
                const newMeeting = {
                    name: newMeetingName,
                    number: newMeetingNumber,
                    date: newMeetingSchedule,
                    course_id: course.id,
                    schedule_id: schedule.id
                }
                meetingService.createData({
                    data: newMeeting,
                    onSuccess: () => {
                        if (i === quantity) {
                            onSuccess();
                            showDataUpdatedNotification();
                            reload();
                            fetchData();
                        }
                    },
                    onError: (error) => {
                        onError(error)
                    },
                })
            }
        })
    }

    const columns = [
        ..._columns,
        ColumnCreatedAt,
        ColumnActions({
            detailRows: _detailRows,
            formModal: MeetingFormModal,
            onUpdate: handleSubmit,
            onConfirmDelete: deleteData
        })
    ]

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => onSelectChange(selectedRowKeys, selectedRows),
    }

    const onSearch = keyword => {
        if (keyword !== "") {
            const results = searchData(data, keyword, false, [["course", "name"], "number"])
            setFilteredData(results);
        } else {
            setFilteredData(data);
        }
    }

    const reload = () => {
        setLoading(true);
        setSelectedRowKeys([]);
        setLoading(false);
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
                <Row justify="space-between">
                    <Space>
                        <Button type="secondary" onClick={reload} disabled={!hasSelected} loading={loading.reload}>
                            Batal
                        </Button>
                        <ButtonGenerateMeeting onSubmit={generateMeeting} disabled={!hasSelected}/>
                        <Button type="primary" onClick={batchDelete} disabled={!hasSelected}>Hapus Terseleksi</Button>
                        <Typography.Text>{hasSelected && `${selectedRowKeys.length} data terseleksi`}</Typography.Text>
                    </Space>
                    <Space>
                        <SearchField placeholder="Nama atau Nomor" width={250} onSearch={onSearch}/>
                        <ButtonAddData formModal={MeetingFormModal} onSubmit={handleSubmit}/>
                    </Space>
                </Row>
            </Col>
            <Col span={24}>
                <Table
                    scroll={{scrollToFirstRowOnChange: true, x: 500, y: 600}}
                    sticky
                    pagination={pagination}
                    rowSelection={rowSelection}
                    loading={loading}
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                />
            </Col>
        </Row>
    )
}