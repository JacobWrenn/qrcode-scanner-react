import { useRef, useEffect, useState } from "react";
import "./Scanner.css";
import scanner from "jsqrcode-ts";

export default function Scanner({
  scanning,
  scanSuccess,
  className,
}: {
  scanning: boolean;
  scanSuccess: (result: string) => void;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    const videoElement = video.current as HTMLVideoElement;
    videoElement.setAttribute("autoplay", "");
    videoElement.setAttribute("muted", "");
    videoElement.setAttribute("playsinline", "");

    async function scanQR() {
      const canvasElement = canvas.current as HTMLCanvasElement;
      if (canvasElement) {
        const context = canvasElement.getContext("2d", {
          willReadFrequently: true,
        });
        context?.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        try {
          scanSuccess(await scanner.scan(canvasElement));
        } catch {}
      }
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
      if (navigator && navigator.mediaDevices) {
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
        setCamera(false);
      }
    } else {
      teardown();
    }

    return teardown;
  }, [scanning, scanSuccess]);

  return (
    <div id="qrcode-scanner-react-div">
      <video
        ref={video}
        onCanPlay={play}
        className={className ? className : ""}
        id="qrcode-scanner-react-video"
      ></video>
      <canvas ref={canvas} id="qrcode-scanner-react-canvas"></canvas>
      {!camera && (
        <p id="qrcode-scanner-react-p">Failed to get camera access!</p>
      )}
    </div>
  );
}
