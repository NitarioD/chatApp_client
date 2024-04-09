import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Chat from "./components/chat.js";
import BinanceChat from "./components/binanceChat.js";
import Signin from "./components/signin.js";
import Signup from "./components/signup.js";
import UserList from "./components/userlist.js";

function App() {
  //set path to be the signin path regardless of the url
  let path = window.location.href.split("/");
  path.pop();
  path = path.join("/");

  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  //store receipite case id
  const [recipientID, setRecipientID] = useState("");

  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState("yes");

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setAuth(JSON.parse(localStorage.getItem("auth")));
    }
  }, []);

  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;

  axios.interceptors.response.use(
    function (response) {
      //perform a function before request is sent
      return response;
    },
    function (error) {
      //do something when an error happens after request is sent
      const res = error.response;
      if (res?.status === 401 && res?.config && !res?.config.__isRetryRequest) {
        setAuth({
          user: null,
          token: "",
        });
        localStorage.removeItem("auth");

        window.location.href = path;
      }
      return error;
    }
  );

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Router>
        <Routes>
          <Route
            exact
            path="/chat"
            element={
              <Chat
                messages={messages}
                setMessages={setMessages}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            }
          />
          <Route
            exact
            path="/"
            element={
              <Signin
                auth={auth}
                setAuth={setAuth}
                recipientID={recipientID}
                setRecipientID={setRecipientID}
              />
            }
          />
          <Route
            exact
            path="/signup"
            element={<Signup auth={auth} setAuth={setAuth} />}
          />
          <Route
            exact
            path="/users"
            element={
              <UserList
                auth={auth}
                setAuth={setAuth}
                recipientID={recipientID}
                setRecipientID={setRecipientID}
              />
            }
          />
          <Route
            exact
            path="/chat/binance"
            element={
              <BinanceChat
                auth={auth}
                setAuth={setAuth}
                recipientID={recipientID}
                setRecipientID={setRecipientID}
                messages={messages}
                setMessages={setMessages}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
