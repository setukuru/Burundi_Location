import React, { useEffect, useState } from "react";
import Card from "../../components/dashCard/Card";
import UserTable from "../../components/dashTable/UserTable";
import PropertyTable from "../../components/propertyTable/PropertiesTable";
import BlockedUsersTable from "../../components/BlockeduserTable/BlockedUserTable";
import "./DashBoard.scss";
import apiRequest from "../../lib/apiRequest";

const Dashboard = () => {
  const [locataires, setLocataires] = useState([]);
  const [proprietaires, setProprietaires] = useState([]);
  const [properties, setProperties] = useState([]);
  const [blockedLocataires, setBlockedLocataires] = useState([]);
  const [blockedProprietaires, setBlockedProprietaires] = useState([]);
  const [activeTable, setActiveTable] = useState("locataires");

  const handleCardClick = (table) => {
    setActiveTable(table);
  };

  const handleUserUnblock = (userId) => {
    setBlockedLocataires((prev) => prev.filter((b) => b.id !== userId));
    setBlockedProprietaires((prev) => prev.filter((b) => b.id !== userId));
  };

  useEffect(() => {
    const fetchLocataires = async () => {
      try {
        const response = await apiRequest.get("/admin/locataires");
        setLocataires(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProprietaires = async () => {
      try {
        const response = await apiRequest.get("/admin/proprietaires");
        setProprietaires(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProperties = async () => {
      try {
        const response = await apiRequest.get("/admin/properties");
        setProperties(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBlockedLocataires = async () => {
      try {
        const response = await apiRequest.get("/admin/blocked/locataires");
        setBlockedLocataires(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBlockedProprietaires = async () => {
      try {
        const response = await apiRequest.get("/admin/blocked/proprietaires");
        setBlockedProprietaires(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLocataires();
    fetchProprietaires();
    fetchProperties();
    fetchBlockedLocataires();
    fetchBlockedProprietaires();
  }, []);

  return (
    <div className="dashboard">
      <div className="card-grid">
        <div onClick={() => handleCardClick("locataires")}>
          <Card
            title="Locataires"
            value={locataires.length}
            className={activeTable === "locataires" ? "active" : ""}
          />
        </div>
        <div onClick={() => handleCardClick("proprietaires")}>
          <Card
            title="Proprietaires"
            value={proprietaires.length}
            className={activeTable === "proprietaires" ? "active" : ""}
          />
        </div>
        <div onClick={() => handleCardClick("properties")}>
          <Card
            title="Annonces"
            value={properties.length}
            className={activeTable === "properties" ? "active" : ""}
          />
        </div>
        <div onClick={() => handleCardClick("blockedLocataires")}>
          <Card
            title="Locataires bloqués"
            value={blockedLocataires.length}
            className={activeTable === "blockedLocataires" ? "active" : ""}
          />
        </div>
        <div onClick={() => handleCardClick("blockedProprietaires")}>
          <Card
            title="Proprietaires bloqués"
            value={blockedProprietaires.length}
            className={activeTable === "blockedProprietaires" ? "active" : ""}
          />
        </div>
      </div>

      <div className="table-section fade-in">
        {activeTable === "locataires" && <UserTable users={locataires} />}
        {activeTable === "proprietaires" && <UserTable users={proprietaires} />}
        {activeTable === "properties" && (
          <PropertyTable properties={properties} />
        )}
        {activeTable === "blockedLocataires" && (
          <BlockedUsersTable
            blockedUsers={blockedLocataires}
            onUnblock={handleUserUnblock}
          />
        )}
        {activeTable === "blockedProprietaires" && (
          <BlockedUsersTable
            blockedUsers={blockedProprietaires}
            onUnblock={handleUserUnblock}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
