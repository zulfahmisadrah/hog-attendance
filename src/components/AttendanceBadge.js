import React from "react";
import {Badge} from "antd";
import PropTypes from "prop-types";
import {attendanceStatus} from "../utils/Constants";
import styled from "styled-components";

const StyledBadge  = styled(Badge)`
  .ant-badge-status-dot {
    width: 15px;
    height: 15px;
  }
  margin: 5px 2px 0 0;
  
`

AttendanceBadge.propTypes = {
    data: PropTypes.string.isRequired,
    text: PropTypes.string
}

export function AttendanceBadge(props) {
    const {data, text} = props;

    const getBadgeColor = (status) => {
        let color;
        switch (status) {
            case attendanceStatus.attend:
                color = "green";
                break;
            case attendanceStatus.permitted:
                color = "blue";
                break;
            case attendanceStatus.sick:
                color = "orange";
                break;
            case attendanceStatus.absent:
                color = "red";
                break;
            default:
                break;
        }
        return color;
    }

    return (
        <StyledBadge color={getBadgeColor(data)} title={data} text={text}/>
    )
}