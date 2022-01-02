import React, {useEffect, useState} from 'react';
import {Alert, Button, Col, Row, Space, Table, Typography} from "antd";
import {searchData, showDataAddedNotification} from "../../../../utils/Commons";
import {_columns} from "./_columns";
import {SearchField} from "../../../../components";
import {DatasetService} from "../../../../services/services";
import {DatasetType} from "../../../../utils/Constants";


export function DatasetTable() {

    const initialButtonLoading = {reload: false, [DatasetType.TRAINING]: false, [DatasetType.VALIDATION]: false}

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [result, setResult] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(initialButtonLoading);

    const hasSelected = selectedRowKeys.length > 0;

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

    const detectFromRawDataset = (datasetType) => {
        setButtonLoading(prevState => ({...prevState, [datasetType]: true}));
        const data = {
            usernames: selectedRowKeys,
            dataset_type: datasetType,
        }
        datasetService.createFromRawDataset({
            data: data,
            onSuccess: (response) => {
                console.log(`response = `, response);
                setResult(response);
                setButtonLoading(initialButtonLoading);
                showDataAddedNotification();
                reload();
            },
            onError: (e) => {
                console.log(e);
                setButtonLoading(initialButtonLoading);
            }
        })
    }

    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const onSearch = (keyword) => {
        if (keyword !== "") {
            const results = searchData(data, keyword, false, [['user', 'username'], ['user', 'name']]);
            setFilteredData(results);
        } else {
            setFilteredData(data);
        }
    }

    const reload = () => {
        setButtonLoading(prevState => ({...prevState, reload: true}));
        setSelectedRowKeys([]);
        setButtonLoading(initialButtonLoading);
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
                        <Button type="secondary" onClick={reload} disabled={!hasSelected}
                                loading={buttonLoading.reload}>
                            Batal
                        </Button>
                        <Button className="w-100" type="primary" disabled={!hasSelected}
                                onClick={() => detectFromRawDataset(DatasetType.TRAINING)}
                                loading={buttonLoading[DatasetType.TRAINING]}>
                            Buat Dataset Latih
                        </Button>
                        <Button className="w-100" disabled={!hasSelected}
                                onClick={() => detectFromRawDataset(DatasetType.VALIDATION)}
                                loading={buttonLoading[DatasetType.VALIDATION]}>
                            Buat Dataset Uji
                        </Button>
                    </Space>
                    <Space>
                        <SearchField placeholder="Nama atau NIM" onSearch={onSearch}/>
                    </Space>
                </Row>
            </Col>
            <Col span={24}>
                {result && (
                    <Alert className="w-100" type="success" closable onClose={() => setResult(null)}
                           message={<Typography.Text strong>Dataset berhasil dibuat:</Typography.Text>}
                           description={(
                               <Row gutter={[16, 8]}>
                                   <Col span={24}>
                                       <Row gutter={[8, 8]}>
                                           <Col xs={24} md={12}>
                                               <Typography.Text>Total Dataset: {result.total_datasets}</Typography.Text>
                                           </Col>
                                           <Col xs={24} md={12}>
                                               <Typography.Text>Total Mahasiswa: {result.total_users}</Typography.Text>
                                           </Col>
                                           <Col xs={24} md={12}>
                                               <Typography.Text>Waktu
                                                   Komputasi: {result.computation_time} detik</Typography.Text>
                                           </Col>
                                           <Col xs={24} md={12}>
                                               <Typography.Text>
                                                   Rata-rata Waktu
                                                   Komputasi: {result.average_computation_time} detik/mahasiswa
                                               </Typography.Text>
                                           </Col>
                                       </Row>
                                   </Col>
                               </Row>
                           )}
                    />
                )}
                <Table
                    scroll={{scrollToFirstRowOnChange: true, x: 500, y: 600}}
                    sticky
                    pagination={pagination}
                    rowSelection={rowSelection}
                    loading={loading}
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={(record) => record.user?.username}
                />
            </Col>
        </Row>
    )
}