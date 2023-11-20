import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useStore from "../../useStore";

import Button from "../Button";
import NavBar from "../NavBar";
import SubNavBar from "../SubNavBar";

import { CONFIG } from "../../constants/config";

import {
  convertHTMLToPlainText,
  convertPlainTextToHTML,
  saveSelection,
  restoreSelection,
  showProfileImage,
  removeProfileImage,
} from "../../utils/selectionUtils";

import { handleDownloadClick } from "../../utils/textAction";
import { createNewRoom, deleteRoom } from "../../utils/helpers";

const TYPING_INTERVAL = 300;

const TextEditor = () => {
  const { text_id, roomId } = useParams();
  const { texts, user, rooms } = useStore();

  let result;

  if (roomId) {
    result = rooms.filter(room => room.roomId === roomId);
  } else if (texts.data) {
    result = texts.data.filter(text => text._id === text_id);
  } else {
    result = [];
  }

  const [updateMode, setUpdateMode] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  let resultText = result?.length > 0 ? result[0].content.join("\n") : "";

  const [textValue, setTextValue] = useState(resultText);

  const [backgroundColor, setBackgroundColor] = useState("#f7e79e");

  const navigate = useNavigate();

  const textareaRef = useRef(null);
  const socket = useRef();
  const typingTimerRef = useRef(null);

  const bgColor = result?.[0]?.backgroundColor
    ? result[0].backgroundColor
    : backgroundColor;

  const handleInputChange = event => {
    const savedSelection = saveSelection();
    const cursorPosition = savedSelection.getBoundingClientRect();

    const newValue = convertHTMLToPlainText(event.currentTarget.innerHTML);
    setTextValue(newValue);

    if (!!socket.current) {
      socket.current.emit("textChange", {
        roomId,
        text: newValue,
        user: user || null,
        cursorPosition,
      });
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      setTypingUser(null);
    }, TYPING_INTERVAL);
  };

  const navigateToMypage = () => {
    navigate("/mypage");
  };

  const updateText = async () => {
    try {
      let url;
      let method;

      const plainTextContent = convertHTMLToPlainText(textValue);

      if (text_id) {
        url = `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/texts/${text_id}`;
        method = "PUT";
      } else {
        url = `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/create`;
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: plainTextContent, backgroundColor }),
      });

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

    const isConfirmed = window.confirm("정말로 이 메모를 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        const response = await fetch(
          `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/texts/${text_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        toast.success(`메모가 삭제되었습니다.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => navigateToMypage(), 3000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCreateRoom = async () => {
    const roomId = window.prompt("방 이름을 입력해주세요.");
    if (roomId) {
      try {
        const roomData = await createNewRoom(text_id, roomId, user, result);

        toast.success(`room이 생성되었습니다. 해당 room으로 이동합니다!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => navigate(`/room/${roomData.data.room.roomId}`), 3000);
      } catch (error) {
        console.log("Room creation failed");
        console.log(error);
        toast.error("방 생성에 실패했습니다.");
      }
    }
  };

  const handleDeleteRoom = async () => {
    const isConfirmed = window.confirm("정말로 이 방을 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await deleteRoom(roomId, user);

        setTimeout(() => navigate("/SharedRooms"), 3000);
      } catch (error) {
        toast.error("방 삭제에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current && result.length > 0) {
      textareaRef.current.innerHTML = convertPlainTextToHTML(
        result[0].content.join("\n"),
      );
    }

    if (roomId) {
      socket.current = io(CONFIG.BACKEND_SERVER_URL);
      socket.current.emit("joinRoom", roomId, user, textValue);

      socket.current.on("currentText", ({ text }) => {
        console.log(text);
        if (textareaRef.current) {
          textareaRef.current.innerHTML = convertPlainTextToHTML(
            text.toString(),
          );
        }
      });

      socket.current.on(
        "textChanged",
        ({ text, photoURL, cursorPosition, email }) => {
          const htmlContent = convertPlainTextToHTML(text);
          if (textareaRef.current.innerHTML !== htmlContent) {
            textareaRef.current.innerHTML = htmlContent;

            const iconElement = showProfileImage(
              photoURL,
              cursorPosition,
              textareaRef.current.parentElement,
            );

            removeProfileImage(iconElement, TYPING_INTERVAL);
            setTypingUser(email.split("@")[0]);

            if (typingTimerRef.current) {
              clearTimeout(typingTimerRef.current);
            }

            typingTimerRef.current = setTimeout(() => {
              setTypingUser(null);
            }, TYPING_INTERVAL);
          }
        },
      );

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [roomId]);

  return (
    <>
      <div className="flex">
        <NavBar />
        <div
          className="w-screen h-screen flex flex-col"
          style={{ backgroundColor: "#F8F0E5" }}
        >
          <SubNavBar />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
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
                contentEditable
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
              />
              {text_id && (
                <>
                  <div
                    className="rounded-md text-center text-lg font-semibold font-mono flex items-center justify-center"
                    style={{ height: "5px", marginTop: "25px" }}
                  >
                    {typingUser ? `${typingUser}가 입력 중입니다...` : ""}
                  </div>
                  <Button
                    style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
                    onClick={() => handleCreateRoom()}
                  >
                    {"방 생성"}
                  </Button>
                </>
              )}

              {roomId && (
                <>
                  <div
                    className="rounded-md text-center text-lg font-semibold font-mono flex items-center justify-center"
                    style={{ height: "5px", marginTop: "25px" }}
                  >
                    {typingUser ? `${typingUser}가 입력 중입니다...` : ""}
                  </div>
                  <Button
                    style="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
                    onClick={() => handleDeleteRoom()}
                  >
                    {"방 삭제"}
                  </Button>
                </>
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
