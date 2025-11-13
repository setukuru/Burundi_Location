import { BanIcon, Eye, UserX } from "lucide-react";
import React, { useState } from "react";
import PropertyModal from "../PropertyModal/PropertyModal";
import EmptyModal from "../ActionModal/ActionModal";

const PropertyTable = ({ properties }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false); // new state

  const openEmptyModal = () => setIsEmptyModalOpen(true); // open empty modal
  const closeEmptyModal = () => setIsEmptyModalOpen(false); // close it

  const openModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const toggleRow = (propertyId) => {
    setExpandedRows((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <div className="user-table">
      <h3>Properties</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>Titres</th>
            <th>Ville</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Créé le</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <React.Fragment key={property.id}>
              <tr
                onClick={() => toggleRow(property.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{expandedRows.includes(property.id) ? "-" : "+"}</td>
                <td>{index + 1}</td>
                <td>{property.title}</td>
                <td>{property.city}</td>
                <td>{property.property}</td>
                <td>{property.price.toLocaleString()} Fbu</td>
                <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                <td className="action-icons">
                  <Eye
                    size={20}
                    color="#555"
                    className="icon view-icon"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row toggle
                      openModal(property);
                    }}
                  />
                  <BanIcon size={19} color="crimson" className="icon block-icon" onClick={openEmptyModal}/>
                </td>
              </tr>

              {expandedRows.includes(property.id) && (
                <tr className="collapsible-row">
                  <td colSpan="7">
                    <div className="property-owner">
                      <strong>Owner Info:</strong>
                      <br />
                      Username: {property.user?.username || "N/A"}
                      <br />
                      Email: {property.user?.email || "N/A"}
                      <br />
                      User ID: {property.user?.id || "N/A"}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* <PropertyModal isOpen={isModalOpen} onClose={closeModal} /> */}
      {isModalOpen && selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={closeModal} />
      )}
      {isEmptyModalOpen && (
        <EmptyModal onClose={closeEmptyModal} />
      )}
    </div>
  );
};

export default PropertyTable;
