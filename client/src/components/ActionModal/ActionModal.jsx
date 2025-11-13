import React, { useState } from 'react';
import './ActionModal.scss';

const ActionModal = ({ onClose, user, onConfirmBlock }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirmBlock(user, reason);
    setReason('');
    onClose(); // Close after triggering
  };

  return (
    <div className="modal-overlay-Modal">
      <div className="modal-content-Modal">
        <h2>Block User: {user?.username}</h2>
        <textarea
          placeholder="Reason for blocking this user"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="reason-textarea"
        />
        <div className="button-group">
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Block
          </button>
          <button className="close-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;

