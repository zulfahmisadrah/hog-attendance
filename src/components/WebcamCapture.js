import React, {forwardRef} from 'react';
import Webcam from "react-webcam";
import useWindowSize from "../utils/useWindowSize";

function WebcamCapture(props, ref) {
    const size = useWindowSize();
    const isLandscape = size.height <= size.width;
    const ratio = isLandscape ? size.width / size.height : size.height / size.width;

    const videoConstraints = {
        facingMode: {exact: "environment"},
        aspectRatio: ratio
    }

    return (
        <Webcam
            audio={false}
            ref={ref}
            // height={size.height}
            width={size.width}
            screenshotFormat = "image/jpeg"
            forceScreenshotSourceSize="true"
            minScreenshotHeight={1200}
            minScreenshotWidth={1200}
            videoConstraints = {videoConstraints}
            {...props}
        />
    )
}

export default forwardRef(WebcamCapture);