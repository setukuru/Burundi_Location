import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Chat from "../../components/chat/Chat";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const response = await apiRequest.post("/chats/", {
        receiverId: post.userId, // proprietaire
        propertyId: post.id, // property linked to chat
      });

      if (response.status === 200 || response.status === 201) {
        console.log("Chat created:", response.data);

        // Optional: open the chat UI immediately
        setMessage(`Hello, I'm interested in your property (ID: ${post.id})`);
        setShowChat(true);
      } else {
        console.error("Failed to create chat.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">{post.price} Fbu</div>
              </div>
              <div className="user">
                <img src={post.user?.avatar || "/default-avatar.png"} alt="" />
                <span>{post.user?.username || "Unknown Owner"}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail?.desc || ""),
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <div>
              <button onClick={handleSendMessage}>
                <img src="/chat.png" alt="" />
                Send a Message
              </button>
            </div>
            <button
              onClick={handleSave}
              style={{ backgroundColor: saved ? "#fece51" : "white" }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
          {showChat && <Chat postId={post.id} initialMessage={message} />}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
