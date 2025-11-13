import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [blockedInfo, setBlockedInfo] = useState(null);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", { username, password });

      // Update user context
      updateUser(res.data);

      // Redirect normal users
      if (res.data.role === "proprietaire") {
        navigate("/proprietaire/home");
      } 
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        // Default redirect for locataire or any other role
        navigate("/");
      }

      // Admins will still log in; handle /admin/dashboard in protected route logic
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 403) {
        const { reason, contact } = err.response.data;
        setBlockedInfo({ reason, contact });
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>

          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />

          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}

          <Link to="/register">Dont have an account?</Link>
        </form>
      </div>

      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>

      {blockedInfo && (
        <div className="blockedModal">
          <div className="modalContent">
            <h2>Your account has been blocked</h2>
            <p>
              <strong>Reason:</strong> {blockedInfo.reason}
            </p>
            <p>
              For assistance, contact us at:{" "}
              <a href={`mailto:${blockedInfo.contact}`}>
                {blockedInfo.contact}
              </a>
            </p>
            <button onClick={() => setBlockedInfo(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
