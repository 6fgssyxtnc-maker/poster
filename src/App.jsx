import { useState, useRef } from "react";
import { Rnd } from "react-rnd";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [position, setPosition] = useState({ x: 240, y: 240 });
  const [size, setSize] = useState({ width: 600, height: 600 });

  const posterRef = useRef(null);

  const handleUpload = (file) => {
    const url = URL.createObjectURL(file);
    setUserImage(url);

    const img = new Image();
    img.src = url;
    img.onload = () => setImageObj(img);
  };

  const downloadPoster = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    const poster = new Image();
    poster.src = "/poster-bg.png";
    poster.crossOrigin = "anonymous";

    poster.onload = () => {
      if (imageObj) {
      const imgRatio = imageObj.width / imageObj.height;
const boxRatio = size.width / size.height;

let drawWidth = size.width;
let drawHeight = size.height;

if (imgRatio > boxRatio) {
  // image is wider
  drawHeight = size.width / imgRatio;
} else {
  // image is taller
  drawWidth = size.height * imgRatio;
}

ctx.drawImage(
  imageObj,
  position.x,
  position.y,
  drawWidth,
  drawHeight
);
      }

      ctx.drawImage(poster, 0, 0, 1080, 1080);

      const link = document.createElement("a");
      link.download = "facebook-poster.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Poster Generator</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      <br /><br />

    <div
  style={{
    width: 540,
    height: 540,
    overflow: "hidden"
  }}
>
  <div
    style={{
      width: 1080,
      height: 1080,
      position: "relative",
      transform: "scale(0.5)",
      transformOrigin: "top left"
    }}
  >
      >
        {userImage && (
          <Rnd
            size={size}
            position={position}
            bounds="parent"
            lockAspectRatio={true}
            onDragStop={(e, d) =>
              setPosition({ x: d.x, y: d.y })
            }
            onResizeStop={(e, dir, ref, delta, pos) => {
              setSize({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height)
              });
              setPosition(pos);
            }}
          >
            <img
              src={userImage}
              alt="user"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </Rnd>
        )}

        <img
          src="/poster-bg.png"
          alt="poster"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            pointerEvents: "none"
          }}
        />
      </div>

      <br />

      <button onClick={downloadPoster}>
        Download PNG
      </button>
    </div>
  );
}
