import React from "react";
import {Tag} from "antd";
import PropTypes from "prop-types";
import {attendanceStatus} from "../utils/Constants";
import styled from "styled-components";

const StyledTag = styled(Tag)`
  font-size: 13px;
  padding: 6px 10px;
`

AttendanceTag.propTypes = {
    data: PropTypes.string.isRequired
}

export function AttendanceTag(props) {
    const {data} = props;

    const getTagColor = (status) => {
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
        <StyledTag color={getTagColor(data)}>{data}</StyledTag>
    )
}