import React, {useState} from "react";
import {Button} from "antd";
import PropTypes from "prop-types";

ButtonToggle.propTypes = {
    component: PropTypes.node.isRequired,
    buttonProps: PropTypes.object,
    compProps: PropTypes.object
}

export function ButtonToggle(props) {
    const {component: Component, compProps, children, rest} = props;

    const [visible, setVisible] = useState(false);

    const show = () => setVisible(true);
    const close = () => setVisible(false);

    return (
        <>
            <Button onClick={show} {...rest}>
                {children}
            </Button>
            {visible && (
                <Component
                    visible={visible}
                    onClose={close}
                    {...compProps}
                />
            )}
        </>
    )
}