import React from "react";
import {Avatar, Modal} from "antd";
import PropTypes from "prop-types";

AvatarModal.propTypes = {
    url: PropTypes.string.isRequired,
    shape: PropTypes.oneOf(["circle", "squre"]),
    size: PropTypes.number
}

export function AvatarModal(props) {
    const {url, shape, size, ...rest} = props;

    const handleClick = () => {
        return Modal.info({
            okText: 'Tutup',
            icon: null,
            content: (
                <a href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt="avatar" style={{maxWidth: "100%"}}/>
                </a>
            )
        })
    }

    return (
        <Avatar shape={shape || "circle"} size={size || 40} src={url} onClick={handleClick} {...rest}/>
    )
}
