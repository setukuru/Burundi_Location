import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/Card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useSearchParams } from "react-router-dom";
import { Suspense, useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // import auth context

function ListPage() {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const data = useLoaderData();
  const [searchParams] = useSearchParams();
  const { currentUser } = useContext(AuthContext); // get logged-in user

  const propertyType = searchParams.get("property");
  const city = searchParams.get("city");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  useEffect(() => {
    if (data.postResponse) {
      data.postResponse
        .then((postResponse) => {
          const filtered = postResponse.data.filter((post) => {
            const matchesProperty =
              !propertyType || post.property === propertyType.toLowerCase();
            const matchesCity =
              !city || post.city.toLowerCase() === city.toLowerCase();
            const matchesPrice =
              (!minPrice || post.price >= parseInt(minPrice)) &&
              (!maxPrice || post.price <= parseInt(maxPrice));

            return matchesProperty && matchesCity && matchesPrice;
          });
          setFilteredPosts(filtered);
        })
        .catch((error) => {
          console.error("Error filtering posts:", error);
        });
    }
  }, [propertyType, city, minPrice, maxPrice, data.postResponse]);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => (
                <div className="wrapper-grid">
                  {postResponse.data.map((item) => (
                    <Card
                      key={item.id}
                      item={item}
                      currentUser={currentUser} // pass current user
                    />
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ListPage;
