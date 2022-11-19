import { destroyCookie, parseCookies } from "nookies";

export const getServerSidePropsWithAuth = async (context) => {
  const {
    _t: accessToken,
    _i: userId,
    _e: email,
  } = parseCookies(context, { path: "/" });

  if (userId && accessToken && email) {
    const returnValue = {
      props: {
        fallback: {},
      },
    };

    return returnValue;
  }

  destroyCookie(context, "_t", { path: "/" });
  destroyCookie(context, "_i", { path: "/" });
  destroyCookie(context, "_e", { path: "/" });

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};
