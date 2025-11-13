import { useContext, useState } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Add navigate for programmatic navigation

  // Destructure isProprietaire directly from the context
  const { currentUser, isProprietaire } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

  // Handle logo click with navigate to prevent full reload
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav>
      <div className="left">
        {/* Replace a tag with Link or use navigate */}
        <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>Burundi-Location</span>
        </Link>
        {/* Alternative: if you prefer using onClick */}
        {/* <a href="/" className="logo" onClick={handleLogoClick}>
          <img src="/logo.png" alt="" />
          <span>Burundi-Location</span>
        </a> */}
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            <span>{currentUser.username}</span>
            {/* Use the isProprietaire boolean for the conditional link */}
            <Link
              to={isProprietaire ? "/proprietaire/profile" : "/profile"}
              className="profile"
            >
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            {/* FIXED: Replace a tags with Link components */}
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/agents">Agents</Link>
          <Link to="/logout" onClick={() => {/* handle logout */}}>
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;