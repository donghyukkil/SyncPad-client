import { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import useStore from "../../useStore";

import Button from "../Button";

import { CONFIG } from "../../constants/config";

const LegalPadTextArea = () => {
  const { textValue, setTextValue } = useStore();
  const [messages, setMessages] = useState([]);

  const captureDivRef = useRef(null);
  const navigate = useNavigate();

  const navigateToMypage = () => {
    navigate("/mypage");
  };

  const handleDownloadClick = () => {
    const lineHeight = 36;
    const padding = 15;

    const canvasWidth = captureDivRef.current.offsetWidth;

    const ctxTest = document.createElement("canvas").getContext("2d");
    ctxTest.font = "18px Courier New";

    let totalLines = [];

    messages.forEach(message => {
      let words = message.split(" ");
      let line = "";
      let linesForMessage = [];

      words.forEach(word => {
        const testLine = line + word + " ";
        const metrics = ctxTest.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > canvasWidth - 2 * padding && line.length > 0) {
          linesForMessage.push(line);
          line = word + " ";
        } else {
          line = testLine;
        }
      });

      linesForMessage.push(line);
      totalLines = totalLines.concat(linesForMessage);
    });

    const canvasHeight = totalLines.length * lineHeight + 2 * padding;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f7e79e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.font = "18px Courier New";

    totalLines.forEach((line, i) => {
      const y = padding + i * lineHeight;
      ctx.fillText(line, padding, y + lineHeight);
      ctx.fillRect(padding, y + lineHeight - 1, canvasWidth - 2 * padding, 1);
    });

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
      const divContent = captureDivRef.current.innerHTML;

      const regex = /<li[^>]*>([^<]+)<\/li>/g;

      let matches;
      let results = [];

      while ((matches = regex.exec(divContent)) !== null) {
        results.push(matches[1]);
      }

      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: results }),
        },
      );

      navigateToMypage();
    } catch (error) {
      console.log("Image upload error", error.message);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    setMessages([...messages, textValue]);
    setTextValue("");
  };

  return (
    <>
      <div className="flex flex-col justify-around w-3/4">
        <div className="relative">
          <div className="bg-amber-700 w-full h-1/6 rounded-md text-center line text-2xl font-semibold font-mono flex items-center justify-center">
            Hello, legalPad!
          </div>
          <div
            style={{
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px), #feef89",
              backgroundSize: "100% 35px",
            }}
            className="p-3 w-full rounded-md h-72 overflow-y-auto border"
            ref={captureDivRef}
          >
            <ul>
              {messages.map((message, index) => (
                <li
                  key={index}
                  style={{
                    lineHeight: "34px",
                    fontFamily: "Courier New",
                    color: "#000",
                  }}
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              className="p-3 rounded-md w-full text-center"
              value={textValue}
              onChange={event => setTextValue(event.target.value)}
              style={{
                fontFamily: "Courier New",
                color: "#000",
              }}
              placeholder="메모하고 싶은 내용을 적고 엔터를 누르세요."
            />
          </form>
        </div>
        <Button
          style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
          onClick={handleDownloadClick}
        >
          다운로드
        </Button>
        <Button
          style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
          onClick={createTextToServer}
        >
          저장
        </Button>
      </div>
    </>
  );
};

export default LegalPadTextArea;
