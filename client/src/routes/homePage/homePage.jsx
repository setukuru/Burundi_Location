import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import PropertyDetailModal from "../PropertyDetailModal/PropertyDetailModal";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate(); // Added
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Handle property click with authentication check
  const handlePropertyClick = (property) => {
    if (!currentUser) {
      alert("Vous devez être connecté pour voir cette annonce !");
      navigate("/login"); // redirect to login page
      return;
    }
    setSelectedProperty(property);
  };

  useEffect(() => {
    const fetchRandomProperties = async () => {
      try {
        const res = await apiRequest.get("/posts");
        const allProperties = res.data;

        // Mélanger le tableau et prendre 3 propriétés aléatoires
        const shuffled = [...allProperties].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        setProperties(selected);
      } catch (err) {
        console.error("Échec de la récupération des propriétés :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProperties();
  }, []);

  return (
    <div className="homePage">
      <section className="hero-section">
        <SearchBar />
      </section>

      <h3 className="section-title">Propriétés en Vedette</h3>

      {loading ? (
        <p>Chargement des propriétés...</p>
      ) : (
        <div className="wrapper-grid-here">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              post={property}
              onClick={() => handlePropertyClick(property)}
              style={{ cursor: currentUser ? "pointer" : "not-allowed" }} // Added style
            />
          ))}
        </div>
      )}

      {selectedProperty && (
        <PropertyDetailModal
          post={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
