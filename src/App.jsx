import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const posterRef = useRef(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;

    const canvas = await html2canvas(posterRef.current, {
      useCORS: true,
      scale: 4,
      backgroundColor: null
    });

    const link = document.createElement("a");
    link.download = "facebook-poster.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(
      "I’m attending LĪDERE Akadēmija 🚀 Join me! #Lidere"
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
          overflow: "hidden"
        }}
      >
        {/* Poster background */}
        <img
          src="/poster-bg.png"
          alt="poster"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0
          }}
        />

        {/* User image on top */}
        {userImage && (
          <Rnd
            default={{
              x: 100,
              y: 100,
              width: 250,
              height: 250
            }}
            bounds="parent"
            lockAspectRatio={true}  // prevents distortion
          >
            <img
              src={userImage}
              alt="user"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px"
              }}
            />
          </Rnd>
        )}

        {/* Placeholder box */}
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
              borderRadius: "12px",
              backgroundColor: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              padding: 20
            }}
          >
            Upload your photo
          </div>
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
