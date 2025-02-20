import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AppProvider({ children }) {
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [user, setUser] = useState(null);

  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [previewDomain, setPreviewDomain] = useState(null);

  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);

  async function getUser() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/users/`,
        {
          withCredentials: true,
        }
      );
      setUser(response.data.data);
    } catch (error) {
      console.log("Unable to fetch user");
      console.log(error.message);
    }
  }

  async function createDomain(formDataToSend, setIsOpen) {
    setLoading(true);

    console.log("Data received in createDomain:", formDataToSend.entries());
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/domains/create`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Domain created successfully");
      setSelectedDomain(response.data.domain._id);
      setIsOpen(false);
      await fetchAllDomains();
      setLoading(false);
    } catch (error) {
      console.log("Unable to create new domain", error);
    }
  }

  async function fetchAllDomains() {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/domains`,
        {
          withCredentials: true,
        }
      );
      setDomains(response.data.allDomains.domains);
    } catch (error) {
      console.log("Unable to fetch domains", error.message);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  async function fetchSelectedDomain() {
    if (!selectedDomain) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/domains/${selectedDomain}`,
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
        `${import.meta.env.VITE_API_URL}/api/v1/domains/delete/${domainId}`,
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
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/domains/update/${selectedDomain}`,
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
        `${import.meta.env.VITE_API_URL}/api/v1/domains/search?query=${query}`,
        { withCredentials: true }
      );
      console.log(response.data.data);
      setDomains(response.data.data);
    } catch (error) {
      console.error("Error searching domains:", error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

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
        user,
        windowSize,
        isMobileDetailView,
        setIsMobileDetailView,
        domains,
        setDomains,
        getUser,
        createDomain,
        fetchAllDomains,
        deleteDomain,
        updateDomain,
        selectedDomain,
        setSelectedDomain,
        searchDomain,
        previewDomain,
        setQuery,
        query,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
