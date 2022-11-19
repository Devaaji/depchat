import create from "zustand";
import { destroyCookie, parseCookies, setCookie } from "nookies";

const useAuthUserStore = create(
  (set) => {
    const cookies = parseCookies();

    const {
      uid: uid,
      email: email,
      accessToken: accessToken,
      displayName: displayName,
    } = cookies;

    return {
      uid,
      displayName,
      email,
      accessToken,
      currentUser: {},
      infoUser: { notstate: true },
      updateCurrentUser: (currentUser) =>
        set(() => ({ currentUser: currentUser })),
      updateInfoUser: (infoUser) => set(() => ({ infoUser: infoUser })),
      setLogin: (newUid, newDisplayName, newEmail, newAccessToken) => {
        setCookie(null, "_i", newUid, {
          path: "/",
        });
        setCookie(null, "_d", newDisplayName, {
          path: "/",
        });
        setCookie(null, "_e", newEmail, {
          path: "/",
        });
        setCookie(null, "_t", newAccessToken, {
          path: "/",
        });
        set({
          uid: newUid,
          displayName: newDisplayName,
          email: newEmail,
          accessToken: newAccessToken,
        });
      },
      setLogout: () => {
        destroyCookie(null, "_i", { path: "/" });
        destroyCookie(null, "_d", { path: "/" });
        destroyCookie(null, "_e", { path: "/" });
        destroyCookie(null, "_t", { path: "/" });
        set({
          uid: undefined,
          email: undefined,
          accessToken: undefined,
        });
      },
    };
  },
  { name: "user" }
);

export default useAuthUserStore;
