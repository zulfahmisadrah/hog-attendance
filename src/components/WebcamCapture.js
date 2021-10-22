import React, {forwardRef} from 'react';
import Webcam from "react-webcam";

function WebcamCapture(props, ref) {

    const videoConstraints = {
        facingMode: {exact: "environment"}
    }

    return (
        <Webcam
            audio={false}
            ref={ref}
            screenshotFormat = "image/jpeg"
            videoConstraints = {videoConstraints}
            {...props}
        />
    )
}

export default forwardRef(WebcamCapture);