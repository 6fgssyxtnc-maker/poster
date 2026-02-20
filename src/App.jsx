import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [position, setPosition] = useState({ x: 240, y: 240 });
  const [size, setSize] = useState({ width: 600, height: 600 });
  const [scale, setScale] = useState(0.5);

  // ✅ Responsive scale without using zoom
  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      const newScale = screenWidth < 600 ? screenWidth / 1080 : 0.6;
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleUpload = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUserImage(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageObj(img);

      // ✅ Auto fit image inside 1080 canvas without distortion
      const maxSize = 800;
      const ratio = img.width / img.height;

      if (ratio > 1) {
        setSize({
          width: maxSize,
          height: maxSize / ratio
        });
      } else {
        setSize({
          width: maxSize * ratio,
          height: maxSize
        });
      }

      setPosition({ x: 140, y: 140 });
    };
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
      // ✅ Draw user image FIRST
      if (imageObj) {
        ctx.drawImage(
          imageObj,
          position.x,
          position.y,
          size.width,
          size.height
        );
      }

      // ✅ Draw poster overlay on top
      ctx.drawImage(poster, 0, 0, 1080, 1080);

      const link = document.createElement("a");
      link.download = "poster.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        textAlign: "center"
      }}
    >
      <h2>Poster Generator</h2>

      {/* Upload Button */}
      <label style={buttonStyleSecondary}>
        Choose Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files[0])}
          style={{ display: "none" }}
        />
      </label>

      {/* Download Button */}
      <button onClick={downloadPoster} style={buttonStylePrimary}>
        Download PNG
      </button>

      <br />
      <br />

      {/* Responsive scaled preview */}
      <div
        style={{
          width: 1080 * scale,
          height: 1080 * scale,
          margin: "0 auto",
          position: "relative"
        }}
      >
        <div
          style={{
            width: 1080,
            height: 1080,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          {userImage && (
            <Rnd
              size={size}
              position={position}
              bounds="parent"
              lockAspectRatio
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
                  objectFit: "contain" // ✅ NO distortion
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
      </div>
    </div>
  );
}

/* ✅ BUTTON STYLES */
const buttonStylePrimary = {
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

const buttonStyleSecondary = {
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
