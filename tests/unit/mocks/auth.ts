import { eventHandler } from "h3";
import { ref } from "vue";

export const MOCKED_USER = {
  role: "admin",
  email: "hi@sidebase.io",
  name: "John Doe",
  accessToken: "aaaa",
  oeb_roles: [{ role: "manager", community: "OEBC000" }]
};

const userData = ref(MOCKED_USER); 
const userStatus = ref("authenticated");

export function useAuth() {
  return {
    data: userData,
    status: userStatus,
    getSession: () => userData.value,
    signOut: () => {
      userData.value = null;
      userStatus.value = "unauthenticated";
    },
  };
}

export const getServerSession = () => userData.value;
export const NuxtAuthHandler = () => eventHandler(() => userData.value);
