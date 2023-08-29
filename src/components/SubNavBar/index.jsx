import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Button";

import { CONFIG } from "../../constants/config";

const SubNavBar = ({}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const userPhotoURL = localStorage.getItem("userPhotoURL");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
    <div
      className="mr-10 h-16 flex justify-end relative"
      style={{ backgroundColor: "#DAC0A3" }}
    >
      <div className="flex flex-col mr-32 my-2">
        <Button>
          <img
            className="h-12 w-12 rounded-full"
            src={userPhotoURL}
            alt="profile"
            onClick={toggleMenu}
          />
        </Button>
        {menuOpen && (
          <div className="bg-white absolute mt-16">
            <Button
              style={
                "bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
              }
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubNavBar;
