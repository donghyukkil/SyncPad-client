import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Button";
import { CONFIG } from "../../constants/config";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToUpload = () => {
    navigate("/upload");
  };

  const navigateToCreate = () => {
    navigate("/create");
  };

  const navigateToMyPage = () => {
    navigate("/mypage");
  };

  const navigateToChat = () => {
    navigate("/chat");
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
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-blue-950 h-screen flex justify-center w-1/6">
      <div className="flex flex-col space-y-20 justify-evenly">
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
          }
          onClick={navigateToHome}
        >
          홈
        </Button>
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
          }
          onClick={navigateToCreate}
        >
          생성
        </Button>
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
          }
          onClick={navigateToUpload}
        >
          업로드
        </Button>
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
          }
          onClick={navigateToMyPage}
        >
          마이페이지
        </Button>
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
          }
          onClick={navigateToChat}
        >
          채팅
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
