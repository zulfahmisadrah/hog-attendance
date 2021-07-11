import React, {useRef} from 'react';
import styled from "styled-components";
import {useParams} from "react-router";
import Webcam from "react-webcam";

const StyledDiv = styled.div`
  .fullscreen-center {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 9;
    width: 640px;
    height: 480px;
  }
  
  .full {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

`

function TakePresence() {
    let {meetingId} = useParams()

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const detect = () => {
        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video
            const videoWidth = webcamRef.current.video.videoWidth
            const videoHeight = webcamRef.current.video.videoHeight

            webcamRef.current.video.width = videoWidth
            webcamRef.current.video.heigth = videoHeight

            canvasRef.current.width = videoWidth
            canvasRef.current.height = videoHeight
        }
    }

    const videoConstraints = {
        facingMode: {exact: "environment"}
    };

    const mtcnnForwardParams = {
        // number of scaled versions of the input image passed through the CNN
        // of the first stage, lower numbers will result in lower inference time,
        // but will also be less accurate
        maxNumScales: 10,
        // scale factor used to calculate the scale steps of the image
        // pyramid used in stage 1
        scaleFactor: 0.709,
        // the score threshold values used to filter the bounding
        // boxes of stage 1, 2 and 3
        scoreThresholds: [0.6, 0.7, 0.7],
        // mininum face size to expect, the higher the faster processing will be,
        // but smaller faces won't be detected
        minFaceSize: 20
    }

    const init = async () => {


    }





    return (
        <StyledDiv>
            <Webcam
                audio={false}
                ref={webcamRef}
                className="fullscreen-center"
            />
            <canvas id="overlay" ref={canvasRef} className="fullscreen-center"/>
        </StyledDiv>
    )
}

export default TakePresence;