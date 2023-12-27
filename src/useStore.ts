import { create } from "zustand";

import { fetchUserRooms } from "./utils/helpers";

type User = {
  email: string;
  [key: string]: string;
};

type Room = {
  _id: string;
  [key: string]: string;
};

interface TextItem {
  _id: string;
  userId: string;
  content: string[];
  backgroundColor: string;
  createdAt: string;
}

type State = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;

  texts: { data: TextItem[]; totalPages: number };
  setTexts: (newTexts: { texts: object[] }) => void;
  rooms: Room[];
  setRooms: (newRooms: Room[]) => void;
  fetchRooms: (user: User) => Promise<void>;

  textValue: string;
  setTextValue: (textValue: string) => void;

  selectedTextId: string | null;
  setSelectedTextId: (selectedTextId: string | null) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;

  roomId: string;
  setRoomId: (roomId: string) => void;
};

const useStore = create<State>(set => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setUser: user => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: undefined });
  },

  texts: { data: [], totalPages: 0 },
  setTexts: newTexts =>
    set(state => ({
      texts: { ...state.texts, ...newTexts },
    })),

  rooms: [],
  setRooms: newRooms =>
    set(state => ({
      rooms: [
        ...state.rooms,
        ...newRooms.filter(
          newRoom => !state.rooms.some(room => room._id === newRoom._id),
        ),
      ],
    })),
  fetchRooms: async user => {
    try {
      const roomsData = await fetchUserRooms(user);
      set({ rooms: roomsData });
    } catch (error) {
      console.error("fetchUserRooms failed:", error);
    }
  },

  textValue: "",
  setTextValue: textValue => set({ textValue }),

  selectedTextId: null,
  setSelectedTextId: selectedTextId => {
    set({ selectedTextId });
  },

  currentPage: 1,
  setCurrentPage: page => set(() => ({ currentPage: page })),

  roomId: "1",
  setRoomId: roomId => set({ roomId }),
}));

export default useStore;
