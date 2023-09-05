import { create } from "zustand";

import { CONFIG } from "./constants/config";

const useStore = create(set => ({
  texts: {},
  setTexts: texts => set({ texts }),
  fetchTexts: async currentPage => {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/texts?per_page=6&page=${currentPage}`,
      );

      const texts = await response.json();
      set({ texts });
    } catch (error) {
      console.log(error);
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

  roomId: 1,
  setRoomId: roomId => set({ roomId }),
}));

export default useStore;
