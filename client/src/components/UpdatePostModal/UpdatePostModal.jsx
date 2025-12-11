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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Validation
    const requiredFields = [
      { field: 'title', label: 'Titre' },
      { field: 'price', label: 'Prix' },
      { field: 'address', label: 'Adresse' },
      { field: 'city', label: 'Ville' },
      { field: 'bedroom', label: 'Nombre de chambres' },
      { field: 'bathroom', label: 'Nombre de salles de bain' },
      { field: 'type', label: 'Type' },
      { field: 'property', label: 'Property' }
    ];

    // Check for empty required fields
    for (const { field, label } of requiredFields) {
      if (!inputs[field]?.toString().trim()) {
        setError(`${label} est requis`);
        setIsSubmitting(false);
        return;
      }
    }

    // Check description (ReactQuill value)
    if (!value.trim()) {
      setError("Description est requise");
      setIsSubmitting(false);
      return;
    }

    // Check if description is not just empty HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    if (tempDiv.textContent.trim() === '' && tempDiv.innerHTML !== '<p><br></p>') {
      setError("Description ne peut pas être vide");
      setIsSubmitting(false);
      return;
    }

    // Check images
    if (images.length === 0) {
      setError("Au moins une image est requise");
      setIsSubmitting(false);
      return;
    }

    // Validate numeric fields
    const price = parseInt(inputs.price) || 0;
    const bedroom = parseInt(inputs.bedroom) || 0;
    const bathroom = parseInt(inputs.bathroom) || 0;

    if (price <= 0) {
      setError("Le prix doit être supérieur à 0");
      setIsSubmitting(false);
      return;
    }

    if (bedroom < 0) {
      setError("Le nombre de chambres ne peut pas être négatif");
      setIsSubmitting(false);
      return;
    }

    if (bathroom < 0) {
      setError("Le nombre de salles de bain ne peut pas être négatif");
      setIsSubmitting(false);
      return;
    }

    // Validate latitude/longitude format if provided
    if (inputs.latitude && !/^-?\d+(\.\d+)?$/.test(inputs.latitude)) {
      setError("Latitude invalide");
      setIsSubmitting(false);
      return;
    }

    if (inputs.longitude && !/^-?\d+(\.\d+)?$/.test(inputs.longitude)) {
      setError("Longitude invalide");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await apiRequest.put(`/posts/${post.id}`, {
        postData: {
          title: inputs.title.trim(),
          price: price,
          address: inputs.address.trim(),
          city: inputs.city.trim(),
          bedroom: bedroom,
          bathroom: bathroom,
          type: inputs.type.trim(),
          property: inputs.property.trim(),
          latitude: inputs.latitude?.trim() || "",
          longitude: inputs.longitude?.trim() || "",
          images,
          rented: post.rented,
        },
        postDetail: {
          id: post.postDetail?.id,
          desc: value.trim(),
          size: post.postDetail?.size,
          daysVisit: post.postDetail?.daysVisit,
        },
      });

      onClose();
      onUpdated(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Échec de la mise à jour!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Main modal markup ---
  const modalContent = (
    <div className="_myModalOverlay">
      <div className="_myModalContent">
        <h2>Modifier l&apos;annonce</h2>
        <button className="closeBtn" onClick={onClose} disabled={isSubmitting}>
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
                disabled={isSubmitting}
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
                min="1"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <div className="item description">
              <label>Description *</label>
              <ReactQuill 
                theme="snow" 
                onChange={setValue} 
                value={value}
                readOnly={isSubmitting}
              />
            </div>
            <div className="item">
              <label htmlFor="city">Ville *</label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={post.city}
                required
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                defaultValue={post.type}
                required
                disabled={isSubmitting}
              >
                <option value="">Sélectionner un type</option>
                <option value="buy">À vendre</option>
                <option value="rent">À louer</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property *</label>
              <select
                id="property"
                name="property"
                defaultValue={post.property}
                required
                disabled={isSubmitting}
              >
                <option value="">Sélectionner un type de propriété</option>
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="condo">Condo</option>
                <option value="land">Terrain</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                defaultValue={post.latitude}
                placeholder="Ex: -2.897030"
                disabled={isSubmitting}
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                defaultValue={post.longitude}
                placeholder="Ex: 29.818039"
                disabled={isSubmitting}
              />
            </div>

            <button 
              className="sendButton" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </button>
            {error && <span className="error-message">{error}</span>}
          </form>

          <div className="sideContainer">
            <div className="images-section">
              <h4>Images * ({images.length})</h4>
              {images.length === 0 && (
                <p className="image-warning">Ajoutez au moins une image</p>
              )}
              <div className="image-grid">
                {images.map((img, i) => (
                  <div key={i} className="image-item">
                    <img src={img} alt={`Preview ${i + 1}`} />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => !isSubmitting && setImages(images.filter((_, index) => index !== i))}
                      disabled={isSubmitting}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <UploadWidget
              uwConfig={{
                multiple: true,
                cloudName: "lamadev",
                uploadPreset: "estate",
                folder: "posts",
              }}
              setState={setImages}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default UpdatePostModal;
