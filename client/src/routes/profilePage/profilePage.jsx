// import Chat from "../../components/chat/Chat";
// import List from "../../components/list/List";
// import "./profilePage.scss";
// import apiRequest from "../../lib/apiRequest";
// import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
// import { Suspense, useContext, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import NewPostPage from "../newPostPage/NewPostPage";

// function ProfilePage() {
//   const data = useLoaderData();
//   const { updateUser, currentUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // État pour la modale
//   const [showModal, setShowModal] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await apiRequest.post("/auth/logout");
//       updateUser(null);
//       navigate("/");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Condition : l'utilisateur est un "proprietaire"
//   const isProprietaire = currentUser && currentUser.role === "proprietaire";

//   return (
//     <div className="profilePage">
//       <div className="details">
//         <div className="wrapper">
//           <div className="title">
//             <h1>User Information</h1>
//             <Link to="/profile/update">
//               <button>Update Profile</button>
//             </Link>
//           </div>

//           <div className="info">
//             <span>
//               Avatar:
//               <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
//             </span>
//             <span>
//               Username: <b>{currentUser.username}</b>
//             </span>
//             <span>
//               E-mail: <b>{currentUser.email}</b>
//             </span>
//             <button onClick={handleLogout}>Logout</button>
//           </div>

//           {/* Conditional Rendering : My List + Create New Post button */}
//           {isProprietaire && (
//             <>
//               <div className="title">
//                 <h1>My List</h1>
//                 <button onClick={() => setShowModal(true)}>Create New Post</button>
//               </div>

//               <Suspense fallback={<p>Loading...</p>}>
//                 <Await
//                   resolve={data.postResponse}
//                   errorElement={<p>Error loading posts!</p>}
//                 >
//                   {(postResponse) => <List posts={postResponse.data.userPosts} />}
//                 </Await>
//               </Suspense>
//             </>
//           )}

//           {/* Saved List — toujours visible */}
//           <div className="title">
//             <h1>Saved List</h1>
//           </div>
//           <Suspense fallback={<p>Loading...</p>}>
//             <Await
//               resolve={data.postResponse}
//               errorElement={<p>Error loading posts!</p>}
//             >
//               {(postResponse) => <List posts={postResponse.data.savedPosts} />}
//             </Await>
//           </Suspense>
//         </div>
//       </div>

//       <div className="chatContainer">
//         <div className="wrapper">
//           <Suspense fallback={<p>Loading...</p>}>
//             <Await
//               resolve={data.chatResponse}
//               errorElement={<p>Error loading chats!</p>}
//             >
//               {(chatResponse) => {
//                 console.log("Chat Response:", chatResponse);
//                 return <Chat chats={chatResponse.data} />;
//               }}
//             </Await>
//           </Suspense>
//         </div>
//       </div>

//       {/* Modal — uniquement si l'utilisateur est propriétaire */}
//       {showModal && isProprietaire && (
//         <div className="modal-overlay-ProfilePage" onClick={() => setShowModal(false)}>
//           <div
//             className="modal-content-ProfilePage"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button className="close-modal-ProfilePage" onClick={() => setShowModal(false)}>
//               X
//             </button>
//             <NewPostPage />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProfilePage;

import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import NewPostPage from "../newPostPage/NewPostPage";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Modal create new post
  const [showModal, setShowModal] = useState(false);

  // ✅ NEW: History states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ NEW: Load history
  const handleShowHistory = async () => {
    setLoadingHistory(true);
    setShowHistoryModal(true);
    try {
      const res = await apiRequest.get("/historique");
      setHistory(res.data);
    } catch (err) {
      console.log(err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const isProprietaire = currentUser && currentUser.role === "proprietaire";

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>

          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>

            {/* ✅ NEW: View History */}
            <button onClick={handleShowHistory}>View History</button>
          </div>

          {isProprietaire && (
            <>
              <div className="title">
                <h1>My List</h1>
                <button onClick={() => setShowModal(true)}>Create New Post</button>
              </div>

              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
                >
                  {(postResponse) => <List posts={postResponse.data.userPosts} />}
                </Await>
              </Suspense>
            </>
          )}

          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Modal create new post */}
      {showModal && isProprietaire && (
        <div className="modal-overlay-ProfilePage" onClick={() => setShowModal(false)}>
          <div
            className="modal-content-ProfilePage"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal-ProfilePage" onClick={() => setShowModal(false)}>
              X
            </button>
            <NewPostPage />
          </div>
        </div>
      )}

      {/* ✅ NEW: History Modal */}
      {showHistoryModal && (
        <div className="modalOverlayH">
          <div className="modalContentH">
            <h2>User Activity History</h2>
            <button className="closeModalH" onClick={() => setShowHistoryModal(false)}>
              X
            </button>

            {loadingHistory ? (
              <p>Loading...</p>
            ) : history.length === 0 ? (
              <p>No activity found.</p>
            ) : (
              <ul>
                {history.map((h) => (
                  <li key={h.id}>
                    <b>{h.action}</b> : {h.details} —{" "}
                    {new Date(h.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
