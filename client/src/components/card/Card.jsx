import "./Card.scss";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import DecisionModal from "../DecisionModal/DecisionModal";
// import UpdatePostModal from "../updatePostModal/UpdatePostModal";
import { io } from "socket.io-client";
import config from "../../../config";
import UpdatePostModal from "../UpdatePostModal/UpdatePostModal";

const socket = io(config.SOCKET_BASE_URL); // connect to Node server

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rented, setRented] = useState(item.rented); // track real-time

  // Register user and listen for updates
  useEffect(() => {
    if (currentUser?.id) socket.emit("newUser", currentUser.id);

    socket.on(`post-${item.id}-updated`, (data) => {
      setRented(data.rented);
      if (data.clients) setClients(data.clients);
    });

    return () => {
      socket.off(`post-${item.id}-updated`);
    };
  }, [item.id, currentUser]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await apiRequest.delete(`/posts/${item.id}`);
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the post.");
    }
  };

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest.get(`/chats/property/${item.id}`);
      setClients(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      alert("Failed to load clients.");
    } finally {
      setIsLoading(false);
    }
  };

  // Only allow logged-in users to view post
  const handleCardClick = () => {
    if (!currentUser) {
      alert("Vous devez être connecté pour voir cette annonce !");
      navigate("/login"); // redirect to login page
      return;
    }
    navigate(`/${item.id}`);
  };

  return (
    <div className="modern-card">
      {rented && <span className="rented-marker">En location</span>}

      {/* Image wrapper with click handler */}
      <div
        className="image-wrapper"
        onClick={handleCardClick}
        style={{ cursor: currentUser ? "pointer" : "not-allowed" }}
      >
        <img src={item.images[0]} alt={item.title} loading="lazy" />
      </div>

      <div className="card-body">
        <div className="card-header">
          <h3
            style={{ cursor: currentUser ? "pointer" : "not-allowed" }}
            onClick={handleCardClick}
          >
            {item.title}
          </h3>
          <p className="price">{item.price.toLocaleString()} Fbu</p>
        </div>

        <p className="address">
          <img src="/pin.png" alt="Location" />
          {item.address}
        </p>

        <div className="card-features">
          <span>
            <img src="/bed.png" alt="Bedrooms" />
            {item.bedroom} Beds
          </span>
          <span>
            <img src="/bath.png" alt="Bathrooms" />
            {item.bathroom} Baths
          </span>
        </div>

        <div className="card-actions">
          <button
            className="deal-button"
            onClick={loadClients}
            disabled={isLoading}
          >
            Deal
            {isLoading && <span className="spinner"></span>}
          </button>

          {currentUser?.id === item.userId && (
            <>
              <button
                className="edit-button"
                onClick={() => setShowEditModal(true)}
              >
                Edit
              </button>
              <button className="delete-button" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <DecisionModal
        show={showModal}
        inline
        onClose={() => setShowModal(false)}
        clients={clients}
        onConfirm={async (clientObj) => {
          setIsLoading(true);
          try {
            await apiRequest.patch(`/chats/${clientObj.chatId}/confirm`);
            alert(`Confirmed ${clientObj.client.username}`);
            socket.emit("updatePost", { postId: item.id });
            setShowModal(false);
          } catch (err) {
            console.error(err);
            alert("Failed to confirm client.");
          } finally {
            setIsLoading(false);
          }
        }}
        onUnconfirm={async (clientObj) => {
          setIsLoading(true);
          try {
            await apiRequest.patch(`/chats/${clientObj.chatId}/unconfirm`);
            alert(`Removed confirmation for ${clientObj.client.username}`);
            socket.emit("updatePost", { postId: item.id });
            setShowModal(false);
          } catch (err) {
            console.error(err);
            alert("Failed to unconfirm client.");
          } finally {
            setIsLoading(false);
          }
        }}
      />

      {showEditModal && (
        <UpdatePostModal
          post={item}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => window.location.reload()}
        />
      )}
    </div>
  );
}

export default Card;

