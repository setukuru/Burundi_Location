import React from "react";
import "./UnblockUserModal.scss";

const UnblockUserModal = ({ user, onClose, userId, onUnblock }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Unblock User</h2>
        <p>
          Are you sure you want to unblock <strong>{user.username}</strong>?
        </p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={() => onUnblock(userId)}
          >
            Yes, Unblock
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnblockUserModal;
