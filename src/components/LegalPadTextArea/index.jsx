import { useRef } from "react";

import useStore from "../../useStore";

import Button from "../Button";

import { CONFIG } from "../../constants/config";

const LegalPadTextArea = () => {
  const { textValue, setTextValue } = useStore();

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
    } catch (error) {
      console.log("Image upload error", error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-evenly w-3/4">
        <div className="relative">
          <div className="bg-amber-700 w-full h-1/6 rounded-md text-center line leading-10 text-2xl">
            Hello, legalPad!
          </div>
          <textarea
            className="p-3 bg-yellow-200 border border-gray-400 rounded-lg h-72 resize-none text-center"
            ref={textareaRef}
            onChange={event => setTextValue(event.target.value)}
            style={{
              lineHeight: "34px",
              fontFamily: "Courier New",
              color: "#000",
              width: "100%",
            }}
            placeholder="메모하고 싶은 내용을 적고 저장 버튼이나 다운로드 버튼을 누르세요"
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

export default LegalPadTextArea;
