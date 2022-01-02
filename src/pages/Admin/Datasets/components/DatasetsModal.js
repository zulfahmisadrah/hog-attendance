import React, {useEffect, useState} from "react";
import {Button, Col, Modal, Popconfirm, Row} from "antd";
import PropTypes from "prop-types";
import {BASE_DATASET_TRAIN_URL, BASE_DATASET_VAL_URL, DatasetType} from "../../../../utils/Constants";
import {DatasetService} from "../../../../services/services";
import {showDataDeletedNotification} from "../../../../utils/Commons";

DatasetsModal.propTypes = {
    data: PropTypes.object.isRequired,
    datasetType: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
}

export function DatasetsModal(props) {
    const {data, datasetType, visible, onCancel} = props

    const datasetService = new DatasetService();

    const [datasets, setDatasets] = useState([]);

    const fetchData = () => {
        datasetService.fetchListStudentDatasets(datasetType, data.user?.username, setDatasets);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleRemove = (value) => {
        datasetService.deleteStudentDataset({
            username: data.user?.username,
            fileName: value,
            onSuccess: () => {
                showDataDeletedNotification();
                fetchData();
            }
        })
    }

    const generateListDataset = (datasets) => {
        return datasets.map(value => (
            <Col xs={6} md={3} key={value}>
                <Popconfirm
                    placement="topRight"
                    title="Yakin ingin menghapus data ini?"
                    onConfirm={() => handleRemove(value)}
                    okText="Hapus"
                    cancelText="Batal"
                >
                    <Button type="danger" size="small">X</Button>
                </Popconfirm>
                <img
                    width={60}
                    src={(datasetType === DatasetType.TRAINING ? BASE_DATASET_TRAIN_URL : BASE_DATASET_VAL_URL) + data.user?.username + "/" + value}
                    alt="dataset"
                />
            </Col>
        ))
    }

    const title = `Daftar Dataset - ${data.user?.username} - ${data.user?.name} (${datasets.length} Data)`

    return (
        <Modal
            title={title}
            visible={visible}
            cancelText="Tutup"
            onCancel={onCancel}
            width={640}
            okButtonProps={{style: {display: 'none'}}}
            bodyStyle={{height: '500px', overflowY: 'auto'}}
        >
            <Row gutter={[8, 8]}>
                {datasets && generateListDataset(datasets)}
            </Row>
        </Modal>
    );
}