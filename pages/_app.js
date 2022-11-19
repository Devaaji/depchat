import React from "react";
import NextNProgress from 'nextjs-progressbar';
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <NextNProgress
        height={5}
        color="#008069"
        options={{ showSpinner: false }}
      />
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default MyApp;
