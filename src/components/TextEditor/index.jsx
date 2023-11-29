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
} from "../../utils/selectionUtils";

import { handleDownloadClick } from "../../utils/textAction";
import { createNewRoom, deleteRoom } from "../../utils/helpers";

const TYPING_INTERVAL = 300;

const targetNodeStyle = {
  backgroundColor: "#ffffff",
  opacity: 0.7,
  transition: "background-color 500ms ease-in-out, opacity 500ms ease-in-out",
};

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
  const [textInput, setTextInput] = useState();

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
    setTextInput(event.nativeEvent.data);

    const selection = window.getSelection();

    if (!selection.rangeCount) {
      return;
    }

    const range = selection.getRangeAt(0);
    const cursorNode = range.startContainer;

    const childNodes = Array.from(event.target.childNodes);

    let cursorNodeIndex = -1;
    childNodes.forEach((node, index) => {
      if (node.contains(cursorNode)) {
        cursorNodeIndex = index;
      } else {
        node.style = {};
      }
    });

    const newValue = convertHTMLToPlainText(event.currentTarget.innerHTML);
    setTextValue(newValue);

    if (!!socket.current) {
      socket.current.emit("textChange", {
        roomId,
        text: newValue,
        user: user || null,
        cursorIndex: cursorNodeIndex,
        textInput,
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

  const findTextInNode = (node, textInput, imageUrl) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const index = node.nodeValue.indexOf(textInput);
      if (index !== -1) {
        const existingImage = document.getElementById("profile-image");
        if (existingImage) {
          existingImage.remove();
        }

        const span = document.createElement("span");
        span.textContent = textInput;

        const afterTextNode = node.splitText(index);
        afterTextNode.nodeValue = afterTextNode.nodeValue.substring(
          textInput.length,
        );

        node.parentNode.insertBefore(span, afterTextNode);

        const img = document.createElement("img");
        img.id = "profile-image";
        img.src = imageUrl;
        img.alt = "프로필 이미지";
        img.style.position = "absolute";
        img.style.width = "30px";
        img.style.height = "30px";
        img.style.opacity = 0.6;
        img.style.transition = "opacity 0.5s ease-in-out";

        const rect = span.getBoundingClientRect();
        img.style.left = `${rect.left + window.scrollX}px`;
        img.style.top = `${rect.top + window.scrollY}px`;

        document.body.appendChild(img);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(childNode =>
        findTextInNode(childNode, textInput, imageUrl),
      );
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
        if (textareaRef.current) {
          textareaRef.current.innerHTML = convertPlainTextToHTML(
            text.toString(),
          );
        }
      });

      socket.current.on(
        "textChanged",
        ({ text, photoURL, email, cursorIndex, textInput }) => {
          const htmlContent = convertPlainTextToHTML(text);
          if (textareaRef.current.innerHTML !== htmlContent) {
            textareaRef.current.innerHTML = htmlContent;

            const targetNode = textareaRef.current.childNodes[cursorIndex];
            Object.assign(targetNode.style, targetNodeStyle);

            if (targetNode) {
              findTextInNode(targetNode, textInput, photoURL);
              targetNode.classList.add("profile-icon");
            }

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
        <div className="w-screen h-screen flex flex-col">
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

          <div className="flex flex-col w-3/4 h-3/4 bg-zinc-100 m-auto rounded-md">
            <div className="flex flex-col w-3/4 m-auto mt-4">
              <div className="bg-blue-900 w-full h-1/6 rounded-md text-center text-white text-xl font-semibold font-mono flex items-center justify-center">
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
                    style="bg-yellow-300 hover:bg-white hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
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
                    style="bg-yellow-300 hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
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
                    style="bg-yellow-300 hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-8"
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
                    style="bg-yellow-300 hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
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
                    style="bg-yellow-300 hover:bg-white hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
                    onClick={updateText}
                  >
                    {text_id ? "수정" : "저장"}
                  </Button>
                </div>
              )}

              {text_id && (
                <>
                  <Button
                    style="bg-yellow-300 hover:bg-white hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono mt-4"
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
