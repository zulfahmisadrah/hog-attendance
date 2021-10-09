import React from "react";
import {Button, Tooltip} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import {COLOR_PRIMARY} from "../utils/colors";
import PropTypes from "prop-types";
import {showModalDetails} from "./ShowModalDetails";

ColumnActionDetails.propTypes = {
    data: PropTypes.object.isRequired,
    detailRows: PropTypes.array.isRequired
}

export function ColumnActionDetails(props) {
    const {data, detailRows} = props

    return (
        <Tooltip placement="bottom" title="Show Details">
            <Button size="small" icon={<EyeOutlined/>} style={{borderColor: COLOR_PRIMARY, color: COLOR_PRIMARY}}
                    onClick={() => showModalDetails(data, detailRows)}
            />
        </Tooltip>
    )
}