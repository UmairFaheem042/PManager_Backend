import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AppProvider({ children }) {
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [previewDomain, setPreviewDomain] = useState(null);
  const [query, setQuery] = useState("");
  // const [searchedDomain, setSearchedDomain] = useState()

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
      setPreviewDomain(null);
      fetchAllDomains();
    } catch (error) {
      console.log("Unable to delete domain", error);
    }
    setLoading(false);
  }

  async function updateDomain(updatedData) {
    if (!selectedDomain) return;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/domains/update/${selectedDomain}`,
        updatedData,
        { withCredentials: true }
      );
      if (response.data.success) {
        setPreviewDomain(response.data.updatedDomain);
      }
    } catch (error) {
      console.log("Unable to update domain", error);
    }
  }

  async function searchDomain() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/domains/search?query=${query}`,
        { withCredentials: true }
      );
      console.log(response.data.data);
      setDomains(response.data.data);
    } catch (error) {
      console.error("Error searching domains:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchAllDomains();
      setLoading(false);
    }
    fetchData();
  }, [query]);

  useEffect(() => {
    fetchSelectedDomain();
  }, [selectedDomain]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <AuthContext.Provider
      value={{
        isMobileDetailView,
        setIsMobileDetailView,
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
        searchDomain,
        setQuery,
        query,
        windowSize
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
