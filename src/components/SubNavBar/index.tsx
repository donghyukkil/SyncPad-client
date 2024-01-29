import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Button";

import menu from "../../assets/menu.png";

import useSignInWithGoogle from "../../hooks/useSignInWithGoogle";

import useStore from "../../useStore";

import { CONFIG } from "../../constants/config";
import profile from "../../assets/user.png";

import { fetchUserRooms } from "../../utils/helpers";
import NavBar from "../NavBar";

const SubNavBar: React.FC = () => {
  const { user, clearUser, rooms, setRooms, setRoomId, roomId } = useStore();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  const toggleHamburgeMenu = () => {
    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
  };

  const navigate = useNavigate();

  const signInWithGoogle = useSignInWithGoogle();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRoomClick = (roomId: string) => {
    if (roomId === "room1") {
      navigate("/chat");
    } else {
      navigate(`/room/${roomId}`);
    }
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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await fetchUserRooms(user);
        setRooms(roomsData);
      } catch (error) {
        console.error("fetchUserRooms failed:", error);
      }
    };

    if (user) {
      fetchRooms();
    }
  }, [user]);

  return (
    <>
      <div className="flex justify-between bg-white min-h-[10vh]">
        <div className="my-auto flex w-1/2">
          <img
            className="h-[5vh] mx-10 my-auto"
            src={menu}
            alt="togglemenu"
            onClick={() => toggleHamburgeMenu()}
          />
        </div>
        <select
          onChange={e => {
            const selectedRoom = rooms.filter(
              room => room.roomId === e.target.value,
            );

            if (selectedRoom) {
              setRoomId(selectedRoom[0].roomId);
              handleRoomClick(selectedRoom[0]._id);
            }
          }}
          value={roomId || ""}
          className="m-auto min-h-[5.5vh] min-w-[30vw] bg-selectbox rounded-md"
        >
          <option key="default-option" value="" disabled>
            select a room
          </option>
          {rooms?.map((room, index) => (
            <option key={index} value={room.roomId} className="bg-red-200">
              {room.roomId}
            </option>
          ))}
        </select>
        {isHamburgerMenuOpen && (
          <div className="absolute top-24 left-6">
            <NavBar />
          </div>
        )}

        <div className="relative flex justify-end my-auto w-1/2 mx-10">
          {user ? (
            <div>
              <Button>
                <img
                  className="h-[6vh] rounded-full"
                  src={user.photoURL}
                  alt="profile"
                  onClick={toggleMenu}
                />
              </Button>
              {menuOpen && (
                <div className="absolute right-100 bg-custom-white w-[20vw] h-[5vh] rounded-lg drop-shadow-xl">
                  <Button
                    style={
                      "hover:border-0 hover:bg-white text-black rounded-md text-center text-lg font-semibold font-mono w-20 mt-2"
                    }
                    onClick={handleLogout}
                  >
                    로그아웃
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button
              style={
                "bg-white hover:bg-white hover:border-0 text-black ml-3 rounded-lg font-semibold font-mono h-10 text-lg mt-1"
              }
              onClick={signInWithGoogle}
            >
              <img
                src={profile}
                alt="profile"
                className="max-w-[10vw] max-h-[10vh] m-auto"
              />
            </Button>
          )}
        </div>
      </div>
      <div className="border-b border-zinc-500 w-full"></div>
    </>
  );
};

export default SubNavBar;
