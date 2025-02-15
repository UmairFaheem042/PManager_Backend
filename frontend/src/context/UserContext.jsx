import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AppProvider({ children }) {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [previewDomain, setPreviewDomain] = useState(null);

  async function createDomain(formDataToSend, setIsOpen) {
    setLoading(true);
    console.log("Data received in createDomain:", formDataToSend.entries());
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/domains/create",
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Domain created successfully");
      setIsOpen(false);
      await fetchAllDomains();
      setLoading(false);
    } catch (error) {
      console.log("Unable to create new domain", error);
    }
  }

  async function fetchAllDomains() {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/domains", {
        withCredentials: true,
      });
      setDomains(response.data.allDomains.domains);
    } catch (error) {
      console.log("Unable to fetch domains", error);
    }
  }

  async function fetchSelectedDomain() {
    if (!selectedDomain) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/domains/${selectedDomain}`,
        {
          withCredentials: true,
        }
      );
      setPreviewDomain(response.data.domain);
    } catch (error) {
      console.log("Unable to fetch selected domain", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDomain(domainId) {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:3000/api/v1/domains/delete/${domainId}`,
        { withCredentials: true }
      );
      console.log("Domain deleted successfully");
      setSelectedDomain("");
      fetchAllDomains();
    } catch (error) {
      console.log("Unable to delete domain", error);
    }
    setLoading(false);
  }

  async function updateDomain(updatedData) {
    console.log(updatedData);
    if (!selectedDomain) return;
    console.log("from updateDOmain function: ", updatedData);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/domains/update/${selectedDomain}`,
        updatedData,
        { withCredentials: true }
      );
      if (response.data.success) {
        setPreviewDomain(response.data.updatedDomain); // Update state
      }
    } catch (error) {
      console.log("Unable to update domain", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchAllDomains();
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetchSelectedDomain();
  }, [selectedDomain]);

  return (
    <AuthContext.Provider
      value={{
        domains,
        setDomains,
        createDomain,
        fetchAllDomains,
        deleteDomain,
        updateDomain,
        selectedDomain,
        setSelectedDomain,
        previewDomain,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
