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
    setError(""); // Clear previous errors
    
    // Validate required fields
    if (!value.trim()) {
      setError("Description is required");
      return;
    }
    
    if (images.length === 0) {
      setError("At least one image is required");
      return;
    }

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Validate form inputs
    const requiredFields = ['title', 'price', 'address', 'city', 'bedroom', 'bathroom', 'type', 'property'];
    for (const field of requiredFields) {
      if (!inputs[field]?.toString().trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }

    try {
      const res = await apiRequest.put(`/posts/${post.id}`, {
        postData: {
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
          rented: post.rented,
        },
        postDetail: {
          id: post.postDetail?.id,
          desc: value,
          size: post.postDetail?.size,
          daysVisit: post.postDetail?.daysVisit,
        },
      });

      onClose();
      onUpdated(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed!");
    }
  };

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
              <label htmlFor="title">Titre *</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={post.title}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="price">Prix *</label>
              <input
                id="price"
                name="price"
                type="number"
                defaultValue={post.price}
                required
                min="0"
              />
            </div>
            <div className="item">
              <label htmlFor="address">Adresse *</label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={post.address}
                required
              />
            </div>
            <div className="item description">
              <label>Description *</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">Ville *</label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={post.city}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Nombre de chambres *</label>
              <input
                id="bedroom"
                name="bedroom"
                type="number"
                defaultValue={post.bedroom}
                required
                min="0"
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Nombre de salles de bain *</label>
              <input
                id="bathroom"
                name="bathroom"
                type="number"
                defaultValue={post.bathroom}
                required
                min="0"
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                defaultValue={post.type}
                required
              >
                <option value="">Select type</option>
                <option value="maison">Maison</option>
                <option value="appartement">Appartement</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property Type *</label>
              <select
                id="property"
                name="property"
                defaultValue={post.property}
                required
              >
                <option value="">Select property type</option>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
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

            <button className="sendButton" type="submit">Mettre à jour</button>
            {error && <span className="error">{error}</span>}
          </form>

          <div className="sideContainer">
            <div className="imageUploadSection">
              <h4>Images *</h4>
              {images.length === 0 && <p className="imageWarning">At least one image is required</p>}
              <div className="imagePreview">
                {images.map((img, i) => (
                  <div key={i} className="imageItem">
                    <img src={img} alt={`Preview ${i + 1}`} />
                    <button 
                      type="button" 
                      className="removeImage"
                      onClick={() => setImages(images.filter((_, index) => index !== i))}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
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
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default UpdatePostModal;
