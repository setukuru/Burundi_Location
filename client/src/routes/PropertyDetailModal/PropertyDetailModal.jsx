import "./propertyDetailModal.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Chat from "../../components/chat/Chat";

function PropertyDetailModal({ post, onClose }) {
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(post.isSaved);
  const [showChat, setShowChat] = useState(true);
  const [message, setMessage] = useState(null);

  const handleSave = async () => {
    if (!currentUser) return;
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) return;
    try {
      const response = await apiRequest.post("/chats", {
        receiverId: post.userId,
        propertyId: post.id,
        userId: currentUser.id,
      });
      if (response.status === 200) console.log("Chat created:", response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="propertyDetailModalOverlay" onClick={onClose}>
      <div
        className="propertyDetailModalContent"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="closeModal" onClick={onClose}>
          ×
        </button>

        <div className="details">
          <Slider images={post.images} />
          <div className="info">
            <h1>{post.title}</h1>
            <p className="address">{post.address}</p>
            <p className="price">{post.price.toLocaleString()} Fbu</p>
            <div
              className="description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail?.desc || ""),
              }}
            ></div>
          </div>
        </div>

        <div className="features">
          <p className="title">Location</p>
          <Map items={[post]} />

          <div className="buttons">
            <button onClick={handleSendMessage}>
              <img src="/chat.png" alt="" />
              envoie Message
            </button>
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

export default PropertyDetailModal;
