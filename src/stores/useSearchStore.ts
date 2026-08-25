import { create } from "zustand";

interface SearchState {
  inputNickName: string;
  searchTarget: string;
  selectedMatchType: number;
  setInputNickName: (nickname: string) => void;
  setSearchTarget: (target: string) => void;
  setSelectedMatchType: (matchType: number) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  inputNickName: "",
  searchTarget: "",
  selectedMatchType: 50,
  setInputNickName: (inputNickName) => set({ inputNickName }),
  setSearchTarget: (searchTarget) => set({ searchTarget }),
  setSelectedMatchType: (selectedMatchType) => set({ selectedMatchType }),
}));
