import { useNavigate } from "react-router-dom";

import Button from "../Button";

const NavBar = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="flex flex-col bg-custom-white w-[70vw] h-[50vh] rounded-lg drop-shadow-xl sm:w-[25vw]">
      <div
        className="m-auto h-1/5 w-11/12 hover:bg-selectbox rounded-lg"
        onClick={() => navigateTo("/create")}
      >
        <Button style={"text-xl font-mono h-full w-full"}>메모 만들기</Button>
      </div>
      <div
        className="m-auto h-1/5 w-11/12 hover:bg-selectbox rounded-lg"
        onClick={() => navigateTo("/upload")}
      >
        <Button style={"text-xl font-mono  h-full w-full"}>
          메모 추출하기
        </Button>
      </div>

      <div
        className="m-auto h-1/5 w-11/12 hover:bg-selectbox rounded-lg"
        onClick={() => navigateTo("/mypage")}
      >
        <Button style={"text-xl font-mono h-full w-full"}>메모 목록</Button>
      </div>

      <div
        className="m-auto h-1/5 w-11/12 hover:bg-selectbox rounded-lg"
        onClick={() => navigateTo("/sharedRooms")}
      >
        <Button style={"text-xl font-mono  h-full w-full"}>
          함께 메모하기
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
