import { useState, useRef, useEffect, useContext } from "react";
import "./chat.scss";
import { format } from "timeago.js";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Chat() {
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);

  const messageEndRef = useRef();

  // Use the useContext hook to get the currentUser from your AuthContext
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await apiRequest.get("/chats");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // CORRECTED: This function now fetches all messages for the selected chat
  const handleOpenChat = async (c) => {
    try {
      const res = await apiRequest.get(`/chats/${c.id}`);
      
      // Update the state with the full chat object including messages
      setChat({ ...res.data, receiver: c.receiver });

      // Logic to mark messages as seen
      const unreadMessagesCount = res.data.messages.filter(
        (m) => m.userId !== currentUser.id && !m.seenBy?.includes(currentUser.id)
      ).length;

      if (unreadMessagesCount > 0) {
        const chatIndex = chats.findIndex(chatItem => chatItem.id === c.id);
        if (chatIndex !== -1) {
          setChats(prevChats => {
            const newChats = [...prevChats];
            // You may need to handle this based on your backend response
            newChats[chatIndex].seenBy = newChats[chatIndex].seenBy || [];
            newChats[chatIndex].seenBy.push(currentUser.id);
            return newChats;
          });
        }
      }

    } catch (err) {
      console.log("Failed to open chat and fetch messages:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, {
        text,
      });

      setChat((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), res.data],
        lastMessage: text,
      }));

      // Optionally update chat list to show new last message
      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === chat.id ? { ...c, lastMessage: text } : c
        )
      );

      e.target.reset();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {Array.isArray(chats) && chats.length > 0 ? (
          chats.map((c) => (
            <div
              className="message"
              key={c.id}
              style={{
                backgroundColor:
                  c.seenBy?.includes(currentUser.id) || chat?.id === c.id
                    ? "white"
                    : "#fecd514e",
              }}
              onClick={() => handleOpenChat(c)}
            >
              <img src={c.receiver?.avatar || "/noavatar.jpg"} alt="" />
              <span>{c.receiver?.username}</span>
              <p>{c.lastMessage}</p>
            </div>
          ))
        ) : (
          <p>No chats yet</p>
        )}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver?.avatar || "/noavatar.jpg"} alt="" />
              {chat.receiver?.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages?.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;