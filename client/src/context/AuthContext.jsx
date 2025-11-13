import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Stocke l'utilisateur courant avec son rôle
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Met à jour l'utilisateur (après login/register)
  const updateUser = (data) => {
    // data contient id, username, email, role, avatar, etc.
    setCurrentUser(data);
  };

  // Logout
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateUser,
        logoutUser,
        isLocataire: currentUser?.role === "locataire",
        isProprietaire: currentUser?.role === "proprietaire",
        isAdmin: currentUser?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
