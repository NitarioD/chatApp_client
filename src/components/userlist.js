import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, Typography } from "antd";

const UserList = ({ recipientID, setRecipientID }) => {
  //hook
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});
  const [users, setUsers] = useState([]);

  //background color of the list
  const [background, setBackground] = useState("#E5E3E9");

  //controlvisiblity of input
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    //fetch users
    const fetchUsers = async () => {
      const { data } = await axios.get("/users");
      setUsers(data.users);
    };
    fetchUsers();
    //fetch user info
    const fetchUser = async () => {
      const { data } = await axios.get("/user");
      setUserInfo(data);
    };
    fetchUsers();
    fetchUser();
  }, []);

  const handleHideInput = () => {
    setVisible(!visible);
  };
  return (
    <div>
      <header>
        <div>
          <div>
            <img
              style={{ cursor: "pointer" }}
              src={require("../left-arrow.png")}
              onClick={() => {
                navigate("/");
              }}
            />
            <img src={require("../lo.png")} />
          </div>
        </div>
        <div>
          <h2>{userInfo?.user_name}</h2>
          <p>Case ID #{userInfo?.case_id}</p>
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
      <List
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: "#494D58",
            }}
          >
            USERS
          </div>
        }
        bordered
        dataSource={users}
        renderItem={(item) => (
          <List.Item
            onClick={() => {
              setBackground("");
              setRecipientID(item["case_id"]);
              navigate("/chat/binance");
            }}
            style={{
              background: background === "#E5E3E9" ? "#E5E3E9" : "#fff",
              marginTop: "15px",
              fontSize: "1rem",
              display: item["case_id"] === 0 ? "none" : "block",
            }}
          >
            <Typography.Text mark>[{item["case_id"]}]</Typography.Text>
            <span style={{ marginLeft: "auto" }} className="user">
              {item["user_name"]}
            </span>
          </List.Item>
        )}
      />
    </div>
  );
};

export default UserList;
