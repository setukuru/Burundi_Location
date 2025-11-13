import React, { useState } from "react";
import { Eye, UserX } from "lucide-react";
import UserModal from "../UserModal/UserModal";
import UnblockUserModal from "../UnblockUserModal/UnblockUserModal";
import apiRequest from "../../lib/apiRequest";

const BlockedUsersTable = ({ blockedUsers, onUnblock }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlockedUser, setSelectedBlockedUser] = useState(null);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);

  // Open unblock modal
  const openUnblockModal = (blockedUser) => {
    setUserToUnblock(blockedUser);
    setIsUnblockModalOpen(true);
  };

  const closeUnblockModal = () => {
    setIsUnblockModalOpen(false);
    setUserToUnblock(null);
  };

  // Handle unblock API call
  // Handle unblock API call
  const handleUnblock = async (userId) => {
    try {
      const response = await apiRequest.put(`/admin/unblock/${userId}`);

      if (response.status === 200) {
        onUnblock && onUnblock(userId); // Notify parent
        alert("User unblocked successfully");
      } else {
        alert("Failed to unblock user");
      }
    } catch (err) {
      console.error("Error while unblocking user:", err);
      alert("Error while unblocking user");
    }

    closeUnblockModal();
  };

  const openModal = (blockedUser) => {
    setSelectedBlockedUser(blockedUser);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlockedUser(null);
  };

  const toggleRow = (userId) => {
    setExpandedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="user-table">
      <h3>Blocked Users</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Blocked At</th>
            <th>Blocked By</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {blockedUsers.map((user, index) => (
            <React.Fragment key={user.id}>
              <tr
                onClick={() => toggleRow(user.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{expandedRows.includes(user.id) ? "-" : "+"}</td>
                <td>{index + 1}</td>
                <td>{user.id}</td>
                <td>{user.username || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{new Date(user.blockedAt).toLocaleDateString()}</td>
                <td>{user.blockedBy || "N/A"}</td>
                <td>{user.reason || "N/A"}</td>
                <td className="action-icons">
                  <Eye
                    size={20}
                    color="#555"
                    className="icon view-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(user);
                    }}
                  />
                  <UserX
                    size={19}
                    color="green"
                    className="icon unblock-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUnblockModal(user);
                    }}
                  />
                </td>
              </tr>

              {expandedRows.includes(user.id) && (
                <tr className="collapsible-row">
                  <td colSpan="9">
                    <div className="blocked-user-details">
                      <strong>User Details:</strong>
                      <br />
                      User ID: {user.id}
                      <br />
                      Username: {user.username || "N/A"}
                      <br />
                      Email: {user.email || "N/A"}
                      <br />
                      Blocked At: {new Date(user.blockedAt).toLocaleString()}
                      <br />
                      Blocked By: {user.blockedBy || "N/A"}
                      <br />
                      Reason: {user.reason || "N/A"}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedBlockedUser && (
        <UserModal user={selectedBlockedUser} onClose={closeModal} />
      )}

      {isUnblockModalOpen && userToUnblock && (
        <UnblockUserModal
          user={userToUnblock}
          userId={userToUnblock.id}
          onClose={closeUnblockModal}
          onUnblock={handleUnblock}
        />
      )}
    </div>
  );
};

export default BlockedUsersTable;
