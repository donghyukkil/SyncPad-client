import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";

import NavBar from "../../components/NavBar";
import SubNavBar from "../../components/SubNavBar";
import Button from "../../components/Button";

import { CONFIG } from "../../constants/config";

const Chatting = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = useRef();

  const captureDivRef = useRef(null);

  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  const USER_COLOR = "#3498db";
  const OTHERS_COLOR = "#e74c3c";

  const stringToColor = string => {
    let hash = 0;

    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }

    return color;
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (socket.current && text.trim()) {
      const formattedMessage = `${userEmail}: ${text}`;
      socket.current.emit("chat message", formattedMessage);
      setMessages(prevMessage => [...prevMessage, formattedMessage]);
      setText("");
    }
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
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: messages }),
        },
      );

      nagigateToMypage();
    } catch (error) {
      console.log("메시지 업로드 오류", error.message);
    }
  };

  const nagigateToMypage = () => {
    navigate("/mypage");
  };

  useEffect(() => {
    socket.current = io(CONFIG.BACKEND_SERVER_URL);

    socket.current.on("chat message", message => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [messages]);

  return (
    <div className="flex">
      <NavBar />
      <div
        className="w-screen h-screen flex flex-col"
        style={{ backgroundColor: "#F8F0E5" }}
      >
        <SubNavBar />
        <div
          className="flex flex-col justify-evenly w-3/4 h-3/4 m-auto py-2 rounded-md"
          style={{ backgroundColor: "#DAC0A3" }}
        >
          <div className="h-3/4 w-3/4 m-auto my-4">
            <div className="bg-amber-700 w-full h-16 rounded-md text-center line text-2xl font-semibold font-mono flex items-center justify-center">
              Hello, legalPad!
            </div>
            <div
              className="p-3 bg-yellow-200 border rounded-lg h-72 overflow-y-auto"
              style={{
                lineHeight: "33px",
                fontSize: "25px",
                fontFamily: "Courier New",
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px), #feef89",
                backgroundSize: "100% 35px",
              }}
              ref={captureDivRef}
            >
              <ul>
                {messages.map((message, index) => {
                  const email = message.split(":")[0];
                  const color = email === userEmail ? USER_COLOR : OTHERS_COLOR;

                  return (
                    <div key={index}>
                      <li
                        key={index}
                        style={{
                          color: color,
                        }}
                      >
                        {message}
                      </li>
                    </div>
                  );
                })}
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="메시지를 입력하고 엔터를 누르세요."
                className="text-center h-12 rounded-md"
              />
            </form>
          </div>
          <div className="flex flex-col justify-around w-3/4 m-auto space-y-10 py-5">
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
        </div>
      </div>
    </div>
  );
};

export default Chatting;
