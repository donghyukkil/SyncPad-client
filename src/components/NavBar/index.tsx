import { useNavigate } from "react-router-dom";

import Button from "../Button";
import { CONFIG } from "../../constants/config";
import useStore from "../../useStore";

const NavBar = () => {
  const { clearUser } = useStore();
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (response.ok) {
        console.log("로그아웃 성공");
      } else {
        console.error("로그아웃 실패");
      }

      clearUser();

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="flex flex-col bg-custom-white w-[50vw] h-[75vh] rounded-lg drop-shadow-xl">
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
      <div
        className="m-auto h-1/5 w-11/12 hover:bg-selectbox rounded-lg"
        onClick={() => handleLogout()}
      >
        <Button style={"text-xl font-mono  h-full w-full"}>로그 아웃</Button>
      </div>
    </nav>
  );
};

export default NavBar;
