import { useNavigate } from "react-router-dom";

import Button from "../Button";

import noteImgSrc from "../../assets/notes.png";
import pngImgSrc from "../../assets/img.png";
import mypagesImgSrc from "../../assets/bookshelf.png";
import sharedRoomImgSrc from "../../assets/meeting.png";

const NavBar = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bg-zinc-200 h-screen flex justify-center w-1/6">
      <div className="flex flex-col gap-[10vh] my-auto">
        <>
          <div
            className="flex m-auto gap-[1vw]"
            onClick={() => navigateTo("/create")}
          >
            <img
              className="w-[3vw] h-[6vh]"
              src={noteImgSrc}
              alt="메모 만들기"
            />
            <Button style={"text-xl font-bold font-mono border: none"}>
              메모 만들기
            </Button>
          </div>

          <div className="border-b border-zinc-500 w-full"></div>
        </>

        <>
          <div
            className="flex m-auto gap-[1vw]"
            onClick={() => navigateTo("/upload")}
          >
            <img className="w-[3vw] h-[6vh]" src={pngImgSrc} alt="" />
            <Button style={"text-xl font-bold font-mono"}>메모 추출하기</Button>
          </div>
          <div className="border-b border-zinc-500 w-full"></div>
        </>

        <>
          <div
            className="flex m-auto gap-[1vw]"
            onClick={() => navigateTo("/mypage")}
          >
            <img className="w-[3vw] h-[6vh]" src={mypagesImgSrc} alt="" />
            <Button style={"text-xl font-bold font-mono"}>메모 목록</Button>
          </div>

          <div className="border-b border-zinc-500 w-full"></div>
        </>

        <>
          <div
            className="flex m-auto gap-[1vw]"
            onClick={() => navigateTo("/sharedRooms")}
          >
            <img className="w-[3vw] h-[6vh]" src={sharedRoomImgSrc} alt="" />

            <Button style={"text-xl font-bold font-mono"}>함께 메모하기</Button>
          </div>
        </>
      </div>
    </nav>
  );
};

export default NavBar;
