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
    <div className="mr-10 h-16" style={{ backgroundColor: "#DAC0A3" }}>
      <div className="flex justify-end my-2 mr-16 ml-96">
        <Button style={"text-sm"}>
          <img
            className="h-12 w-12 rounded-full"
            src={userPhotoURL}
            alt="userPhoto"
            onClick={toggleMenu}
          />
        </Button>
        {menuOpen && (
          <div className="bg-white">
            <Button
              style={"block text-sm text-gray-700"}
              onClick={handleLogout}
            >
              LOGOUT
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubNavBar;
