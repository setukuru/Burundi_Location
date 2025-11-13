import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function RegisterProprietaire() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      // Use proprietaire-specific endpoint
      await apiRequest.post("/auth/register-proprietaire", {
        username,
        email,
        password,
      });

      // Redirect to proprietaire login page
      navigate("/login-proprietaire");
    } catch (err) {
      let errorMessage = "";
      if (err?.response) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create Proprietaire Account</h1>
          <input name="username" type="text" placeholder="Username" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          {error && <span className="error">{error}</span>}
          <Link to="/login-proprietaire">Already have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="background" />
      </div>
    </div>
  );
}

export default RegisterProprietaire;
