import { eventHandler } from "h3";
import { ref } from "vue";

export const MOCKED_USER = {
  role: "admin",
  email: "hi@sidebase.io",
  name: "John Doe",
};

export function useAuth() {
  return {
    data: ref(MOCKED_USER),
    status: ref("authenticated"),
    getSession: () => MOCKED_USER,
    signOut: () => {},
  };
}

export const getServerSession = () => MOCKED_USER;
export const NuxtAuthHandler = () => eventHandler(() => MOCKED_USER);
