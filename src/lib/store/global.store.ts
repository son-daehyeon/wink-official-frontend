import { create } from 'zustand';

interface GlobalState {
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

export const useGlobalState = create<GlobalState>((set) => ({
  loaded: false,
  setLoaded: (loaded: boolean) => set({ loaded }),
}));
