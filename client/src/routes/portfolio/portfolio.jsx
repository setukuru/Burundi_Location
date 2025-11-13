import { useContext, useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import "./portfolio.scss";
import { AuthContext } from "../../context/AuthContext";
import UpdatePostModal from "../../components/UpdatePostModal/UpdatePostModal";
import PropertyDetailModal from "../PropertyDetailModal/PropertyDetailModal";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
// import PropertyCard from "../../components/PropertyCard/PropertyCard";
// import UpdatePostModal from "../components/UpdatePostModal/UpdatePostModal";
// import PropertyDetailModal from "../components/PropertyDetailModal/PropertyDetailModal";

function Portfolio() {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // for PropertyDetailModal
  const [editPost, setEditPost] = useState(null); // for UpdatePostModal

  useEffect(() => {
    if (!currentUser) return;

    const fetchPosts = async () => {
      try {
        const res = await apiRequest.get("/posts", {
          params: { userId: currentUser.id },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentUser]);

  if (!currentUser) return <p>Please log in to see your portfolio.</p>;
  if (loading) return <p>Loading your portfolio...</p>;
  if (!posts.length) return <p>You have no properties listed yet.</p>;

  return (
    <div className="portfolio">
      <h3>Your Current Properties</h3>
      <div className="portfolioGrid">
        {posts.map((post) => (
          <PropertyCard
            key={post.id}
            post={post}
            onClick={() => setSelectedPost(post)} // view details
            onEdit={() => setEditPost(post)} // edit
          />
        ))}
      </div>

      {/* View full property detail */}
      {selectedPost && (
        <PropertyDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Update post modal */}
      {editPost && (
        <UpdatePostModal
          post={editPost}
          onClose={() => setEditPost(null)}
          onUpdated={(updated) => {
            setPosts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setEditPost(null);
          }}
        />
      )}
    </div>
  );
}

export default Portfolio;
