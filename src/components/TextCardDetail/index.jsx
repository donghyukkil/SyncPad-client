import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useStore from "../../useStore";
import Button from "../Button";
import { CONFIG } from "../../constants/config";
import NavBar from "../NavBar";
import SubNavBar from "../SubNavBar";

const TextCardDetail = () => {
  const { text_id } = useParams();
  const { texts } = useStore();

  const [textValue, setTextValue] = useState(texts);
  const [updateMode, setUpdateMode] = useState(false);

  const navigate = useNavigate();

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

  const navigateToMypage = () => {
    navigate("/mypage");
  };

  const updateText = async () => {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/texts/${text_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: textValue }),
        },
      );

      setUpdateMode(!false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteText = async () => {
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
    } catch (error) {
      console.log(error);
    }
  };

  const result = texts.data.filter((text, index) => text._id === text_id);

  return (
    <>
      <div className="flex">
        <NavBar />
        <div className="bg-yellow-300 w-screen h-screen flex flex-col">
          <SubNavBar />
          <div className="flex bg-teal-950 w-3/4 h-3/4 m-auto py-0 justify-center rounded-md">
            <div className="flex flex-col justify-evenly w-3/4">
              <textarea
                className="p-3 bg-yellow-200 border border-gray-400 rounded-lg h-72 resize-none"
                ref={textareaRef}
                onChange={event => setTextValue(event.target.value)}
                style={{
                  lineHeight: "36px",
                  fontFamily: "Courier New",
                  color: "#000",
                  width: "100%",
                }}
                defaultValue={result[0].content}
              />
              {updateMode ? (
                <>
                  <Button
                    style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg p-0"
                    onClick={handleDownloadClick}
                  >
                    다운로드
                  </Button>
                  <Button style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg">
                    수정 완료
                  </Button>
                </>
              ) : (
                <Button
                  style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg"
                  onClick={updateText}
                >
                  수정
                </Button>
              )}
              <Button
                style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg"
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
