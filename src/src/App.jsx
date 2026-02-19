import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const posterRef = useRef(null);

  const downloadPoster = async () => {
    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      scale: 2
    });

    const link = document.createElement("a");
    link.download = "facebook-poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(
      "I’m attending Baltic Business Forum 2025 🚀 Join me! #BBF2025"
    );
    alert("Caption copied!");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Event Poster Generator</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setUserImage(URL.createObjectURL(e.target.files[0]))
        }
      />

      <br /><br />

      <div
        ref={posterRef}
        style={{
          width: 1080,
          height: 1080,
          position: "relative",
          border: "1px solid #ccc",
          backgroundImage: "url('https://via.placeholder.com/1080x1080.png?text=YOUR+OFFICIAL+POSTER')",
          backgroundSize: "cover",
          overflow: "hidden"
        }}
      >
        {userImage && (
          <Rnd
            default={{
              x: 300,
              y: 300,
              width: 400,
              height: 400
            }}
            bounds="parent"
          >
            <img
              src={userImage}
              alt="user"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />
          </Rnd>
        )}
      </div>

      <br />

      <button onClick={downloadPoster}>
        Download PNG
      </button>

      <button
        onClick={copyCaption}
        style={{ marginLeft: 10 }}
      >
        Copy Caption
      </button>
    </div>
  );
}
