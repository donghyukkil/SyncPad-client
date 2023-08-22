import { create } from "zustand";

import { CONFIG } from "./constants/config";

const useStore = create(set => ({
  texts: {},
  setTexts: texts => set({ texts }),
  fetchTexts: async () => {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/texts`,
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
}));

export default useStore;
