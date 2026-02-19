import { useState, useRef } from "react";
import { Rnd } from "react-rnd";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [position, setPosition] = useState({ x: 120, y: 120 });
  const [size, setSize] = useState({ width: 300, height: 300 });

  const posterRef = useRef(null);

  const handleImageUpload = (file) => {
    const url = URL.createObjectURL(file);
    setUserImage(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageObj(img);
    };
  };

  const downloadPoster = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    // Load poster background
    const poster = new Image();
    poster.src = "/poster-bg.png";
    poster.crossOrigin = "anonymous";

    poster.onload = () => {
      // Draw user image first
      if (imageObj) {
        ctx.drawImage(
          imageObj,
          position.x * 2,
          position.y * 2,
          size.width * 2,
          size.height * 2
        );
      }

      // Draw poster overlay
      ctx.drawImage(poster, 0, 0, 1080, 1080);

      const link = document.createElement("a");
      link.download = "facebook-poster.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Event Poster Generator</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />

      <br /><br />

      <div
        ref={posterRef}
        style={{
          width: 540,
          height: 540,
          position: "relative",
          overflow: "hidden"
        }}
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
            onResizeStop={(e, direction, ref, delta, pos) => {
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
