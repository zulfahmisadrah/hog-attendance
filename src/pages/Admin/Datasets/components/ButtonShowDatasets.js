import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";
import {DatasetsModal} from "./DatasetsModal";

ButtonShowDatasets.propTypes = {
    data: PropTypes.object.isRequired
}

export function ButtonShowDatasets(props) {
    const {data} = props

    const [visible, setVisible] = useState(false);

    const showDataset = () => {
        showModal();
        // fetchData();
    }

    const showModal = () => setVisible(true)
    const closeModal = () => setVisible(false)

    return (
        <>
            <Button onClick={showDataset} type="secondary">Daftar Dataset</Button>
            {visible && (
                <DatasetsModal
                    data={data}
                    visible={visible}
                    onCancel={closeModal}
                />
            )}
        </>
    )
}