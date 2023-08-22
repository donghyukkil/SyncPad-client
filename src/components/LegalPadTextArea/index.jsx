import { useState, useRef } from "react";
import Button from "../Button";

import { CONFIG } from "../../constants/config";

const LegalpadTextarea = ({ text }) => {
  const [textValue, setTextValue] = useState(text);
  const textareaRef = useRef(null);

  const handleDownloadClick = () => {
    const lineHeight = 36;
    const padding = 15;
    const lines = textValue.split("\n");
    const lineCount = lines.length;
    const canvasHeight = lineCount * lineHeight + 2 * padding;

    const canvas = document.createElement("canvas");
    canvas.width = textareaRef.current.offsetWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f7e79e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "18px Courier New";

    for (let i = 0; i < lines.length; i++) {
      const y = padding + i * lineHeight;
      ctx.fillText(lines[i], padding, y + lineHeight);
      ctx.fillRect(padding, y + lineHeight - 1, canvas.width - 2 * padding, 1);
    }

    canvas.toBlob(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "textarea_content.png";
      link.click();

      window.URL.revokeObjectURL(url);
    }, "image/png");
  };

  const createTextToServer = async () => {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: textValue }),
        },
      );

      const data = await response.json();
    } catch (error) {
      console.log("Image upload error", error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-evenly w-3/4">
        <div className="relative">
          <textarea
            className="p-3 bg-yellow-200 border border-gray-400 rounded-lg h-48 resize-none"
            ref={textareaRef}
            onChange={event => setTextValue(event.target.value)}
            style={{
              lineHeight: "36px",
              fontFamily: "Courier New",
              color: "#000",
              width: "100%",
            }}
          />
        </div>
        <Button
          style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg p-0"
          onClick={handleDownloadClick}
        >
          다운로드
        </Button>
        <Button
          style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg"
          onClick={createTextToServer}
        >
          저장
        </Button>
      </div>
    </>
  );
};

export default LegalpadTextarea;
