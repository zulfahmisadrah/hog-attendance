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
    const ratio = isLandscape ? size.width / size.height : size.height / size.width;

    const videoConstraints = {
        facingMode: {exact: facingMode},
        aspectRatio: ratio
    }

    return (
        <Webcam
            audio={false}
            ref={ref}
            style={orientation === "landscape" ? {maxWidth: size.width} : {maxHeight: size.height}}
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