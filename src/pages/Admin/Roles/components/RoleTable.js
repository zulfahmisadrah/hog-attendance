import React, {useEffect, useState} from 'react';
import {Button, Input, Row, Space, Table, Typography} from "antd";
import PropTypes from "prop-types";
import {searchData, showDataAddedNotification,} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {ColumnNumber, ColumnCreatedAt} from "../../../../components";
import {RoleFormModal} from "./RoleFormModal";
import {RoleService} from "../../../../services/services";

RoleTable.propTypes = {
    isSelectDataMode: PropTypes.bool,
    onDataSelected: PropTypes.func
}

const initialVisible = {create: false, edit: false}

export function RoleTable(props) {
    const {isSelectDataMode, onDataSelected} = props;

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(initialVisible);

    const hasSelected = selectedRowKeys.length > 0;
    const departmentService = new RoleService();

    const fetchData = () => {
        departmentService.getListData({
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

    const handleCancel = () => {
        setVisible(initialVisible);
    }

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        if (isSelectDataMode) onDataSelected(selectedRows)
        setSelectedRowKeys(selectedRowKeys);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => onSelectChange(selectedRowKeys, selectedRows),
    }

    const onSearch = keyword => {
        if (keyword !== "") {
            const results = searchData(data, keyword, false, ["code", "name"])
            setFilteredData(results);
        } else {
            setFilteredData(data);
        }
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
        <>
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
                    <Input.Search placeholder="Cari..." allowClear enterButton onSearch={onSearch}
                                  style={{width: 200}}/>
                </Space>
                {visible.create && (
                    <RoleFormModal title="Tambah Data" visible={visible.create} onSubmit={onCreateFinished}
                                   onCancel={handleCancel}/>
                )}
            </Row>
            <Table scroll={{scrollToFirstRowOnChange: true, x: 1000, y: 600}} sticky
                   pagination={!isSelectDataMode && pagination} loading={isLoading.fetch}
                   rowSelection={isSelectDataMode && rowSelection} columns={columns}
                   dataSource={filteredData} rowKey="id"/>
        </>

    )
}