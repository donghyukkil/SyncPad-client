import { toast } from "react-toastify";

import { CONFIG } from "../constants/config";

export const createNewRoom = async (text_id, roomId, user, result) => {
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
          roomId,
          text: result,
        }),
      },
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRoom = async (roomId, user) => {
  try {
    await fetch(
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
      autoClose: 2000,
      hideProgressBar: true,
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

    if (response.ok) {
      return new Promise(resolve => {
        toast.success("이미지가 업로드되었습니다.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => resolve(true),
        });
      });
    } else {
      throw new Error("Image upload failed");
    }
  } catch (error) {
    console.log("Image upload error", error.message);
  }
};
