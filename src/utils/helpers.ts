import { toast } from "react-toastify";

import { CONFIG } from "../constants/config";

interface User {
  email: string;
}

interface Room {
  id: string;
  text_id: string;
  userId: string;
  text: string;
}

export const createNewRoom = async (
  text_id: string | undefined,
  roomId: string,
  user: User,
  result: string,
): Promise<Room | undefined> => {
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
          text: result,
          roomId,
        }),
      },
    );

    const data: Room = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteRoom = async (
  roomId: string | undefined,
  user: User,
): Promise<void> => {
  try {
    const response = await fetch(
      `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/deleteRooms/${roomId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

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
    if (error instanceof Error) {
      console.log(error);
      toast.error(`요청이 실패했습니다: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
};

export async function fetchUserRooms(user: User) {
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

export const uploadImageToServer = async (
  base64String: string,
  user: User,
): Promise<boolean | undefined> => {
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
    if (error instanceof Error) {
      console.log("Image upload error", error.message);
    }

    return undefined;
  }
};
