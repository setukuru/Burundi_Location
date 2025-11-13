import React, { useState } from "react";
import { Eye, UserX } from "lucide-react";
import UserModal from "../UserModal/UserModal";
import ActionModal from "../ActionModal/ActionModal";
import "./UserTable.scss";
import axios from "axios"; // Add this if not already
import apiRequest from "../../lib/apiRequest";

const UserTable = ({ users }) => {
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const openModal = (user) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  const toggleExpand = (userId) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const handleOpenActionModal = (user) => {
    setSelectedUser(user);
    setIsActionModalOpen(true);
  };

  const closeActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmBlock = async (user, reason) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const blockedBy = storedUser?.username || "unknown"; // fallback just in case
    console.log("Blocking performed by:", blockedBy);

    try {
      const endpoint =
        user.role === "locataire"
          ? `/admin/block/locataire/${user.id}`
          : `/admin/block/proprietaire/${user.id}`;

      await apiRequest.put(endpoint, { reason, blockedBy });

      alert(`User ${user.username} blocked by ${blockedBy}.`);
    } catch (error) {
      console.error(error);
      alert("Failed to block user.");
    }
  };

  return (
    <div className="user-table">
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Properties</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <React.Fragment key={user.id}>
              <tr>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="clickable" onClick={() => toggleExpand(user.id)}>
                  {user.posts?.length}{" "}
                  {user.posts?.length === 1 ? "property" : "properties"}
                </td>
                <td className="action-icons">
                  <Eye
                    size={20}
                    className="icon view-icon"
                    onClick={() => openModal(user)}
                  />
                  <UserX
                    size={19}
                    className="icon block-icon"
                    onClick={() => handleOpenActionModal(user)}
                  />
                </td>
              </tr>

              {expandedUserId === user.id && (
                <tr className="expanded-row">
                  <td colSpan="6">
                    <div className="property-details expanded">
                      <h4>Properties for {user.username}</h4>
                      <table className="nested-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>City</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.posts.map((post) => (
                            <tr key={post.id}>
                              <td>{post.title}</td>
                              <td>{post.price}Fbu </td>
                              <td>{post.city}</td>
                              <td>{post.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <UserModal
        isOpen={!!selectedUser && !isActionModalOpen}
        onClose={closeModal}
        user={selectedUser}
      />

      {isActionModalOpen && selectedUser && (
        <ActionModal
          onClose={closeActionModal}
          user={selectedUser}
          onConfirmBlock={handleConfirmBlock}
        />
      )}
    </div>
  );
};

export default UserTable;
