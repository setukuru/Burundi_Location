import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "./UpdatePostPage.scss";

function UpdatePostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiRequest.get(`/posts/${postId}`);
        const post = res.data;

        setForm(post);
        setValue(post.postDetail?.desc || "");
        setImages(post.images || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiRequest.put(`/posts/${postId}`, {
        postData: {
          ...form,
          price: parseInt(form.price),
          bedroom: parseInt(form.bedroom),
          bathroom: parseInt(form.bathroom),
          size: parseInt(form.size),
          images,
          postDetail: {
            id: form.postDetail?.id, // <-- ensure you're including this
          },
        },
        postDetail: {
          desc: value,
          size: parseInt(form.size),
        },
      });

      navigate(`/${postId}`);
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    }
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setError("");

  //     try {
  //       // Prepare the data to send
  //       const postData = {
  //         ...form,
  //         images,
  //         desc: value,
  //       };

  //       const res = await apiRequest.put(`/posts/${postId}`, postData);
  //       if (res.data) {
  //         navigate(`/${res.data.id}`);
  //       } else {
  //         setError("Failed to update post. Please try again.");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setError(err.response?.data?.message || "Something went wrong!");
  //     }
  //   };
  return (
    <div className="updatePostPage">
      <div className="formContainer">
        <h1>Update Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            {[
              { name: "title", label: "Titre", type: "text" },
              { name: "price", label: "Prix", type: "number" },
              { name: "address", label: "Adresse", type: "text" },
              { name: "city", label: "Ville", type: "text" },
              { name: "bedroom", label: "Nombre de chambres", type: "number" },
              { name: "bathroom", label: "Nombre de salles de bain", type: "number" },
              { name: "latitude", label: "Latitude", type: "text" },
              { name: "longitude", label: "Longitude", type: "text" },
              { name: "income", label: "Politique de revenu", type: "text" },
              { name: "size", label: "Taille totale (sqft)", type: "number" },
              { name: "school", label: "École", type: "number" },
              { name: "bus", label: "Bus", type: "number" },
              { name: "restaurant", label: "Restaurant", type: "number" },
            ].map(({ name, label, type }) => (
              <div className="item" key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={form[name] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="item description">
              <label>Description</label>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>

            <div className="item">
              <label>Type</label>
              <select
                name="type"
                value={form.type || ""}
                onChange={handleChange}
              >
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>

            <div className="item">
              <label>Propriété</label>
              <select
                name="property"
                value={form.property || ""}
                onChange={handleChange}
              >
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="condo">Condo</option>
                {/* <option value="land">Terrain</option> */}
              </select>
            </div>

            <div className="item">
              <label>Utilities Policy</label>
              <select
                name="utilities"
                value={form.utilities || ""}
                onChange={handleChange}
              >
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            <div className="item">
              <label>Pet Policy</label>
              <select name="pet" value={form.pet || ""} onChange={handleChange}>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>

            <button className="sendButton">Update</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>

      <div className="sideContainer">
        {images.map((image, index) => (
          <div className="imagePreview" key={index}>
            <img src={image} alt={`preview-${index}`} />
            <button
              type="button"
              className="removeImageButton"
              onClick={() =>
                setImages((prev) => prev.filter((img) => img !== image))
              }
            >
              Remove
            </button>
          </div>
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
  );
}

export default UpdatePostPage;
