import React, { useState } from "react";
import Button from "./Button";
import { useAuth } from "../context/UserContext";
import AddDomain from "./AddDomain";

const Sidebar = () => {
  const {
    user,
    domains,
    selectedDomain,
    setSelectedDomain,
    loading,
    searchDomain,
    setQuery,
    query,
    setIsMobileDetailView,
    windowSize,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  function handleOptionClick(domainId) {
    setSelectedDomain(domainId);
    setIsMobileDetailView(true);
  }

  const sortedDomains = domains?.slice().sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  function handleSearch() {
    if (query !== "") searchDomain();
  }

  if (loading && user)
    return (
      <div className="w-[250px] md:w-[300px] lg:w-[400px] pr-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );

  return (
    <>
      <aside
        className={`${
          windowSize?.width > 768
            ? "w-[250px] md:w-[300px] lg:w-[400px] pr-4"
            : "w-full"
        } flex flex-col `}
      >
        <div className="flex gap-2">
          <input
            type="text"
            className="border border-gray-200 text-sm w-full outline-none rounded-md p-2 placeholder:text-gray-300 focus:bg-purple-50 active:bg-purple-50"
            placeholder="search with name and tags"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            customClass={
              "flex gap-2 items-center bg-purple-400 text-white hover:bg-purple-700 active:bg-purple-700 focus:bg-purple-700"
            }
            handleClick={handleSearch}
          >
            <i className="ri-search-line"></i>
            {windowSize?.width > 1024 && "Search"}
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
          <span>Sort By: </span>
          <p className="flex gap-2">
            <span
              className={`cursor-pointer ${
                sortBy === "name" && "text-purple-400"
              }`}
              onClick={() => setSortBy("name")}
            >
              Name
            </span>
            <span
              className={`cursor-pointer ${
                sortBy === "date" && "text-purple-400"
              }`}
              onClick={() => setSortBy("date")}
            >
              Date
            </span>
          </p>
        </div>

        <ul className="mt-4 flex-1 flex flex-col gap-2 overflow-y-scroll">
          {sortedDomains.map((domain) => (
            <li
              key={domain?._id}
              className={`text-[0.85rem] lg:text-sm hover:bg-gray-50 p-2 rounded-lg cursor-pointer flex justify-between items-center ${
                domain?._id === selectedDomain &&
                "border border-gray-200 bg-gray-50"
              }`}
              onClick={() => handleOptionClick(domain?._id)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={domain?.icon}
                  alt="icon"
                  className="w-[35px] h-[35px] rounded-full"
                />
                <p className="font-mediumflex flex-col">
                  <span className="text-black line-clamp-1">
                    {domain?.name}
                  </span>
                  <span className="text-[0.7rem] text-gray-600 italic font-normal line-clamp-1">
                    {domain?.email}
                  </span>
                </p>
              </div>
              <div className="hover:text-gray-600 font-semibold text-gray-400">
                <i className="ri-more-2-fill"></i>
              </div>
            </li>
          ))}
        </ul>

        <button
          className="w-full bg-green-400 text-white hover:bg-green-700 active:bg-green-700 focus:bg-green-700 font-medium cursor-pointer px-6 py-2 rounded-lg outline-none"
          onClick={() => setIsOpen(true)}
        >
          Add
        </button>

        <AddDomain isOpen={isOpen} setIsOpen={setIsOpen} />
      </aside>
      {/* <SidebarMobileView /> */}
    </>
  );
};

export default Sidebar;
