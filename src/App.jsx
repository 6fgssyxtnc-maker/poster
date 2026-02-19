import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const posterRef = useRef(null);

  const downloadPoster = async () => {
    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      scale: 4
    });

    const link = document.createElement("a");
    link.download = "facebook-poster.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const handleDrag = (e) => {
    setPosition({
      x: position.x + e.movementX,
      y: position.y + e.movementY
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Event Poster Generator</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setUserImage(URL.createObjectURL(e.target.files[0]))
        }
      />

      {userImage && (
        <>
          <div style={{ marginTop: 10 }}>
            Zoom:
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
          </div>
        </>
      )}

      <br />

      <div
        ref={posterRef}
        style={{
          width: 540,
          height: 540,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <img
          src="/poster-bg.png"
          alt="poster"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
        />

        {userImage && (
          <div
            onMouseDown={(e) => {
              const move = (ev) => handleDrag(ev);
              const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: "grab"
            }}
          >
            <img
              src={userImage}
              alt="user"
              style={{
                width: 300,
                height: 300,
                objectFit: "cover",
                borderRadius: 20
              }}
            />
          </div>
        )}
      </div>

      <br />

      <button onClick={downloadPoster}>Download PNG</button>
    </div>
  );
}
