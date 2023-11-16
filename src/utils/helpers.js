import { toast } from "react-toastify";
import { CONFIG } from "../constants/config";

export const createNewRoom = async (text_id, roomName, user, result) => {
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
          roomName: roomName,
          text: result,
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
    return data;
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
    toast.success("room이 삭제되었습니다", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } catch (error) {
    console.log(error);
  }
};

export async function fetchUserRooms(user) {
  try {
    const response = await fetch(
      `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/getRooms`,
    );
    const fetchedRooms = await response.json();

    return fetchedRooms;
  } catch (error) {
    console.error(error);
  }
}

export const uploadImageToServer = async (base64String, user) => {
  try {
    const response = await fetch(
      `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: base64String }),
      },
    );
  } catch (error) {
    console.log("Image upload error", error.message);
  }
};
