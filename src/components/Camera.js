import React, {useState} from 'react';

function Camera(props) {

    const [playing, setPlaying] = useState(false);

    const HEIGHT = 560;
    const WIDTH = 720;

    const startVideo = () => {
        setPlaying(true);
        navigator.getUserMedia(
            {
                video: true,
            },
            (stream) => {
                let video = document.getElementsByClassName('videoFeed')[0];
                if (video) {
                    video.srcObject = stream;
                }
            },
            (err) => console.error(err)
        );
    };

    const stopVideo = () => {
        setPlaying(false);
        let video = document.getElementsByClassName('videoFeed')[0];
        video.srcObject.getTracks()[0].stop();
    };

    return (
        <div>
            <div className="container">
                <video
                    height={HEIGHT}
                    width={WIDTH}
                    muted
                    autoPlay
                    className="videoFeed"
                />
            </div>
            <div className="input">
                {playing ? (
                    <button onClick={stopVideo}>Stop</button>
                ) : (
                    <button onClick={startVideo}>Start</button>
                )}
            </div>
        </div>
    );
}

export default Camera;
