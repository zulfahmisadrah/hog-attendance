import React from "react";
import {Col, Modal, Row, Typography} from "antd";
import PropTypes from "prop-types";
import {DataType, dateFormat, dateTextFormat, timeFormat, timeTextFormat} from "../utils/Constants";
import {formatDateTime} from "../utils/Commons";

showModalDetails.propTypes = {
    data: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired
}

export function showModalDetails(data, detailRows) {

    const generateDetails = (data) => {
        let details = [];
        detailRows.forEach((row, index) => {
            let value = data[row.dataIndex];
            if (Array.isArray(row.dataIndex)) {
                let tempValue = data;
                row.dataIndex.forEach(key => tempValue = tempValue[key]);
                value = tempValue;
            }
            if (row.type === DataType.DATETIME) {
                value = formatDateTime(value);
            } else if (row.type === DataType.DATE) {
                value = formatDateTime(value, dateTextFormat, dateFormat);
            } else if (row.type === DataType.TIME) {
                value = formatDateTime(value, timeTextFormat, timeFormat);
            } else if (row.type === DataType.CUSTOM) {
                value = row.render(value);
            }
            details.push(
                <Row key={index}>
                    <Col span={6}>
                        <Typography.Text strong>{row.title}</Typography.Text>
                    </Col>
                    <Col span={18}>
                        {row.type === DataType.IMAGE ? (
                            value && <img src={value} alt="avatar" style={{width: "25%"}}/>
                        ) : (
                            <Typography.Text>: {value}</Typography.Text>
                        )}
                    </Col>
                </Row>
            )
        })
        return details
    }

    Modal.info({
        title: 'Rincian data',
        okText: 'Tutup',
        width: 640,
        bodyStyle: {height: '450px', overflowY: 'auto'},
        maskClosable: true,
        content: (
            <>
                {generateDetails(data)}
            </>
        )
    })
}