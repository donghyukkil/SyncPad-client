import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { io, Socket } from "socket.io-client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useStore from "../../useStore";

import Button from "../Button";

import { CONFIG } from "../../constants/config";

import {
  convertHTMLToPlainText,
  convertPlainTextToHTML,
} from "../../utils/selectionUtils";

import { handleDownloadClick } from "../../utils/textAction";
import { createNewRoom, deleteRoom } from "../../utils/helpers";

import deleteIcon from "../../assets/deleteIcon.png";
import downloadIcon from "../../assets/downloadIcon.png";
import eraserIcon from "../../assets/eraserIcon.png";
import roomIcon from "../../assets/roomIcon.png";
import roomDelete from "../../assets/roomDelete.png";

const TYPING_INTERVAL = 300;

interface TextEditorParams {
  [key: string]: string | undefined;
  text_id?: string;
  roomId?: string;
}

const TextEditor: React.FC = () => {
  const { text_id, roomId } = useParams<TextEditorParams>();
  const { texts, user, rooms } = useStore();
  const targetNodeStyle = useMemo(
    () => ({
      backgroundColor: "#ffffff",
      opacity: 0.7,
      transition:
        "background-color 500ms ease-in-out, opacity 500ms ease-in-out",
    }),
    [],
  );

  const result = useMemo(() => {
    if (roomId) {
      return rooms.filter(room => room._id === roomId);
    } else if (texts.data) {
      return texts.data.filter(text => text._id === text_id);
    } else {
      return [];
    }
  }, [roomId, text_id, rooms, texts.data]);

  let resultText = "";

  if (result.length > 0 && Array.isArray(result[0].content)) {
    resultText = result[0].content.join("\n");
  }

  const [typingUser, setTypingUser] = useState(null);

  const [textValue, setTextValue] = useState(resultText);

  const [backgroundColor, setBackgroundColor] = useState("#f7e79e");

  const bgColor = result?.[0]?.backgroundColor
    ? result[0].backgroundColor
    : backgroundColor;

  const navigate = useNavigate();

  const textareaRef = useRef<HTMLDivElement>(null);
  const socket = useRef<Socket | null>();
  const typingTimerRef = useRef<NodeJS.Timeout | number | null>(null);

  const handleInputChange = (event: React.FormEvent<HTMLDivElement>) => {
    const selection = window.getSelection();

    if (!selection || !selection.rangeCount) {
      return;
    }

    const range = selection.getRangeAt(0);
    const cursorNode = range.startContainer;

    const targetDiv = event.target as HTMLDivElement;
    const childNodes = Array.from(targetDiv.childNodes);

    let cursorNodeIndex = -1;
    childNodes.forEach((node, index) => {
      if (node.contains(cursorNode)) {
        cursorNodeIndex = index;
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
      });
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      setTypingUser(null);
    }, TYPING_INTERVAL);
  };

  const updateText = async () => {
    try {
      if (!user) {
        toast.error("로그인이 필요합니다!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        setTimeout(() => navigate("/"), 2500);

        return;
      }

      let url;
      let method;

      const plainTextContent = convertHTMLToPlainText(textValue);

      if (text_id) {
        url = `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/texts/${text_id}`;
        method = "PUT";

        await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content: plainTextContent, backgroundColor }),
        });

        toast.success(`메모가 수정되었습니다.`, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        setTimeout(() => navigate("/mypage"), 2000);
      } else {
        url = `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/create`;
        method = "POST";

        await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content: plainTextContent, backgroundColor }),
        });

        toast.success(`메모가 생성되었습니다.`, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        setTimeout(() => navigate("/mypage"), 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteText = async () => {
    if (!user) {
      navigate("/");

      return;
    }

    if (!text_id) {
      console.log("No text_id available to delete.");

      return;
    }

    const isConfirmed = window.confirm("정말로 이 메모를 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await fetch(
          `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/texts/${text_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        toast.success(`메모가 삭제되었습니다.`, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => navigate("/mypage"), 3000);
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
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => navigate(`/room/${roomData?.data.room._id}`), 3000);
      } catch (error) {
        console.log("Room creation failed");
        toast.error("방 생성에 실패했습니다.");
      }
    }
  };

  const handleDeleteRoom = async () => {
    const isConfirmed = window.confirm("정말로 이 방을 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        await deleteRoom(roomId, user);

        setTimeout(() => navigate("/sharedRooms"), 3000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const placeProfileImageNearNode = (targetNode: Node, imageUrl: string) => {
    const existingImage = document.getElementById("profile-image");

    if (existingImage) {
      existingImage.remove();
    }

    if (targetNode instanceof Element) {
      const rect = targetNode.getBoundingClientRect();
      const imageElement = document.createElement("img");
      imageElement.id = "profile-image";
      imageElement.src = imageUrl;
      imageElement.alt = "프로필 이미지";
      imageElement.style.position = "absolute";
      imageElement.style.left = `${rect.left + window.scrollX - 40}px`;
      imageElement.style.top = `${rect.top + window.scrollY}px`;
      imageElement.style.width = "30px";
      imageElement.style.height = "30px";

      document.body.appendChild(imageElement);
    }
  };

  useEffect(() => {
    if (
      textareaRef.current &&
      result.length > 0 &&
      Array.isArray(result[0].content)
    ) {
      textareaRef.current.innerHTML = convertPlainTextToHTML(
        result[0].content.join("\n"),
      );
    }

    if (roomId) {
      socket.current = io(CONFIG.BACKEND_SERVER_URL);

      if (socket.current) {
        socket.current.emit("joinRoom", roomId, user, textValue);

        socket.current.on("currentText", ({ text }) => {
          if (textareaRef.current) {
            textareaRef.current.innerHTML = convertPlainTextToHTML(
              text.content.toString(),
            );
          }
        });

        socket.current.on(
          "textChanged",
          ({ text, photoURL, email, cursorIndex }) => {
            const htmlContent = convertPlainTextToHTML(text);

            if (textareaRef.current) {
              if (textareaRef.current.innerHTML !== htmlContent) {
                textareaRef.current.innerHTML = htmlContent;

                const targetNode = textareaRef.current.childNodes[cursorIndex];

                if (targetNode instanceof HTMLElement) {
                  Object.assign(targetNode.style, targetNodeStyle);

                  targetNode.classList.add("profile-icon");
                  targetNode.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });

                  placeProfileImageNearNode(targetNode, photoURL);
                }

                setTypingUser(email.split("@")[0]);

                if (typingTimerRef.current) {
                  clearTimeout(typingTimerRef.current);
                }

                typingTimerRef.current = setTimeout(() => {
                  setTypingUser(null);
                }, TYPING_INTERVAL);
              }
            }
          },
        );
      }

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }

        const existingImage = document.getElementById("profile-image");

        if (existingImage) {
          existingImage.remove();
        }
      };
    }
  }, [roomId]);

  return (
    <div className="flex">
      <div className="flex flex-col mx-auto min-h-[30vh] min-w-[25%] max-h-[30vh] max-w-[50%]">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ top: "9vh" }}
        />
        <div className="bg-blue-900 w-full h-[7vh] text-center rounded-md  text-white text-[2.5vw] font-semibold font-mono">
          Hello, legalPad!
        </div>
        <div
          className="bg-yellow-200 border-gray-400 rounded-lg min-h-[55vh] max-h-[80%] min-w-[25vw] max-w-[100%] text-2xl"
          ref={textareaRef}
          onInput={handleInputChange}
          contentEditable
          style={{
            lineHeight: "33px",
            fontFamily: "Courier New",
            color: "#000",
            background: `linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px)`,
            backgroundSize: "100% 33px",
            backgroundColor: bgColor,
            overflowY: "auto",
          }}
        />
        {roomId && (
          <div
            className="rounded-md text-center text-lg font-semibold font-mono flex items-center justify-center"
            style={{ height: "5px", marginTop: "25px" }}
          >
            {typingUser ? `${typingUser}가 입력 중입니다...` : ""}
          </div>
        )}
      </div>

      <div className="flex flex-col w-2/5 m-auto mt-0">
        <div className="flex flex-col justify-between h-[60vh]">
          <div className="flex flex-col">
            <label className="py-0 text-xl font" htmlFor="bgcolor">
              Color Picker
            </label>
            <input
              className="h-[5vh] w-[6vw]"
              type="color"
              id="bgcolor"
              value={backgroundColor}
              onChange={e => {
                setBackgroundColor(e.target.value);

                if (textareaRef.current) {
                  textareaRef.current.style.backgroundColor = e.target.value;
                }
              }}
            />
          </div>
          {text_id && (
            <Button
              style="bg-yellow-300 h-[11vh] hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
              onClick={() => handleCreateRoom()}
            >
              <div className="flex items-center gap-[7vw]">
                <img
                  className="w-[3vw] h-[5vh]"
                  src={roomIcon}
                  alt="방 생성하기"
                />
                <span className="text-center text-lg font-semibold font-mono">
                  방 생성
                </span>
              </div>
            </Button>
          )}
          {roomId && (
            <Button
              style="bg-yellow-300 h-[11vh] hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
              onClick={() => handleDeleteRoom()}
            >
              <div className="flex items-center gap-[7vw]">
                <img
                  className="w-[3vw] h-[5vh]"
                  src={roomDelete}
                  alt="방 삭제하기"
                />
                <span className="text-center text-lg font-semibold font-mono">
                  방 삭제
                </span>
              </div>
            </Button>
          )}
          <Button
            style="bg-yellow-300 h-[11vh] hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
            onClick={() => {
              handleDownloadClick(textValue, textareaRef, backgroundColor);
            }}
          >
            <div className="flex items-center gap-[7vw]">
              <img
                className="w-[3vw] h-[5vh]"
                src={downloadIcon}
                alt="다운로드 아이콘"
              />
              <span className="text-center text-lg font-semibold font-mono">
                다운로드
              </span>
            </div>
          </Button>
          <Button
            style="bg-yellow-300 h-[11vh] hover:border-0 bg-white hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
            onClick={updateText}
          >
            <div className="flex items-center gap-[7vw]">
              <img
                className="w-[3vw] h-[5vh]"
                src={eraserIcon}
                alt="수정하기"
              />
              <span className="text-center text-lg font-semibold font-mono">
                {text_id ? "수정하기" : "저장하기"}
              </span>
            </div>
          </Button>
          {text_id && (
            <Button
              style="bg-yellow-300 h-[11vh] hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono w-full"
              onClick={deleteText}
            >
              <div className="flex items-center gap-[7vw]">
                <img
                  className="w-[3vw] h-[5vh]"
                  src={deleteIcon}
                  alt="삭제 아이콘"
                />
                <span className="text-center text-lg font-semibold font-mono">
                  삭제하기
                </span>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
