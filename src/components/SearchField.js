import React from "react";
import {Input} from "antd";
import PropTypes from "prop-types";

SearchField.propTypes = {
    placeholder: PropTypes.string,
    width: PropTypes.number,
    onSearch: PropTypes.func.isRequired
}

export function SearchField(props) {
    const {placeholder, width, onSearch} = props;

    return (
        <Input.Search
            placeholder={placeholder || "Cari..."}
            allowClear
            enterButton
            onSearch={onSearch}
            style={{width: width || 200}}/>
    )
}