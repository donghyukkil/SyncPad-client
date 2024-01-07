import { toast } from "react-toastify";

import { CONFIG } from "../constants/config";

interface User {
  email: string;
}

interface Room {
  data: {
    room: {
      content: string[];
      roomId: string;
      textId: string;
      userId: string;
      __v: number;
      _id: string;
    };
  };
  message: string;
  status: number;
}

export const createNewRoom = async (
  text_id: string | undefined,
  roomId: string,
  user: User,
  result: object,
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

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: Room = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`Room creation failed: ${error.message}`, {});
    } else {
      toast.error("Unknown error occurred during room creation");
    }
    return undefined;
  }
};

export const deleteRoom = async (
  roomId: string | undefined,
  user: User,
): Promise<void> => {
  try {
    if (!user) {
      throw new Error("로그인 해주세요");
    }

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
      const data = await response.json();
      throw new Error(`${data.message}`);
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

export async function fetchUserRooms(user: User | null) {
  try {
    const response = await fetch(
      `${CONFIG.BACKEND_SERVER_URL}/users/${user?.email}/getRooms`,
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
