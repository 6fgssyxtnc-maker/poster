import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const posterRef = useRef(null);

  // ✅ FIXED async export function
  const downloadPoster = async () => {
    if (!posterRef.current) return;

    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      scale: 4,              // High resolution export
      backgroundColor: null
    });

    const link = document.createElement("a");
    link.download = "facebook-poster.png";
    link.href = canvas.toDataURL("image/png", 1.0); // Max quality
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
    width: 540,
    height: 540,
    position: "relative",
    border: "1px solid #ccc",
    backgroundImage: "url('/poster-bg.png')",
    backgroundSize: "cover",
    overflow: "hidden"
  }}
>
  {/* Placeholder frame */}
  {!userImage && (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 250,
        height: 250,
        border: "3px dashed white",
        borderRadius: "10px",
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        padding: 10
      }}
    >
      Drag your photo here
    </div>
  )}

  {userImage && (
    <Rnd
      default={{
        x: 145,
        y: 145,
        width: 250,
        height: 250
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
      >
        {userImage && (
          <Rnd
            default={{
              x: 100,
              y: 100,
              width: 250,
              height: 250
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
