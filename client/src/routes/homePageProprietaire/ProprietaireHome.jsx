import { useContext, useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../context/AuthContext";
import "./homePage.scss";
import NewPostPage from "../newPostPage/newPostPage";
import Portfolio from "../portfolio/portfolio";
// import Portfolio from "../../components/portfolio/Portfolio";

function ProprietaireHome() {
  const { currentUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="homePage proprietaireHome">
        <h2>Please log in to see your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="homePage proprietaireHome">
      <section className="hero-section">
        <SearchBar />
      </section>

      <div className="welcomeMessage">
        <h2>Welcome, {currentUser.username}!</h2>
      </div>

      {/* Portfolio Component */}
      <Portfolio userId={currentUser.id} />

      {/* Round Button */}
      <button
        className="roundButton"
        onClick={() => setShowModal(true)}
        title="Add New Post"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="_myModalOverlay" onClick={() => setShowModal(false)}>
          <div className="_myModalContent" onClick={(e) => e.stopPropagation()}>
            <button
              className="_myModalClose"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            {/* --- TEMPORARY TEST CODE --- */}
            <div style={{ padding: "20px" }}>
              {/* ... your long text here ... */}
            </div>
            <NewPostPage />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProprietaireHome;
