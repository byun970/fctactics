import { create } from "zustand";

interface SearchState {
  inputNickName: string;
  searchTarget: string;
  isModalOpen: boolean;
  selectedMatchType: number;
  setInputNickName: (nickname: string) => void;
  setSearchTarget: (target: string) => void;
  setSelectedMatchType: (matchType: number) => void;
  setIsModalOpen: (open: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  inputNickName: "",
  searchTarget: "",
  isModalOpen: false,
  selectedMatchType: 50,
  setInputNickName: (inputNickName) => set({ inputNickName }),
  setSearchTarget: (searchTarget) => set({ searchTarget }),
  setSelectedMatchType: (selectedMatchType) => set({ selectedMatchType }),
  setIsModalOpen: (open) => set({ isModalOpen: open }),
}));
