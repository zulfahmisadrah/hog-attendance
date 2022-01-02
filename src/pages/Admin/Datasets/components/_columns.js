import React from "react";
import {Space} from "antd";
import {ButtonShowModal} from "../../../../components";
import {DatasetsModal} from "./DatasetsModal";
import {DatasetType} from "../../../../utils/Constants";

export const _columns = [
    {
        title: 'NIM',
        dataIndex: ['user', 'username'],
        width: 60,
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.user?.username?.localeCompare(b.user?.username),
    },
    {
        title: 'Nama',
        dataIndex: ['user', 'name'],
        width: 80,
    },
    {
        title: 'Raw Dataset Latih',
        dataIndex: ['total', 'datasets_raw_train'],
        width: 50,
        sorter: (a, b) => a.total.datasets_raw_train - b.total.datasets_raw_train,
    },
    {
        title: 'Dataset Latih',
        dataIndex: ['total', 'datasets_train'],
        width: 50,
        sorter: (a, b) => a.total.datasets_train - b.total.datasets_train,
    },
    {
        title: 'Raw Dataset Uji',
        dataIndex: ['total', 'datasets_raw_val'],
        width: 50,
        sorter: (a, b) => a.total.datasets_raw_val - b.total.datasets_raw_val,
    },
    {
        title: 'Dataset Uji',
        dataIndex: ['total', 'datasets_val'],
        width: 50,
        sorter: (a, b) => a.total.datasets_val - b.total.datasets_val,
    },
    {
        title: 'Action',
        dataIndex: ['user', 'username'],
        width: 60,
        render: (_, username) => {
            return (
                <Space direction="vertical">
                    <ButtonShowModal
                        modal={DatasetsModal}
                        modalProps={{
                            data: username,
                            datasetType: DatasetType.TRAINING
                        }}>
                        Daftar Dataset Latih
                    </ButtonShowModal>
                    <ButtonShowModal
                        modal={DatasetsModal}
                        modalProps={{
                            data: username,
                            datasetType: DatasetType.VALIDATION
                        }}>
                        Daftar Dataset Uji
                    </ButtonShowModal>
                </Space>
            )
        }
    }
]