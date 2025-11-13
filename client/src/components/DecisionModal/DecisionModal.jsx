// src/components/modal/DecisionModal.jsx
import React, { useState } from "react";
import "./decisionModal.scss";

function DecisionModal({
  show,
  onClose,
  clients = [],
  inline = false,
  onConfirm,
  onUnconfirm,
}) {
  if (!show) return null;

  const wrapperClass = inline ? "modal-inline" : "modal-overlay";
  const boxClass = inline ? "modal-box-inline" : "modal-box";

  // Track loading state for each client
  const [loadingIds, setLoadingIds] = useState([]);

  const handleConfirm = async (clientObj) => {
    if (!onConfirm) return;
    setLoadingIds((prev) => [...prev, clientObj.chatId]);
    try {
      await onConfirm(clientObj);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== clientObj.chatId));
    }
  };

  const handleUnconfirm = async (clientObj) => {
    if (!onUnconfirm) return;
    setLoadingIds((prev) => [...prev, clientObj.chatId]);
    try {
      await onUnconfirm(clientObj);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== clientObj.chatId));
    }
  };

  const hasConfirmed = clients.some((c) => c.confirmed);

  return (
    <div className={wrapperClass} onClick={!inline ? onClose : undefined}>
      <div className={boxClass} onClick={(e) => e.stopPropagation()}>
        <h3>{hasConfirmed ? "Client confirmé" : "Clients potentiels"}</h3>
        <ul className="client-list">
          {clients.length === 0 ? (
            <li>Aucun client potentiel pour le moment.</li>
          ) : (
            clients.map((c) => {
              const isLoading = loadingIds.includes(c.chatId);
              return (
                <li key={c.chatId} className="client-item">
                  <span>
                    {c.client.username} ({c.client.email})
                  </span>

                  {c.confirmed ? (
                    <button
                      className="unconfirm-button custom-unconfirm"
                      onClick={() => handleUnconfirm(c)}
                      disabled={isLoading}
                    >
                      {isLoading ? <span className="spinner"></span> : "Enlever"}
                    </button>
                  ) : (
                    <button
                      className="confirm-button"
                      onClick={() => handleConfirm(c)}
                      disabled={hasConfirmed || isLoading}
                    >
                      {isLoading ? <span className="spinner"></span> : "Confirmer"}
                    </button>
                  )}
                </li>
              );
            })
          )}
        </ul>

        {inline ? (
          <button className="close-inline" onClick={onClose} aria-label="Close">
            ✕
          </button>
        ) : (
          <div style={{ marginTop: 12 }}>
            <button className="close-button" onClick={onClose}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DecisionModal;
