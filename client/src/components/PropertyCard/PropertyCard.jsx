import "./propertyCard.scss";

function PropertyCard({ post, onClick, onEdit }) {
  return (
    <div className="propertyCard">
      <div className="cardImage" onClick={onClick}> {/* click to view details */}
        <img src={post.images[0]} alt={post.title} />
        <span className={`propertyType ${post.type}`}>{post.type}</span>
      </div>
      <div className="cardBody" onClick={onClick}> {/* click to view details */}
        <h4 className="title">{post.title}</h4>
        <p className="location">{post.city}</p>
        <p className="price">{post.price.toLocaleString()} Fbu</p>
        <div className="details">
          <span>{post.bedroom} 🛏</span>
          <span>{post.bathroom} 🛁</span>
          <span>{post.property}</span>
        </div>
      </div>
      <button className="editButton" onClick={(e) => { 
        e.stopPropagation(); // prevent opening detail modal
        onEdit();
      }}>
        Edit
      </button>
    </div>
  );
}

export default PropertyCard;
