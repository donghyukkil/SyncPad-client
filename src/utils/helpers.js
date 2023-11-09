import { CONFIG } from "../constants/config";

export const createNewRoom = async (text_id, user) => {
  try {
    const response = await fetch(
      `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/createRoom`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_id,
          userId: user.email,
        }),
      },
    );

    const data = await response.json();

    if (data) {
      const roomURL = `${window.location.origin}/room/${data.data.room.textId}`;

      try {
        await navigator.clipboard.writeText(roomURL);
        console.log("URL이 클립보드에 복사되었습니다.");
      } catch (err) {
        console.error("클립보드 복사 실패:", err);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteRoom = async (roomId, user) => {
  try {
    const response = await fetch(
      `${CONFIG.BACKEND_SERVER_URL}/users/${user}/deleteRooms/${roomId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export async function fetchUserRooms(user, rooms, setRooms) {
  try {
    const response = await fetch(
      `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/getRooms`,
    );
    const fetchedRooms = await response.json();

    const combinedRooms = [
      ...rooms,
      ...fetchedRooms.filter(
        fetchedRoom => !rooms.some(room => room.roomId === fetchedRoom.roomId),
      ),
    ];

    setRooms(combinedRooms);
  } catch (error) {
    console.error(error);
  }
}
