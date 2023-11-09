import { useNavigate } from "react-router-dom";

import Button from "../Button";

const NavBar = () => {
  const navigate = useNavigate();

  const navigateTo = path => {
    navigate(path);
  };

  return (
    <nav
      className="h-screen flex justify-center w-1/6"
      style={{ backgroundColor: "#102C57" }}
    >
      <div className="flex flex-col space-y-20 justify-evenly">
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-lg font-semibold font-mono"
          }
          onClick={() => navigateTo("/create")}
        >
          새 메모
        </Button>
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-lg font-semibold font-mono"
          }
          onClick={() => navigateTo("/upload")}
        >
          이미지 메모
        </Button>
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-lg font-semibold font-mono"
          }
          onClick={() => navigateTo("/mypage")}
        >
          마이 페이지
        </Button>
        <Button
          style={
            "bg-gray-900 text-white rounded-md px-3 py-2 text-lg font-semibold font-mono"
          }
          onClick={() => navigateTo("/chat")}
        >
          함께 메모
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
