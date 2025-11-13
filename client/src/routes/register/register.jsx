import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("locataire"); // default role is now locataire
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Unified register endpoint with role
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
        role, // "locataire" or "proprietaire"
      });

      navigate("/login");
    } catch (err) {
      let errorMessage = "";
      if (err?.response) errorMessage = err.response.data.message;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>

          {/* Role selector */}
          <div className="roleSelector">
            <label>
              <input
                type="radio"
                name="role"
                value="locataire"
                checked={role === "locataire"}
                onChange={() => setRole("locataire")}
              />
              Locataire
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="proprietaire"
                checked={role === "proprietaire"}
                onChange={() => setRole("proprietaire")}
              />
              Propriétaire
            </label>
          </div>

          <input name="username" type="text" placeholder="Username" required />
          <input name="email" type="email" placeholder="Email" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
