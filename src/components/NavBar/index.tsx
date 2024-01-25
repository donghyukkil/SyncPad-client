import { useNavigate } from "react-router-dom";

import Button from "../Button";

const NavBar = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="flex flex-col bg-white w-[30vw] h-[50vh] rounded-lg">
      <div className="flex h-1/4">
        <div
          className="flex m-auto hover:bg-gray-300"
          onClick={() => navigateTo("/create")}
        >
          <Button style={"text-xl font-bold font-mono h-full w-full"}>
            메모 만들기
          </Button>
        </div>
      </div>

      <div className="flex h-1/4">
        <div className="m-auto" onClick={() => navigateTo("/upload")}>
          <Button style={"text-xl font-bold font-mono"}>메모 추출하기</Button>
        </div>
      </div>

      <div className="flex h-1/4">
        <div className="m-auto" onClick={() => navigateTo("/mypage")}>
          <Button style={"text-xl font-bold font-mono"}>메모 목록</Button>
        </div>
      </div>

      <div className="flex h-1/4">
        <div className="m-auto" onClick={() => navigateTo("/sharedRooms")}>
          <Button style={"text-xl font-bold font-mono"}>함께 메모하기</Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
