import { create } from "zustand";
import { User } from "firebase/auth";

type UserStore = {
  user?: User;
  token?: string;
  authed: boolean;
  checkAuthStatus: (user: User) => boolean;
  login: (user: User) => "success" | "failure";
  logout: (user: User) => "success" | "failure";
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: undefined,
  token: undefined,
  authed: false,
  checkAuthStatus: (user) => {
    return true;
  },
  login: (user) => {
    return "success";
  },
  logout: (user) => {
    return "failure";
  },
}));
