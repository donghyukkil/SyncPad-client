import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Button";

import useSignInWithGoogle from "../../hooks/useSignInWithGoogle";

import useStore from "../../useStore";

import { CONFIG } from "../../constants/config";

import { createNewRoom, deleteRoom, fetchUserRooms } from "../../utils/helpers";

const SubNavBar = ({ roomId, setRoomId, text_id }) => {
  const { user, clearUser } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [rooms, setRooms] = useState([
    { roomId: "room1", roomName: "공개 채팅 방" },
  ]);

  const navigate = useNavigate();

  const signInWithGoogle = useSignInWithGoogle();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRoomClick = roomId => {
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
    fetchUserRooms(user, rooms, setRooms);
  }, [roomId]);

  return (
    <div
      className="h-16 flex justify-between relative w-full"
      style={{ backgroundColor: "#DAC0A3" }}
    >
      <div className="flex space-x-10 m-auto ml-20">
        <select
          onChange={e => {
            const selectedRoomId = e.target.value;
            setRoomId(selectedRoomId);
            handleRoomClick(selectedRoomId);
          }}
          className="p-2 border rounded"
          style={{ width: "200px" }}
        >
          <option key="default-option" value="" disabled>
            Select a room
          </option>
          {rooms.map((room, index) => (
            <option key={index} value={room.roomId}>
              {room.roomName}
            </option>
          ))}
        </select>
        <Button
          style="bg-white hover:border-0 hover:bg-gray-100 text-black px-2 rounded-md text-center text-lg font-semibold font-mono"
          onClick={() => createNewRoom(text_id, user)}
        >
          방 생성
        </Button>
        <Button
          style="bg-white hover:border-0 hover:bg-gray-100 text-black px-2 rounded-md text-center text-lg font-semibold font-mono"
          onClick={() => deleteRoom(roomId, user)}
        >
          방 삭제
        </Button>
      </div>

      <div className="flex flex-col mr-20 my-2">
        {user ? (
          <div style={{ width: "48px", height: "48px" }}>
            <Button>
              <img
                className="h-12 w-12 rounded-full"
                src={user.photoURL}
                alt="profile"
                onClick={toggleMenu}
              />
            </Button>
            {menuOpen && (
              <div className="bg-white">
                <Button
                  style={
                    "bg-white hover:border-0 hover:bg-gray-100 text-black rounded-md text-center text-lg font-semibold font-mono w-20 mt-2"
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
              "bg-white hover:bg-gray-100 hover:border-0 text-black ml-3 rounded-lg font-semibold font-mono h-10 text-lg mt-1"
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
