import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

import DisplayMessage from "../helperFunctions/displayMessages";

const socket = io.connect("http://localhost:8000");

function Chat({
  recipientID,
  setRecipientID,
  messages,
  setMessages,
  refresh,
  setRefresh,
}) {
  //hook
  const navigate = useNavigate();

  //controlvisiblity of input
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const [userInfo, setUserInfo] = useState();

  const getMessages = async () => {
    const { data } = await axios.get(`/chat/${recipientID}`);
    setMessages(data.messages);
  };

  useEffect(() => {
    let details = JSON.parse(localStorage.getItem("auth"));
    setUserInfo(details);

    const getUserInfo = async () => {
      const { data } = await axios.get("/user");

      if (data?.error) {
        toast.error(`${data.error}`);
      } else {
        setUserInfo(data);
      }
    };

    getUserInfo();
    getMessages();
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      getMessages();
    });
  }, []);

  const handleHideInput = () => {
    setVisible(!visible);
  };

  const handleSubmit = async () => {
    const { data } = await axios.post("/chat/binance", {
      message,
      case_id: recipientID,
    });
    if (data.message) {
      setMessages([...messages, data.message]);
      // send message to the server
      socket.emit("send_message", "update!!");
      setMessage("");
    } else if (data.error) {
      toast.error(`${data.error}`);
    } else {
      toast.error("Cannot send message now, try at a later time");
    }
  };

  return (
    <div className="App">
      <header>
        <div>
          <div>
            <img
              style={{ cursor: "pointer" }}
              src={require("../left-arrow.png")}
              onClick={() => {
                navigate("/users");
              }}
            />
            <img src={require("../lo.png")} />
          </div>
        </div>
        <div>
          <h2>{userInfo?.user_name}</h2>
          <p>Case ID #{recipientID}</p>
        </div>
        <div>
          <div>
            <img src={require("../power.png")} />
          </div>
          <div>
            <img
              src={require("../arrow-compress.png")}
              style={{ cursor: "pointer" }}
              onClick={handleHideInput}
            />
          </div>
        </div>
      </header>
      <main>
        <DisplayMessage
          messages={messages}
          setMessages={setMessages}
          case_id={recipientID}
          refresh={refresh}
          socket={socket}
          recipientID={recipientID}
        />
        <div id="down"></div>
        <div className="bottom">
          <div className={visible ? "input" : "input hide"}>
            <Input
              placeholder="Enter text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "200px", marginRight: "5px", fontSize: "1rem" }}
            />
            <Button
              style={{ background: "#494d58", color: "#fff", fontSize: "1rem" }}
              onClick={handleSubmit}
            >
              Send
            </Button>
          </div>
          <div className="down-arrow">
            <a href="#down">
              <img src={require("../arrow-down.png")} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chat;
