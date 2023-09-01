import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { io } from "socket.io-client";

import useStore from "../../useStore";
import Button from "../Button";
import NavBar from "../NavBar";
import SubNavBar from "../SubNavBar";

import { CONFIG } from "../../constants/config";

const TextCardDetail = ({ roomId, setRoomId }) => {
  const { text_id } = useParams();
  const { texts } = useStore();

  const result = texts.data
    ? texts.data.filter((text, index) => text._id === text_id)
    : [];

  const [textValue, setTextValue] = useState(roomId ? "" : texts);
  const [updateMode, setUpdateMode] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const navigate = useNavigate();

  const textareaRef = useRef(null);
  const socket = useRef();
  const typingTimerRef = useRef(null);

  const TYPING_INTERVAL = 2000;

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
      link.download = "legalpad.png";
      link.click();

      window.URL.revokeObjectURL(url);
    }, "image/png");
  };

  const navigateToMypage = () => {
    navigate("/mypage");
  };

  const updateText = async () => {
    try {
      let url;
      let method;

      if (text_id) {
        url = `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/texts/${text_id}`;
        method = "PUT";
      } else {
        url = `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/create`;
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: textValue }),
      });

      const data = await response.json();

      setUpdateMode(!updateMode);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteText = async () => {
    if (!text_id) {
      console.log("No text_id available to delete.");
      return;
    }

    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/texts/${text_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      navigateToMypage();
    } catch (error) {
      console.log(error);
    }
  };

  const handleContentChange = event => {
    const newValue = event.currentTarget.textContent;
    setTextValue(newValue);

    socket.current.emit("textChange", { roomId, text: newValue });
    socket.current.emit("typing", roomId);

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      setTypingUser(null);
    }, TYPING_INTERVAL);
  };

  useEffect(() => {
    socket.current = io(CONFIG.BACKEND_SERVER_URL);

    socket.current.emit("joinRoom", roomId);

    socket.current.emit("setUserName", {
      username: localStorage.getItem("userEmail"),
    });

    socket.current.on("textChanged", updatedText => {
      setTextValue(updatedText);
    });

    socket.current.on("userTyping", username => {
      setTypingUser(username);

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      typingTimerRef.current = setTimeout(() => {
        setTypingUser(null);
      }, TYPING_INTERVAL);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [roomId]);

  return (
    <>
      <div className="flex">
        <NavBar />
        <div
          className="w-screen h-screen flex flex-col"
          style={{ backgroundColor: "#F8F0E5" }}
        >
          <SubNavBar roomId={roomId} setRoomId={setRoomId} />
          <div
            className="flex flex-col w-3/4 h-3/4 m-auto rounded-md"
            style={{ backgroundColor: "#DAC0A3" }}
          >
            <div className="flex flex-col w-3/4 m-auto">
              <div className="bg-amber-700 w-full h-16 rounded-md text-center text-2xl font-semibold font-mono flex items-center justify-center">
                {typingUser
                  ? `${typingUser}가 입력 중입니다...`
                  : "Hello, legalPad!"}
              </div>

              {roomId ? (
                <div
                  className="p-3 bg-yellow-200 border border-gray-400 rounded-lg h-72 resize-none"
                  ref={textareaRef}
                  onInput={handleContentChange}
                  contentEditable={true}
                  style={{
                    lineHeight: "36px",
                    fontFamily: "Courier New",
                    color: "#000",
                    width: "100%",
                    background:
                      "linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px), #feef89",
                    backgroundSize: "100% 35px",
                    overflowY: "auto",
                  }}
                >
                  {textValue}
                </div>
              ) : (
                <div
                  className="p-3 bg-yellow-200 border border-gray-400 rounded-lg h-72 resize-none"
                  ref={textareaRef}
                  onInput={event =>
                    setTextValue(event.currentTarget.textContent)
                  }
                  contentEditable={true}
                  style={{
                    lineHeight: "36px",
                    fontFamily: "Courier New",
                    color: "#000",
                    width: "100%",
                    background:
                      "linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px), #feef89",
                    backgroundSize: "100% 35px",
                    overflowY: "auto",
                  }}
                >
                  {result.length > 0 ? result[0].content.join("\n") : ""}
                </div>
              )}
            </div>
            <div className="flex flex-col w-3/4 m-auto justify-between mt-0">
              {updateMode ? (
                <>
                  <Button
                    style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
                    onClick={handleDownloadClick}
                  >
                    다운로드
                  </Button>
                  <Button
                    style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
                    onClick={navigateToMypage}
                  >
                    {text_id ? "수정 완료" : "저장 완료"}
                  </Button>
                </>
              ) : (
                <Button
                  style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
                  onClick={updateText}
                >
                  {text_id ? "수정" : "저장"}
                </Button>
              )}

              <Button
                style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
                onClick={deleteText}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextCardDetail;
