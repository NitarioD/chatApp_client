import axios from "axios";
import { useEffect, useState } from "react";

const DisplayMessage = ({
  messages,
  setMessages,
  case_id,
  refresh,
  socket,
  recipientID,
}) => {
  const [deletedMessageID, setDeletedMessageID] = useState("");

  const handleDelete = async (id) => {
    const deleteMessage = window.confirm(
      "Are you sure you want to delete this message"
    );
    if (deleteMessage) {
      const { data } = await axios.delete(`/chat/delete/${id}`);
      if (data.deleted) {
        setDeletedMessageID(data.deleted);
        socket.emit("send_message", "deleted");
      }
    }
  };

  useEffect(() => {
    setMessages(messages.filter((message) => message._id !== deletedMessageID));
  }, [deletedMessageID]);

  return (
    <div className="messages">
      {messages?.map((message) =>
        message.role === "user" ? (
          <div
            className="send"
            key={message._id}
            onClick={() => {
              handleDelete(message?._id);
            }}
          >
            <div className="time">
              <span>{message.date.slice(11, 16)}</span>
            </div>
            <p>{message.message}</p>
          </div>
        ) : (
          <div
            className="receive"
            key={message._id}
            onClick={() => {
              handleDelete(message?._id);
            }}
          >
            <span>
              <img src={require("../Binance.png")} />
            </span>
            <p>{message.message}</p>
            <div className="time">
              <span>{message.date.slice(11, 16)}</span>
            </div>
          </div>
        )
      )}
    </div>
  );
};
export default DisplayMessage;
