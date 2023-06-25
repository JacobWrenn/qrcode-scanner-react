import { useRef, useEffect, useState } from "react";
import "./Scanner.css";

export default function Scanner({ scanning }: { scanning: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [camera, setCamera] = useState(false);
  const playing = useRef(false);
  const tracks = useRef<MediaStreamTrack[]>([]);

  function play() {
    const videoElement = video.current as HTMLVideoElement;
    const canvasElement = canvas.current as HTMLCanvasElement;
    if (scanning) {
      videoElement.play();
      playing.current = true;
      canvasElement.setAttribute("width", videoElement.videoWidth.toString());
      canvasElement.setAttribute("height", videoElement.videoHeight.toString());
    }
  }

  function checkQR() {
    const imageElement = image.current as HTMLImageElement;
  }

  useEffect(() => {
    const videoElement = video.current as HTMLVideoElement;
    const imageElement = image.current as HTMLImageElement;

    function scanQR() {
      const canvasElement = canvas.current as HTMLCanvasElement;
      const context = canvasElement.getContext("2d");
      context?.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      imageElement.setAttribute("src", canvasElement.toDataURL("image/png"));
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
    } else {
      teardown();
    }

    return teardown;
  }, [scanning]);

  return (
    <div>
      <video ref={video} onCanPlay={play}></video>
      <canvas ref={canvas}></canvas>
      <img ref={image} onLoad={checkQR} alt="" />
      {!camera && <p>Camera access not granted!</p>}
    </div>
  );
}
