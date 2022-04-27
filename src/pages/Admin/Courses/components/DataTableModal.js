import React, {useState} from "react";
import {Button, Col, Modal, Row, Space, Table} from "antd";
import PropTypes from "prop-types";
import {DebounceSelect} from "../../../../components/DebounceSelect";

DataTableModal.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    fetchOptions: PropTypes.func,
    onRemoveSelected: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export function DataTableModal(props) {
    const {columns, data, defaultValue, title, visible, fetchOptions, onRemoveSelected, onSubmit, onCancel} = props

    const [selectedOptions, setSelectedOptions] = React.useState(defaultValue);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const hasSelected = selectedRowKeys.length > 0;

    const handleAddData = () => {
        onSubmit(selectedOptions, () => setSelectedOptions([]));
        // setSelectedOptions([]);
    }

    const handleRemoveSelected = () => {
        onRemoveSelected(selectedRowKeys)

    }

    const handleOk = () => {
        onSubmit(selectedOptions)
    }

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => onSelectChange(selectedRowKeys, selectedRows),
    }

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            okText="Simpan"
            cancelText="Tutup"
            onCancel={onCancel}
            width={640}
            okButtonProps={{style: {display: 'none'}}}
            bodyStyle={{height: '500px', overflowY: 'auto'}}
        >
            <Row gutter={16}>
                <Col span={16}>
                    <DebounceSelect
                        mode="multiple"
                        value={selectedOptions}
                        placeholder="Masukkan min. 3 huruf untuk memulai pencarian"
                        fetchOptions={fetchOptions}
                        onChange={(newValue) => {
                            setSelectedOptions(newValue);
                        }}
                        style={{
                            width: '100%',
                        }}
                        maxTagTextLength={10}
                    />
                </Col>
                <Col span={8}>
                    <Row justify="end">
                        <Space>
                            <Button type="primary" onClick={handleAddData}>Tambah</Button>
                            <Button type="primary" onClick={handleRemoveSelected} disabled={!hasSelected}>Hapus</Button>
                        </Space>
                    </Row>
                </Col>
            </Row>
            <Table
                rowSelection={rowSelection}
                dataSource={data}
                columns={columns}
                pagination={{hideOnSinglePage: true, showSizeChanger: true}}
                size="small"
                rowKey="id"/>
        </Modal>
    );
}