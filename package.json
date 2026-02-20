import { useState } from "react";
import {
  TransformWrapper,
  TransformComponent
} from "react-zoom-pan-pinch";

export default function App() {
  const [userImage, setUserImage] = useState(null);

  const handleUpload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserImage(url);
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
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

      <br /><br />

      <div
        style={{
          width: "100%",
          maxWidth: 500,
          margin: "0 auto",
          aspectRatio: "1/1",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {userImage && (
          <TransformWrapper
            minScale={0.5}
            maxScale={4}
            initialScale={1}
            pinch={{ step: 5 }}
          >
            <TransformComponent>
              <img
                src={userImage}
                alt="user"
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
    </div>
  );
}

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
