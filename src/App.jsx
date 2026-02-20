import { useState, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent
} from "react-zoom-pan-pinch";
import html2canvas from "html2canvas";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const posterRef = useRef(null);

  const handleUpload = (file) => {
    if (!file) return;
    setUserImage(URL.createObjectURL(file));
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;

    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      scale: 3
    });

    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Poster Generator</h2>

      <label style={btn}>
        Choose Image
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </label>

      <button style={btn} onClick={downloadPoster}>
        Download PNG
      </button>

      <div
        ref={posterRef}
        style={{
          marginTop: 30,
          width: "100%",
          maxWidth: 500,
          aspectRatio: "1/1",
          marginInline: "auto",
          overflow: "hidden",
          position: "relative",
          touchAction: "none",
          background: "#fff"
        }}
      >
        {userImage && (
          <TransformWrapper>
            <TransformComponent>
              <img
                src={userImage}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </TransformComponent>
          </TransformWrapper>
        )}

        <img
          src="/poster-bg.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none"
          }}
        />
      </div>
    </div>
  );
}

const btn = {
  width: 260,
  height: 50,
  margin: "10px auto",
  display: "block",
  borderRadius: 12,
  border: "none",
  fontSize: 16,
  cursor: "pointer"
};
