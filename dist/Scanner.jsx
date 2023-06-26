import { useRef, useEffect, useState } from "react";
import "./Scanner.css";
import getReader from "jsqrcode-ts";
export default function Scanner({ scanning, scanSuccess, }) {
    const video = useRef(null);
    const canvas = useRef(null);
    const [camera, setCamera] = useState(false);
    const playing = useRef(false);
    const tracks = useRef([]);
    function play() {
        const videoElement = video.current;
        const canvasElement = canvas.current;
        if (scanning) {
            videoElement.play();
            playing.current = true;
            canvasElement.setAttribute("width", videoElement.videoWidth.toString());
            canvasElement.setAttribute("height", videoElement.videoHeight.toString());
        }
    }
    useEffect(() => {
        const videoElement = video.current;
        videoElement.setAttribute("autoplay", "");
        videoElement.setAttribute("muted", "");
        videoElement.setAttribute("playsinline", "");
        function scanQR() {
            const canvasElement = canvas.current;
            const context = canvasElement.getContext("2d", {
                willReadFrequently: true,
            });
            context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            const reader = getReader();
            try {
                scanSuccess(reader.decode(canvasElement));
            }
            catch { }
        }
        const interval = setInterval(() => {
            if (playing) {
                scanQR();
            }
        }, 100);
        const teardown = () => {
            clearInterval(interval);
            playing.current = false;
            if (tracks.current.length > 0) {
                videoElement.pause();
                for (let track of tracks.current) {
                    track.stop();
                }
            }
        };
        if (scanning) {
            setCamera(true);
            tracks.current = [];
            navigator.mediaDevices
                .getUserMedia({
                video: { facingMode: "environment" },
            })
                .then((stream) => {
                stream.getTracks().forEach((track) => {
                    tracks.current.push(track);
                });
                videoElement.muted = true;
                videoElement.srcObject = stream;
            })
                .catch(() => {
                setCamera(false);
            });
        }
        else {
            teardown();
        }
        return teardown;
    }, [scanning, scanSuccess]);
    return (<div>
      <video ref={video} onCanPlay={play}></video>
      <canvas ref={canvas}></canvas>
      {!camera && <p>Camera access not granted!</p>}
    </div>);
}