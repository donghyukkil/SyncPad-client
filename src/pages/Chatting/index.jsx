import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";

import { CONFIG } from "../../constants/config";
import NavBar from "../../components/NavBar";
import SubNavBar from "../../components/SubNavBar";
import Button from "../../components/Button";

const Chatting = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = useRef();

  const captureDivRef = useRef(null);

  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

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
    const canvasHeight = captureDivRef.current.offsetHeight;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f7e79e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.font = "18px Courier New";

    messages.forEach((message, i) => {
      const y = padding + i * lineHeight;
      ctx.fillText(message, padding, y + lineHeight);
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
      <div className="bg-yellow-300 w-screen h-screen flex flex-col">
        <SubNavBar />
        <div className="flex flex-col justify-evenly bg-teal-950 w-3/4 h-3/4 m-auto py-0 rounded-md">
          <div className="h-full w-2/3 m-auto my-20 p-0">
            <div className="bg-red-400 w-full h-10 text-center line leading-10 text-2xl rounded-md">
              Hello, legalPad!
            </div>
            <div
              className="p-3 bg-red-200 border border-gray-400 h-full w-full overflow-auto"
              style={{
                lineHeight: "28px",
                fontSize: "20px",
                fontFamily: "Courier New",
              }}
              ref={captureDivRef}
            >
              <ul>
                {messages.map((message, index) => (
                  <div key={index}>
                    <li
                      key={index}
                      style={{
                        color: stringToColor(message),
                      }}
                    >
                      {message}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="메시지를 입력하고 엔터를 누르세요."
                className="text-center h-14"
              />
            </form>
          </div>
          <div className="flex flex-col justify-around w-2/3 m-auto my-10 space-y-4">
            <Button
              style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg p-0"
              onClick={handleDownloadClick}
            >
              다운로드
            </Button>
            <Button
              style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg p-0"
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
