import React from "react";
import {Input} from "antd";

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