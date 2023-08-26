import { create } from "zustand";

import { CONFIG } from "./constants/config";

const useStore = create(set => ({
  texts: {},
  textValue: "",
  setTextValue: textValue => set({ textValue }),
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
  selectedTextId: null,
  setSelectedTextId: selectedTextId => {
    set({ selectedTextId });
  },

  currentPage: 1,
  setCurrentPage: page => set(() => ({ currentPage: page })),
}));

export default useStore;
