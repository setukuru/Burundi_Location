import React from "react";
import "./UserModal.scss";
import { X } from "lucide-react";

const UserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content user-modal">
        <X className="close-icon" size={24} onClick={onClose} />

        {/* Top: User Info */}
        <div className="user-header">
          <div className="user-info">
            <h2>{user.username}</h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Créé le:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
          </div>
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" />
            ) : (
              <div className="avatar-placeholder">No Avatar</div>
            )}
          </div>
        </div>

        {/* Bottom: Property Cards */}
        <div className="property-section">
          <h3>Propriétés de l&apos;utilisateur</h3>
          <div className="property-grid">
            {user.posts?.map((post) => (
              <div key={post.id} className="property-card">
                <img src={post.images[0]} alt="property" />
                <div className="card-body">
                  <h4>{post.title}</h4>
                  <p>
                    <strong>Ville:</strong> {post.city}
                  </p>
                  <p>
                    <strong>Type:</strong> {post.property}
                  </p>
                  <p>
                    <strong>Price:</strong> {post.price.toLocaleString()} Fbu
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
