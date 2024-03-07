import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useStore from "../../useStore";

import Main from "./Main";
import Footer from "./Footer";
import Button from "../Button";

import plusButton from "../../assets/plus.png";

import { CONFIG } from "../../constants/config";

import {
  convertHTMLToPlainText,
  convertPlainTextToHTML,
} from "../../utils/selectionUtils";

import { handleDownloadClick } from "../../utils/textAction";
import { createNewRoom, deleteRoom } from "../../utils/helpers";

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

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const handleColorChange = (color: string) => {
    return () => setBackgroundColor(color);
  };

  let bgColor = result?.[0]?.backgroundColor
    ? result[0].backgroundColor
    : backgroundColor;

  const [showFooter, setShowFooter] = useState(false);

  const toggleFooter = () => {
    setShowFooter(!showFooter);
  };

  const navigate = useNavigate();

  const textareaRef = useRef<HTMLDivElement | null>(null);
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
          if (textareaRef.current && text && text.content) {
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

        socket.current.on("styleChanged", ({ styleType, value }) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(value, "text/html");
          const styledTextContent = doc.body.textContent || "";

          document.querySelectorAll("*").forEach(el => {
            Array.from(el.childNodes).forEach(child => {
              if (
                child.nodeType === Node.TEXT_NODE &&
                child.textContent &&
                child.textContent.includes(styledTextContent)
              ) {
                const fullText = child.textContent;
                const startIndex = fullText.indexOf(styledTextContent);
                const endIndex = startIndex + styledTextContent.length;

                const beforeText = fullText.substring(0, startIndex);
                const afterText = fullText.substring(endIndex);

                const newElement = document.createElement("span");
                newElement.innerHTML = styledTextContent;

                switch (styleType) {
                  case "bold":
                    newElement.style.fontWeight = "bold";
                    break;
                  case "italic":
                    newElement.style.fontStyle = "italic";
                    break;
                  case "underline":
                    newElement.style.textDecoration = "underline";
                    break;
                  case "color":
                    newElement.style.color = "red";
                    break;
                  case "highlight":
                    newElement.style.backgroundColor = "yellow";
                    break;
                  default:
                    break;
                }

                const beforeTextNode = document.createTextNode(beforeText);
                const afterTextNode = document.createTextNode(afterText);

                el.insertBefore(beforeTextNode, child);
                el.insertBefore(newElement, child);
                el.insertBefore(afterTextNode, child);

                el.removeChild(child);
              }
            });
          });
        });

        return () => {
          socket.current?.off("styleChanged");
        };
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

    return () => {};
  }, [roomId]);

  useEffect(() => {
    bgColor = backgroundColor;
  }, [backgroundColor]);

  return (
    <div className="flex flex-col">
      <div className="mx-10 my-4  flex justify-around rounded-md">
        <Button onClick={handleColorChange("#fff9c4")}>
          <div className="w-[5vh] h-[5vh] bg-yellow-300 rounded-full"></div>
        </Button>
        <Button onClick={handleColorChange("#ffffff")}>
          <div className="w-[5vh] h-[5vh] bg-white rounded-full shadow-md shadow-slate-400"></div>
        </Button>
        <Button onClick={handleColorChange("#fddde6")}>
          <div className="w-[5vh] h-[5vh] bg-red-500 rounded-full"></div>
        </Button>
        <Button onClick={handleColorChange("#7ed77b")}>
          <div
            className="w-[5vh] h-[5vh] rounded-full"
            style={{ backgroundColor: "#0bc20b" }}
          ></div>
        </Button>
        <Button onClick={handleColorChange("#a4c1f4")}>
          <div className="w-[5vh] h-[5vh] bg-blue-400 rounded-full"></div>
        </Button>
      </div>
      {socket.current ? (
        <Main
          textareaRef={textareaRef}
          handleInputChange={handleInputChange}
          bgColor={bgColor}
          roomId={roomId || ""}
          typingUser={typingUser || ""}
          backgroundColor={backgroundColor}
          socket={socket.current}
        />
      ) : (
        <Main
          textareaRef={textareaRef}
          handleInputChange={handleInputChange}
          bgColor={bgColor}
          roomId={roomId || ""}
          typingUser={typingUser || ""}
          backgroundColor={backgroundColor}
        />
      )}

      <div className="mx-10">
        {!showFooter && (
          <>
            <Button onClick={toggleFooter}>
              <img
                src={plusButton}
                alt="Show Footer"
                className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
              />
            </Button>
          </>
        )}
        {showFooter && (
          <Footer
            backgroundColor={backgroundColor}
            text_id={text_id}
            textareaRef={textareaRef}
            handleCreateRoom={handleCreateRoom}
            handleDeleteRoom={handleDeleteRoom}
            handleDownloadClick={handleDownloadClick}
            updateText={updateText}
            roomId={roomId || ""}
            textValue={textValue}
            deleteText={deleteText}
            setShowFooter={setShowFooter}
          />
        )}
      </div>
    </div>
  );
};

export default TextEditor;
