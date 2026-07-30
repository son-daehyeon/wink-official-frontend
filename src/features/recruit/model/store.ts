import { create } from 'zustand';

export type RecruitFormStack = 'frontend' | 'backend' | 'devops' | 'design';

interface Data {
  recruit?: string;
  confetti: boolean;
  step: number;
  modify?: number;
  developer: boolean;
  stack: RecruitFormStack[];
  back: boolean;
  editing: boolean;
}

interface Action {
  clear: () => void;
  setRecruit: (recruit: string | undefined) => void;
  setConfetti: (confetti: boolean) => void;
  setStep: (step: number) => void;
  setModify: (modify: number | undefined) => void;
  setDeveloper: (developer: boolean) => void;
  setStack: (stack: RecruitFormStack[]) => void;
  setBack: (back: boolean) => void;
  setEditing: (editing: boolean) => void;
}

const initialState: Data = {
  recruit: undefined,
  confetti: false,
  step: 0,
  modify: undefined,
  developer: false,
  stack: [],
  back: false,
  editing: false,
};

export const useRecruitStore = create<Data & Action>((set) => ({
  ...initialState,
  clear: () => set({ ...initialState }),
  setRecruit: (recruit) => set({ recruit }),
  setConfetti: (confetti) => set({ confetti }),
  setStep: (step) => set({ step }),
  setModify: (modify: number | undefined) => set({ modify }),
  setDeveloper: (developer: boolean) => set({ developer }),
  setStack: (stack: RecruitFormStack[]) => set({ stack }),
  setBack: (back: boolean) => set({ back }),
  setEditing: (editing: boolean) => set({ editing }),
}));
