import React, {useEffect, useState} from "react";
import {Button, Col, Modal, Popconfirm, Row} from "antd";
import PropTypes from "prop-types";
import {BASE_DATASET_TRAIN_URL, DatasetType, MAX_SIZE_IMAGE_MB} from "../../../utils/Constants";
import {DatasetService} from "../../../services/services";
import {showDataAddedNotification, showDataDeletedNotification, showDataUpdatedMessage} from "../../../utils/Commons";
import {useSelector} from "react-redux";
import {CameraFilled, CameraOutlined, UnlockOutlined, UploadOutlined} from "@ant-design/icons";
import {ButtonShowModal} from "../../../components";
import {UploadImagesModal} from "../../Admin/Datasets/components/UploadImagesModal";
import {useHistory} from "react-router-dom";
import {userPath} from "../../../path";

StudentDatasetsModal.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
}

export function StudentDatasetsModal(props) {
    const {visible, onCancel} = props;

    const user = useSelector(state => state.auth?.user);
    const history = useHistory();

    const datasetService = new DatasetService();

    const [datasets, setDatasets] = useState([]);

    const fetchData = () => {
        datasetService.fetchListStudentDatasets(DatasetType.TRAINING, user?.username, setDatasets);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleRemove = (value) => {
        datasetService.deleteStudentDataset({
            username: user?.username,
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
                <img
                    width={60}
                    src={BASE_DATASET_TRAIN_URL + user?.username + "/" + value}
                    alt="dataset"
                />
            </Col>
        ))
    }

    const toTakePhotoPage = () => {
        history.push(userPath.takePhoto);
    }

    const handleUploadStudentDataset = (values, onSuccess, onError) => {
        if (values.fileList) {
            const files = values.fileList.map((file) => file.originFileObj)
            console.log(files);
            const formData = new FormData();
            formData.append('username', user?.username);
            formData.append('dataset_type', DatasetType.TRAINING);
            files.forEach(file => {
                formData.append('files', file);
            })
            datasetService.datasetCapture({
                data: formData,
                onSuccess: (response) => {
                    console.log(`response = `, response)
                    showDataUpdatedMessage();
                    fetchData();
                    onSuccess();
                },
                onError: (e) => {
                    console.log(e);
                    onError();
                }
            });
        }
    }

    const title = `Daftar Dataset (${datasets.length} Data)`;

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
            <Row gutter={[8, 8]} justify="end">
                <Col xs={12} md={6}>
                    <ButtonShowModal
                        className="w-100"
                        type="primary"
                        icon={<UploadOutlined/>}
                        modal={UploadImagesModal}
                        modalProps={{maxSize: MAX_SIZE_IMAGE_MB, onSubmit: handleUploadStudentDataset}}
                    >
                        Upload Foto
                    </ButtonShowModal>
                </Col>
                <Col xs={12} md={6}>
                    <Button
                        className="w-100"
                        icon={<CameraFilled/>}
                        onClick={toTakePhotoPage}
                    >
                        Ambil Foto
                    </Button>
                </Col>
            </Row>
            <Row gutter={[8, 8]} style={{marginTop: 16}}>
                {datasets && generateListDataset(datasets)}
            </Row>
        </Modal>
    );
}