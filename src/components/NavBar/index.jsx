import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Button";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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

        <div className="mt-2 ml-3">
          <Button
            style={"relative flex rounded-full bg-gray-800 text-sm"}
            onClick={toggleMenu}
          >
            <img className="h-8 w-8 rounded-full m-6" src="" alt="" />
          </Button>
          {menuOpen && (
            <div className="bg-white">
              <Button style={"block text-sm text-gray-700"}>MYPAGE</Button>
              <Button style={"block text-sm text-gray-700"}>LOGOUT</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
