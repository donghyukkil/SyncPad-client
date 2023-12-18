import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Button";

import useSignInWithGoogle from "../../hooks/useSignInWithGoogle";

import useStore from "../../useStore";

import { CONFIG } from "../../constants/config";

import { fetchUserRooms } from "../../utils/helpers";

interface Room {
  roomId: string;
}

const SubNavBar: React.FC = () => {
  const { user, clearUser, rooms, setRooms, setRoomId, roomId } = useStore();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
    <div className="h-[8vh] bg-zinc-100 flex gap-x-[45vw]">
      <div className="flex space-x-10 m-auto ml-20">
        <select
          onChange={e => {
            const selectedRoomId = e.target.value;
            setRoomId(selectedRoomId);
            handleRoomClick(selectedRoomId);
          }}
          value={roomId || ""}
          className="p-2 border rounded w-[15vw]"
        >
          <option key="default-option" value="" disabled>
            select a room
          </option>
          {rooms?.map((room: Room, index: number) => (
            <option key={index} value={room.roomId}>
              {room.roomId}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col m-auto">
        {user ? (
          <div>
            <Button>
              <img
                className="h-[5vh] w-[3vw] rounded-full"
                src={user.photoURL}
                alt="profile"
                onClick={toggleMenu}
              />
            </Button>
            {menuOpen && (
              <div className="bg-white">
                <Button
                  style={
                    "bg-white hover:border-0 hover:bg-white text-black rounded-md text-center text-lg font-semibold font-mono w-20 mt-2"
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
            로그인
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubNavBar;
