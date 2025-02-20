import React, { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";

const Setting = () => {
  const { user, getUser } = useAuth();
  const [updatedData, setUpdatedData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    createdAt: user?.createdAt || "",
    updatedAt: user?.updatedAt || "",
  });

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleChange(e) {
    setUpdatedData({
      ...updatedData,
      [e.target.name1]: e.target.value,
    });
  }
  // useEffect(() => {
  //   getUser();
  // }, []);
  return (
    <div className="flex flex-1 px-6 pb-6 max-w-[1550px] w-full mx-auto">
      <main className="w-full">
        <h1 className="text-4xl mb-5 font-semibold">Settings</h1>
        {/* Edit User */}
        <div className=" w-full flex items-center justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm text-gray-400">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={updatedData?.firstName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm text-gray-400">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={updatedData?.lastName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Setting;
