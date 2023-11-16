import { create } from "zustand";

const useStore = create(set => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  setUser: user => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },

  texts: {},
  setTexts: texts => set(texts),

  rooms: [],
  setRooms: newRoom => set({ rooms: newRoom }),

  textValue: "",
  setTextValue: textValue => set({ textValue }),

  selectedTextId: null,
  setSelectedTextId: selectedTextId => {
    set({ selectedTextId });
  },

  currentPage: 1,
  setCurrentPage: page => set(() => ({ currentPage: page })),

  roomId: 1,
  setRoomId: roomId => set({ roomId }),
}));

export default useStore;
