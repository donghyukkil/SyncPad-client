import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useStore from "../../usStore";
import Button from "../Button";

const TextCardDetail = () => {
  const { texts } = useStore();
  const [textValue, setTextValue] = useState(texts);

  const navigate = useNavigate();

  const textareaRef = useRef(null);

  const navigateToMypage = () => {
    navigate("/mypage");
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="bg-amber-700 w-full h-16"></div>
        <div className="bg-yellow-300 w-screen h-screen flex">
          <div className="flex bg-teal-950 w-6/12 h-2/4 m-auto py-0 justify-center rounded-md">
            <div className="flex flex-col justify-evenly w-3/4">
              <textarea
                className="p-3 bg-yellow-200 border border-gray-400 rounded-lg h-48 resize-none"
                ref={textareaRef}
                onChange={event => setTextValue(event.target.value)}
                style={{
                  lineHeight: "36px",
                  fontFamily: "Courier New",
                  color: "#000",
                  width: "100%",
                }}
              />
              <Button style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg p-0">
                다운로드
              </Button>
              <Button style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg">
                수정
              </Button>
              <Button
                style="bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg"
                onClick={navigateToMypage}
              >
                마이페이지
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextCardDetail;
