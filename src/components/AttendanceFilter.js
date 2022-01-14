import React, {useState} from "react";
import {Radio, Select} from "antd";
import PropTypes from "prop-types";
import {attendanceStatusOptions} from "../utils/Commons";
import {attendanceStatus} from "../utils/Constants";

AttendanceFilter.propTypes = {
    type: PropTypes.oneOf(["dropdown", "buttons"]),
    onSelected: PropTypes.func
}

export function AttendanceFilter(props) {
    const {type, onSelected, ...rest} = props;

    const [selected, setSelected] = useState("");

    const listFilters = [
        {
            label: "Semua",
            value: ""
        },
        ...attendanceStatusOptions
    ];

    const handleChange = (status) => {
        setSelected(status);
        onSelected(status);
    }

    return type === "dropdown" ? (
        <Select
            style={{width: 100}}
            onChange={handleChange}
            options={listFilters}
            defaultValue={listFilters[0].value}
            {...rest}
        />
    ) : (
        <Radio.Group onChange={e => handleChange(e.target.value)} defaultValue={selected} {...rest}>
            {Object.values(attendanceStatus).map(value => (
                <Radio.Button value={value}>{value}</Radio.Button>
            ))}
        </Radio.Group>
    )
}