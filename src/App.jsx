import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [position, setPosition] = useState({ x: 240, y: 240 });
  const [size, setSize] = useState({ width: 600, height: 600 });
  const [scale, setScale] = useState(1);

  // Responsive scale calculation
  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth - 40; // padding
      const newScale = Math.min(screenWidth / 1080, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

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
        const scaleFactor = 1 / scale;

        ctx.drawImage(
          imageObj,
          position.x * scaleFactor,
          position.y * scaleFactor,
          size.width * scaleFactor,
          size.height * scaleFactor
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
    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        textAlign: "center"
      }}
    >
      <h2>Poster Generator</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      <br /><br />

      <button
        onClick={downloadPoster}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        Download PNG
      </button>

      <br /><br />

      {/* Responsive Preview */}
      <div
        style={{
          width: 1080,
          height: 1080,
          position: "relative",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          margin: "0 auto"
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
    </div>
  );
}
