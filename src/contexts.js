import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const AdminContentContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setAuth(JSON.parse(localStorage.getItem("auth")));
    }
  }, []);

  if (process.server) {
    axios.defaults.baseURL = process.env.API;
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
  } else {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
  }

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
        navigate("/signin");
      }
      return error;
    }
  );

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const AdminContentProvider = ({ children }) => {
  const [content, setContent] = useState("");

  return (
    <AdminContentContext.Provider value={[content, setContent]}>
      {children}
    </AdminContentContext.Provider>
  );
};

export { AuthContext, AuthProvider, AdminContentContext, AdminContentProvider };
