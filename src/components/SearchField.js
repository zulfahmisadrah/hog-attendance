import React from "react";
import {Input} from "antd";
import PropTypes from "prop-types";

SearchField.propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func.isRequired
}

export function SearchField(props) {
    const {placeholder, onSearch} = props;

    return (
        <Input.Search
            placeholder={placeholder || "Cari..."}
            allowClear
            enterButton
            onSearch={onSearch}
            style={{width: 200}}/>
    )
}