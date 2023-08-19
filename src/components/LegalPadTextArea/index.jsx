import { useState, useRef } from "react";

import Button from "../Button";
const LegalpadTextarea = () => {
  const [textValue, setTextValue] = useState("");
  const textareaRef = useRef(null);

  const handleDownloadClick = () => {
    const canvas = document.createElement("canvas");
    canvas.width = textareaRef.current.offsetWidth;
    canvas.height = textareaRef.current.offsetHeight;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f7e79e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";

    for (let i = 0; i < canvas.height; i += 24) {
      ctx.fillRect(0, i + 21, canvas.width, 1);
    }

    ctx.fillStyle = "#333";
    ctx.font = "18px Courier New";

    const lines = textValue.split("\n");

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 15, 30 + i * 24);
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

  return (
    <div className="flex justify-around">
      <textarea
        className="p-3 bg-yellow-200 border border-gray-400 rounded-lg w-full h-48 resize-none"
        ref={textareaRef}
        value={textValue}
        onChange={e => setTextValue(e.target.value)}
        placeholder="Start typing here..."
      />
      <Button
        style={"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"}
        onClick={handleDownloadClick}
      >
        Save as PNG
      </Button>
    </div>
  );
};

export default LegalpadTextarea;
