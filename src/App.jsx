import { useState, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent
} from "react-zoom-pan-pinch";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const transformRef = useRef(null);

  const handleUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserImage(url);
  };

  const downloadPoster = async () => {
    if (!userImage) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = userImage;

    const poster = new Image();
    poster.src = "/poster-bg.png";
    poster.crossOrigin = "anonymous";

    await new Promise((resolve) => (image.onload = resolve));
    await new Promise((resolve) => (poster.onload = resolve));

    const { scale, positionX, positionY } =
      transformRef.current.state;

    ctx.save();
    ctx.translate(positionX * (1080 / 500), positionY * (1080 / 500));
    ctx.scale(scale * (1080 / 500), scale * (1080 / 500));
    ctx.drawImage(image, 0, 0, 1080, 1080);
    ctx.restore();

    ctx.drawImage(poster, 0, 0, 1080, 1080);

    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={containerStyle}>
      <h2>Poster Generator</h2>

      <label style={buttonSecondary}>
        Choose Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files[0])}
          style={{ display: "none" }}
        />
      </label>

      <button onClick={downloadPoster} style={buttonPrimary}>
        Download PNG
      </button>

      <div style={previewWrapper}>
        {userImage && (
          <TransformWrapper
            ref={transformRef}
            minScale={0.5}
            maxScale={4}
            initialScale={1}
            doubleClick={{ disabled: true }}
            pinch={{ step: 5 }}
          >
            <TransformComponent>
              <img
                src={userImage}
                alt="user"
                style={imageStyle}
              />
            </TransformComponent>
          </TransformWrapper>
        )}

        <img
          src="/poster-bg.png"
          alt="poster"
          style={overlayStyle}
        />
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const containerStyle = {
  textAlign: "center",
  padding: 20,
  fontFamily: "Arial"
};

const previewWrapper = {
  width: "100%",
  maxWidth: 500,
  margin: "30px auto",
  aspectRatio: "1/1",
  position: "relative",
  overflow: "hidden",
  touchAction: "none"
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const overlayStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  pointerEvents: "none"
};

const buttonPrimary = {
  width: 260,
  height: 50,
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  margin: "10px auto",
  display: "block",
  cursor: "pointer"
};

const buttonSecondary = {
  width: 260,
  height: 50,
  background: "#e5e5e5",
  color: "#000",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  margin: "10px auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer"
};
