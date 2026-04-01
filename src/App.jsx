import { useEffect } from "react";
import Router from "../src/router/router";
import { useStore } from "./store/useStore";
import { Toaster } from "react-hot-toast";

const App = () => {
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      useStore.getState().setUser(user);
    }
  }, []);
  return <>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />

    <Router />
  </>;
};

export default App;
