import { useEffect } from "react";
import Router from "../src/router/router";
import { useStore } from "./store/useStore";

const App = () => {
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      useStore.getState().setUser(user);
    }
  }, []);
  return <Router />;
};

export default App;
