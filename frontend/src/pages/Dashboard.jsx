import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import Sidebar from "../components/Sidebar";
import PreviewDomain from "../components/PreviewDomain";

const Dashboard = () => {
  // const { loading } = useAuth();

  // if (loading) return <Loading />;
  return (
    <div className="flex flex-1 px-6 pb-6 max-w-[1550px] w-full mx-auto">
      <main className=" flex-1 flex">
        <Sidebar />
        <PreviewDomain />
      </main>
    </div>
  );
};

export default Dashboard;
