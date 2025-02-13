import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AppProvider({ children }) {
  // const [user, setUser] = useState(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [previewDomain, setPreviewDomain] = useState(null);

  // async function fetchUser() {
  //   try {
  //     const response = await axios.get("http://localhost:3000/api/v1/users", {
  //       withCredentials: true,
  //     });
  //     setUser(response.data.user);
  //   } catch (error) {
  //     console.log("Unable to fetch user", error);
  //   }
  // }

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
      // setPreviewLoading(false);
    }
  }

  async function updateDomain(updatedData) {
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
      // await fetchUser();
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
        // user,
        // setUser,
        updateDomain,
        domains,
        setDomains,
        selectedDomain,
        setSelectedDomain,
        previewDomain,
        loading,
        previewLoading,
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
