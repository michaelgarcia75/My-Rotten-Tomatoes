import React from "react";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import createEmotionCache from "../utility/createEmotionCache";
import lightTheme from "../styles/theme/lightTheme";
import "../styles/globals.css";
import NavBar from "./../components/NavBar";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store.js";

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
      console.log(user);
      setAuth(true);
    }
  }, []);

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Provider store={store}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <NavBar
              auth={auth}
              setAuth={setAuth}
              user={user}
              setUser={setUser}
            />
            <Component
              {...pageProps}
              auth={auth}
              setAuth={setAuth}
              user={user}
              setUser={setUser}
            />
          </ThemeProvider>
        </Provider>
      </CacheProvider>
    </>
  );
};

export default MyApp;
