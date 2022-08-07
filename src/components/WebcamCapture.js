import React, {forwardRef} from 'react';
import Webcam from "react-webcam";
import useWindowSize from "../utils/useWindowSize";
import PropTypes from "prop-types";

WebcamCapture.propTypes = {
    facingMode: PropTypes.oneOf(["environment", "user"]),
    orientation: PropTypes.oneOf(["portrait", "landscape"])
}

function WebcamCapture(props, ref) {
    const {facingMode, orientation, ...rest} = props;
    
    const size = useWindowSize();
    const isLandscape = size.height <= size.width;
    const ratio = isLandscape ? 16 / 9 : 9 / 16;

    const videoConstraints = {
        facingMode: {exact: facingMode},
        aspectRatio: ratio
    }

    return (
        <Webcam
            audio={false}
            ref={ref}
            style={orientation === "landscape" ? {minWidth: size.width} : {minHeight: size.height}}
            screenshotFormat = "image/jpeg"
            forceScreenshotSourceSize="true"
            minScreenshotHeight={1200}
            minScreenshotWidth={1200}
            videoConstraints = {videoConstraints}
            {...rest}
        />
    )
}

export default forwardRef(WebcamCapture);