import "./propertyDetailModal.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function PropertyDetailModal({ post, onClose }) {
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(post.isSaved);

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
      if (response.status === 200) {
        console.log("Chat created:", response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="propertyDetailModalOverlay" onClick={onClose}>
      <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="closeBtn" onClick={onClose}>×</button>

        <div className="modalContent">
          {/* Left side - Images */}
          <div className="imageSection">
            <Slider images={post.images} />
          </div>

          {/* Right side - Details */}
          <div className="detailsSection">
            {/* Header */}
            <div className="header">
              <h1 className="title">{post.title}</h1>
              <div className="price">{post.price.toLocaleString()} Fbu</div>
            </div>

            {/* Address */}
            <div className="address">
              <span>📍</span>
              <span>{post.address}</span>
            </div>

            {/* Quick info */}
            <div className="quickInfo">
              {post.bedroom && (
                <div className="infoItem">
                  <span>🛏️ {post.bedroom} bed{post.bedroom > 1 ? 's' : ''}</span>
                </div>
              )}
              {post.bathroom && (
                <div className="infoItem">
                  <span>🚿 {post.bathroom} bath{post.bathroom > 1 ? 's' : ''}</span>
                </div>
              )}
              {post.size && (
                <div className="infoItem">
                  <span>📐 {post.size} m²</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="description">
              <h3>Description</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.postDetail?.desc || "No description"),
                }}
              />
            </div>

            {/* Owner info */}
            <div className="owner">
              <div className="ownerInfo">
                <div className="ownerAvatar">
                  {post.user?.avatar ? (
                    <img src={post.user.avatar} alt={post.user.username} />
                  ) : (
                    <div className="defaultAvatar">👤</div>
                  )}
                </div>
                <div>
                  <div className="ownerName">{post.user?.username || "Owner"}</div>
                  <div className="ownerLabel">Property Owner</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="map">
              <h3>Location</h3>
              <Map items={[post]} />
            </div>

            {/* Action buttons */}
            <div className="actions">
              {currentUser?.role !== 'proprietaire' && (
                <button className="messageBtn" onClick={handleSendMessage}>
                  <span>💬 Message</span>
                </button>
              )}
              <button 
                className={`saveBtn ${saved ? 'saved' : ''}`}
                onClick={handleSave}
              >
                <span>{saved ? '✓ Saved' : '🔖 Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailModal;
