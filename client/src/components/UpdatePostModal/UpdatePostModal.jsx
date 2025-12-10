import { createPortal } from "react-dom";
import { useState } from "react";
import "./UpdatePostModal.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../uploadWidget/UploadWidget";

function UpdatePostModal({ post, onClose, onUpdated }) {
  const [value, setValue] = useState(post.postDetail?.desc || "");
  const [images, setImages] = useState(post.images || []);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/posts/${post.id}`, {
        postData: {
          // Don't include: id, createdAt, userId
          title: inputs.title,
          price: parseInt(inputs.price) || 0,
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom) || 0,
          bathroom: parseInt(inputs.bathroom) || 0,
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images,
          rented: post.rented, // Keep existing value if not changing
        },
        postDetail: {
          id: post.postDetail?.id, // This is needed for the relation update
          desc: value,
          size: post.postDetail?.size, // Keep existing values
          daysVisit: post.postDetail?.daysVisit, // Keep existing values
        },
      });

      onClose();
      onUpdated(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed!");
    }
  };

  // --- Main modal markup ---
  const modalContent = (
    <div className="_myModalOverlay">
      <div className="_myModalContent">
        <h2>Update Post</h2>
        <button className="closeBtn" onClick={onClose}>
          ✖
        </button>

        <div className="_myModalBody">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Titre</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={post.title}
              />
            </div>
            <div className="item">
              <label htmlFor="price">Prix</label>
              <input
                id="price"
                name="price"
                type="number"
                defaultValue={post.price}
              />
            </div>
            <div className="item">
              <label htmlFor="address">Adresse</label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={post.address}
              />
            </div>
            <div className="item description">
              <label>Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">Ville</label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={post.city}
              />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Nombre de chambres</label>
              <input
                id="bedroom"
                name="bedroom"
                type="number"
                defaultValue={post.bedroom}
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Nombre de salles de bain</label>
              <input
                id="bathroom"
                name="bathroom"
                type="number"
                defaultValue={post.bathroom}
              />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                defaultValue={post.latitude}
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                defaultValue={post.longitude}
              />
            </div>

            <button className="sendButton">Mettre à jour</button>
            {error && <span>{error}</span>}
          </form>

          <div className="sideContainer">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
            <UploadWidget
              uwConfig={{
                multiple: true,
                cloudName: "lamadev",
                uploadPreset: "estate",
                folder: "posts",
              }}
              setState={setImages}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // --- Render at root level ---
  return createPortal(modalContent, document.body);
}

export default UpdatePostModal;
