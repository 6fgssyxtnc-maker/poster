import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";

export default function App() {
  const [userImage, setUserImage] = useState(null);
  const posterRef = useRef(null);

  const downloadPoster = async () => {
  if (!posterRef.current) return;

  const element = posterRef.current;

  // Save original size
  const originalWidth = element.style.width;
  const originalHeight = element.style.height;

  // Temporarily enlarge to full resolution
  element.style.width = "1080px";
  element.style.height = "1080px";

  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 1,
    backgroundColor: null
  });

  // Restore original size
  element.style.width = originalWidth;
  element.style.height = originalHeight;

  const link = document.createElement("a");
  link.download = "facebook-poster.png";
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
};

    const link = document.createElement("a");
    link.download = "facebook-poster.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
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
        {/* USER IMAGE - bottom layer */}
        {userImage && (
          <Rnd
            default={{
              x: 120,
              y: 120,
              width: 300,
              height: 300
            }}
            bounds="parent"
            lockAspectRatio={true}
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

        {/* POSTER PNG - top layer */}
        <img
          src="/poster-bg.png"
          alt="poster"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            pointerEvents: "none"   // important
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
