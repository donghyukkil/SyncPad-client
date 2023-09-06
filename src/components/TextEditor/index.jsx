import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { io } from "socket.io-client";

import useStore from "../../useStore";

import Button from "../Button";
import NavBar from "../NavBar";
import SubNavBar from "../SubNavBar";

import { CONFIG } from "../../constants/config";

import {
  convertHTMLToPlainText,
  convertPlainTextToHTML,
  handleContentChange,
  showProfileImage,
  removeProfileImage,
} from "../../utils/selectionUtils";

import { handleDownloadClick } from "../../utils/textAction";

const TextEditor = ({ roomId }) => {
  const { text_id, shareRoomId } = useParams();
  const { texts, setRoomId } = useStore();

  let result = texts.data
    ? texts.data.filter((text, index) => text._id === text_id)
    : [];

  const [updateMode, setUpdateMode] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const resultText = result.length > 0 ? result[0].content.join("\n") : "";
  const initialTextValue = shareRoomId ? "" : resultText;
  const [textValue, setTextValue] = useState(initialTextValue);
  const [backgroundColor, setBackgroundColor] = useState("#f7e79e");

  const navigate = useNavigate();

  const textareaRef = useRef(null);

  if (!!shareRoomId) {
    roomId = shareRoomId;

    result = texts.data
      ? texts.data.filter((text, index) => text._id === roomId)
      : [];
  }

  const socket = useRef();
  const typingTimerRef = useRef(null);

  const bgColor = result?.[0]?.backgroundColor
    ? result[0].backgroundColor
    : backgroundColor;

  const handleInputChange = event => {
    handleContentChange(
      event,
      setTextValue,
      socket,
      roomId,
      typingTimerRef,
      TYPING_INTERVAL,
      textareaRef,
      setTypingUser,
    );
  };

  const TYPING_INTERVAL = 300;

  const navigateToMypage = () => {
    navigate("/mypage");
  };

  const updateText = async () => {
    try {
      let url;
      let method;

      const plainTextContent = convertHTMLToPlainText(textValue);

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
        body: JSON.stringify({ content: plainTextContent, backgroundColor }),
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

  const createNewRoom = async () => {
    try {
      const response = await fetch(`${CONFIG.BACKEND_SERVER_URL}/createRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_id,
          userId: localStorage.getItem("userEmail"),
        }),
      });
      const data = await response.json();
      if (data) {
        const roomURL = `${window.location.origin}/room/${data.data.room.textId}`;

        try {
          await navigator.clipboard.writeText(roomURL);
          console.log("URL이 클립보드에 복사되었습니다.");
        } catch (err) {
          console.error("클립보드 복사 실패:", err);
        }

        navigate(`/room/${data.data.room.textId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const targetRoomId = shareRoomId || roomId || text_id;
    if (targetRoomId) {
      socket.current = io(CONFIG.BACKEND_SERVER_URL);
      socket.current.emit("joinRoom", targetRoomId);

      socket.current.emit("setUserName", {
        username: localStorage.getItem("userEmail"),
      });

      socket.current.on(
        "textChanged",
        ({ text, userPhotoURL, cursorPosition }) => {
          const htmlContent = convertPlainTextToHTML(text);

          if (textareaRef.current.innerHTML !== htmlContent) {
            setTextValue(text);
            textareaRef.current.innerHTML = htmlContent;

            const existingImageNode = textareaRef.current.querySelector("img");

            if (existingImageNode) {
              textareaRef.current.removeChild(existingImageNode);
            }

            const iconElement = showProfileImage(
              userPhotoURL,
              cursorPosition,
              textareaRef.current.parentElement,
            );

            removeProfileImage(iconElement, TYPING_INTERVAL);
          }
        },
      );

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
    }
  }, [roomId]);

  useEffect(() => {
    if (textareaRef.current && result.length > 0) {
      textareaRef.current.innerHTML = convertPlainTextToHTML(
        result[0].content.join("\n"),
      );
    }
  }, [shareRoomId]);

  return (
    <>
      <div className="flex">
        <NavBar />
        <div
          className="w-screen h-screen flex flex-col"
          style={{ backgroundColor: "#F8F0E5" }}
        >
          <SubNavBar
            roomId={roomId}
            setRoomId={setRoomId}
            createNewRoom={createNewRoom}
            text_id={text_id}
          />
          <div
            className="flex flex-col w-3/4 h-3/4 m-auto rounded-md"
            style={{ backgroundColor: "#DAC0A3" }}
          >
            <div className="flex flex-col w-3/4 m-auto mt-4">
              <div className="bg-amber-700 w-full h-16 rounded-md text-center text-2xl font-semibold font-mono flex items-center justify-center">
                Hello, legalPad!
              </div>
              <div
                className="p-3 bg-yellow-200 border border-gray-400 rounded-lg h-72 resize-none"
                ref={textareaRef}
                onInput={handleInputChange}
                contentEditable={true}
                style={{
                  lineHeight: "32px",
                  fontFamily: "Courier New",
                  color: "#000",
                  width: "100%",
                  background: `linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px)`,
                  backgroundSize: "100% 33px",
                  backgroundColor: bgColor,
                  overflowY: "auto",
                }}
              ></div>
              {roomId && (
                <div
                  className="rounded-md text-center text-lg font-semibold font-mono flex items-center justify-center"
                  style={{ height: "5px", marginTop: "25px" }}
                >
                  {typingUser ? `${typingUser}가 입력 중입니다...` : ""}
                </div>
              )}
            </div>
            <div className="flex flex-col w-3/4 m-auto justify-between mt-0">
              {updateMode ? (
                <>
                  <Button
                    style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
                    onClick={navigateToMypage}
                  >
                    {"저장완료"}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <input
                    type="color"
                    id="bgcolor"
                    value={backgroundColor}
                    onChange={e => {
                      setBackgroundColor(e.target.value);
                      if (textareaRef.current) {
                        textareaRef.current.style.backgroundColor =
                          e.target.value;
                      }
                    }}
                  />

                  <Button
                    style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
                    onClick={() => {
                      handleDownloadClick(
                        textValue,
                        textareaRef,
                        backgroundColor,
                      );
                    }}
                  >
                    다운로드
                  </Button>
                  <Button
                    style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
                    onClick={updateText}
                  >
                    {text_id ? "수정" : "저장"}
                  </Button>
                </div>
              )}

              {text_id && (
                <>
                  <Button
                    style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-4"
                    onClick={deleteText}
                  >
                    삭제
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextEditor;
