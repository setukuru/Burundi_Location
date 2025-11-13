import React, { useState } from "react";
import "./PropertyModal.scss";
import { X } from "lucide-react";

const UserModal = ({ property, onClose }) => {
  const [mainImage, setMainImage] = useState(property.images[0]);

  return (
    <div className="property-modal-overlay">
      <div className="property-modal">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-contents">
          <div className="image-section">
            <img src={mainImage} alt="Main" className="main-image" />
            <div className="thumbnail-row">
              {property.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={`thumbnail ${mainImage === img ? "active" : ""}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="details-section">
            <div className="left-details">
              <h2>{property.title}</h2>
              <p>
                <strong>Address:</strong> {property.address}, {property.city}
              </p>
              <p>
                <strong>Price:</strong> {property.price.toLocaleString()} Fbu
              </p>
              <p>
                <strong>Type:</strong> {property.type}
              </p>
              <p>
                <strong>Property:</strong> {property.property}
              </p>
              <p>
                <strong>Bedrooms:</strong> {property.bedroom}
              </p>
              <p>
                <strong>Bathrooms:</strong> {property.bathroom}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="right-owner">
              <h3>Owner Info</h3>
              <p>
                <strong>Username:</strong> {property.user.username}
              </p>
              <p>
                <strong>Email:</strong> {property.user.email}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(property.user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
