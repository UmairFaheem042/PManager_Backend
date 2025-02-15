import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useAuth } from "../context/UserContext";
import AddDomain from "./AddDomain";

const Sidebar = () => {
  const {
    domains,
    selectedDomain,
    setSelectedDomain,
    loading,
    isModalOpen,
    setIsModalOpen,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  function handleOptionClick(domainId) {
    setSelectedDomain(domainId);
  }

  if (loading)
    return (
      <div className="w-[250px] md:w-[300px] lg:w-[400px] pr-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );

  return (
    <aside className="w-[250px] md:w-[300px] lg:w-[400px] pr-4 ">
      <div className="flex gap-2">
        <input
          type="text"
          className="border border-gray-200 text-sm w-full outline-none rounded-md p-2 placeholder:text-gray-300 focus:bg-purple-50 active:bg-purple-50"
          placeholder="search with name and tags"
        />
        <Button
          label={"S"}
          customClass={
            "bg-purple-400 text-white hover:bg-purple-700 active:bg-purple-700 focus:bg-purple-700"
          }
        />
      </div>

      <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
        <span>Sort By: </span>
        <p className="flex gap-2">
          <span className="active cursor-pointer">Name</span>
          <span className="cursor-pointer">Date</span>
        </p>
      </div>

      {/* <h1 className="mt-4 text-gray-400">Showing <span className="text-black">All domains</span></h1> */}

      <ul className="mt-4 flex flex-col gap-2 h-[65vh] overflow-y-scroll">
        {domains.map((domain) => (
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
                <span className="text-black line-clamp-1">{domain?.name}</span>
                <span className="text-[0.7rem] text-gray-600 italic font-normal line-clamp-1">
                  {domain?.email}
                </span>
              </p>
            </div>
            <div
              className="hover:text-gray-600 font-semibold text-gray-400"
              // onClick={handleOptionClick}
            >
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

      {/* <AddDomain /> */}
      <AddDomain isOpen={isOpen} setIsOpen={setIsOpen} />
    </aside>
  );
};

export default Sidebar;
