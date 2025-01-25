import { create } from "zustand";
import { UserCredential } from "firebase/auth";

type UserStore = {
  user?: UserCredential;
  login: (user: UserCredential) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: undefined,
  login: (user) => {
    set({ user });
  },
  logout: () => set({ user: undefined }),
}));
