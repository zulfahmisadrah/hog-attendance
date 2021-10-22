import React, {useEffect, useState} from 'react';
import {Col, Row, Space, Table} from "antd";
import {searchData} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {SearchField} from "../../../../components";
import {DatasetService} from "../../../../services/services";


export function DatasetTable() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    const datasetService = new DatasetService();

    const fetchData = () => {
        datasetService.getListData({
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

    const columns = _columns;

    const onSearch = (keyword) => {
        if (keyword !== "") {
            const results = searchData(data, keyword, false, [['user', 'username'], ['user', 'name']]);
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