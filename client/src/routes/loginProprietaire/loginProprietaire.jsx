import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function LoginProprietaire() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [blockedInfo, setBlockedInfo] = useState(null);
  const { updateProprietaire } = useContext(AuthContext); // <-- you'll need this in your context

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login-proprietaire", {
        username,
        password,
      });

      updateProprietaire(res.data); // store proprietaire info in context
      navigate("/proprietaire/home"); // redirect after login
    } catch (err) {
      if (err.response?.status === 403) {
        const { reason, contact } = err.response.data;
        setBlockedInfo({ reason, contact });
      } else {
        setError(err.response?.data?.message || "Login failed!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Propriétaire - Connexion</h1>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Nom d'utilisateur"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Mot de passe"
          />
          <button disabled={isLoading}>Se connecter</button>
          {error && <span>{error}</span>}
          <Link to="/register-proprietaire">
            Vous n'avez pas encore de compte ?
          </Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>

      {blockedInfo && (
        <div className="blockedModal">
          <div className="modalContent">
            <h2>Votre compte a été bloqué</h2>
            <p>
              <strong>Raison :</strong> {blockedInfo.reason}
            </p>
            <p>
              Pour assistance, contactez-nous à :{" "}
              <a href={`mailto:${blockedInfo.contact}`}>
                {blockedInfo.contact}
              </a>
            </p>
            <button onClick={() => setBlockedInfo(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginProprietaire;
