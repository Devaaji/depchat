import { parseCookies } from "nookies";

export const getServerSidePropsWithNoAuth = async (context) => {
  const {
    _t: accessToken,
    _i: userId,
    _e: email,
  } = parseCookies(context, { path: "/" });

  if (userId && accessToken && email) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
