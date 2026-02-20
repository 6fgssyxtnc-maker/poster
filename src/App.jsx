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

  const downloadPoster = () => {
    alert("Download works — export logic can go here");
  };

  return (
    <div style={container}>
      <h2>Poster Generator</h2>

      {/* Upload */}
      <label style={buttonSecondary}>
        Choose Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files[0])}
          style={{ display: "none" }}
        />
      </label>

      {/* Download */}
      <button onClick={downloadPoster} style={buttonPrimary}>
        Download PNG
      </button>

      {/* Poster Preview */}
      <div style={previewWrapper}>
        {userImage && (
          <TransformWrapper
            ref={transformRef}
            minScale={0.5}
            maxScale={4}
            initialScale={1}
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

const container = {
  textAlign: "center",
  padding: 20,
  fontFamily: "Arial",
  maxWidth: 600,
  margin: "0 auto"
};

const previewWrapper = {
  width: "100%",
  aspectRatio: "1/1",
  position: "relative",
  overflow: "hidden",
  marginTop: 30,
  touchAction: "none"
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
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
