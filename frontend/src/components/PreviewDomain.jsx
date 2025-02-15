import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useAuth } from "../context/UserContext";

const PreviewDomain = () => {
  const { selectedDomain, previewDomain, loading, deleteDomain, updateDomain } =
    useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [addTags, setAddTags] = useState(false);

  const [domainDetail, setDomainDetail] = useState({
    name: previewDomain?.name || "",
    email: previewDomain?.email || "",
    icon:
      previewDomain?.icon ||
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
    password: previewDomain?.password || "",
    description: previewDomain?.description || "",
    tags: [],
  });

  useEffect(() => {
    if (previewDomain) {
      setDomainDetail({
        name: previewDomain.name || "",
        email:
          previewDomain.email ||
          "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
        icon: previewDomain.icon || "",
        password: previewDomain.password || "",
        description: previewDomain.description || "",
        tags: previewDomain.tags || [],
      });
    }
  }, [previewDomain]);

  function handleEditing() {
    if (isEditing) {
      const filteredPreview = Object.keys(domainDetail).reduce((obj, key) => {
        obj[key] = previewDomain[key];
        return obj;
      }, {});

      if (JSON.stringify(domainDetail) !== JSON.stringify(filteredPreview)) {
        updateDomain(domainDetail);
      }
    }

    setIsEditing((prev) => !prev);
  }

  async function handleDelete() {
    const confirmDelete = confirm("Do you really want to delete?");
    if (confirmDelete) deleteDomain(selectedDomain);
  }

  function handleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  function handleAddTags() {
    if (addTags === true) {
      console.log("Adding");
    }
    setAddTags((prev) => !prev);
  }

  if (loading)
    return (
      <div className="border border-gray-200 bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] rounded-xl px-6 py-4 flex-1 flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );

  return (
    <section className="border border-gray-200 bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] rounded-xl px-6 py-4 flex-1 flex flex-col gap-2 ">
      {previewDomain ? (
        <>
          <div className="flex gap-4 items-center w-full">
            <img
              src={domainDetail?.icon}
              alt="icon"
              className="w-[70px] h-[70px] rounded-full object-cover"
            />
            <input
              className={`w-[100%] text-6xl font-semibold ${
                isEditing && "border bg-gray-100 rounded-xl px-2 outline-none"
              } transition-all  border-gray-300`}
              value={domainDetail?.name}
              onChange={(e) =>
                setDomainDetail({ ...domainDetail, name: e.target.value })
              }
              disabled={!isEditing}
            />
            <div className="flex gap-2 items-start h-full pt-[0.05rem]">
              <Button
                customClass={
                  "bg-purple-400 text-white hover:bg-purple-700 active:bg-purple-700 focus:bg-purple-700 flex gap-2"
                }
                handleClick={handleEditing}
                label={isEditing ? "Save" : "Edit"}
              >
                {isEditing ? (
                  <i className="ri-pencil-fill"></i>
                ) : (
                  <i className="ri-pencil-line"></i>
                )}
              </Button>

              <Button
                customClass={
                  "bg-red-400 text-white hover:bg-red-700 active:bg-red-700 focus:bg-red-700 flex gap-2"
                }
                handleClick={handleDelete}
                label={"Delete"}
              >
                <i className="ri-delete-bin-7-line"></i>
              </Button>
            </div>
          </div>

          <h1 className="text-2xl mt-8 mb-4 font-medium">Additional Details</h1>

          {/* Email */}
          <div className="flex flex-col gap-4">
            <p className="flex flex-col text-[0.9rem] font-normal text-gray-500">
              <span className="font-normal text-gray-400">Email</span>
              <input
                type={"email"}
                value={domainDetail?.email}
                onChange={(e) =>
                  setDomainDetail({ ...domainDetail, email: e.target.value })
                }
                className={`${
                  isEditing &&
                  "border font-medium bg-gray-100 pl-2 outline-none py-2"
                } transition-all rounded-md  border-gray-300 min-w-[200px] w-[calc(0.75em_*_var(--length))]  text-black`}
                //   style={{ "--length": domainDetail.email.length || 1 }}
                disabled={!isEditing}
              />
            </p>

            {/* Password */}
            <div className="relative flex flex-col text-[0.9rem] text-gray-500 font-normal">
              <span className="font-normal text-gray-400">Password</span>
              <div className="relative inline-block w-fit">
                <input
                  type={showPassword ? "text" : "password"}
                  value={domainDetail?.password}
                  onChange={(e) =>
                    setDomainDetail({
                      ...domainDetail,
                      password: e.target.value,
                    })
                  }
                  className={`${
                    isEditing &&
                    "border font-medium bg-gray-100 pl-2 outline-none py-2"
                  } transition-all rounded-md border-gray-300 text-black min-w-[200px] w-[calc(0.75em_*_var(--length))]`}
                  // style={{ "--length": domainDetail.password.length || 1 }}
                  disabled={!isEditing}
                />
                <button
                  onClick={handleShowPassword}
                  className={`${
                    showPassword ? "ri-eye-line" : "ri-eye-close-line"
                  } absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer`}
                ></button>
              </div>
            </div>

            {/* Description */}
            <p className="flex flex-col text-[0.9rem] text-gray-500 font-normal">
              <span className="font-normal text-gray-400">Description</span>
              <textarea
                value={domainDetail?.description}
                onChange={(e) =>
                  setDomainDetail({
                    ...domainDetail,
                    description: e.target.value,
                  })
                }
                className={`${
                  isEditing &&
                  "border font-medium bg-gray-100 pl-2 outline-none py-2"
                } transition-all rounded-md border-gray-300 text-black resize-none `}
                disabled={!isEditing}
                style={{
                  height: "auto",
                  minHeight: "40px",
                  overflow: "hidden",
                }}
                ref={(textarea) => {
                  if (textarea) {
                    textarea.style.height = "auto";
                    textarea.style.height = `${textarea.scrollHeight}px`;
                  }
                }}
              />
            </p>

            {/* Tags */}
            <div className="flex flex-col text-[0.9rem] text-gray-500 font-normal">
              <span className="font-normal text-gray-400">Tags</span>
              <div className="mt-2 transition-all rounded-md border-gray-300 text-black flex gap-2">
                {previewDomain.length !== 0 &&
                  previewDomain?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="p-2 rounded-md border border-gray-300 bg-gray-100"
                    >
                      {tag}
                    </span>
                  ))}

                {addTags && (
                  <input
                    type="text"
                    placeholder="comma separated tags"
                    className="p-2 rounded-md bg-gray-100 outline-none border border-gray-300"
                  />
                )}

                {isEditing && (
                  <button
                    className="cursor-pointer px-4 py-2 rounded-md border border-gray-300"
                    onClick={handleAddTags}
                  >
                    {addTags ? <i className="ri-check-double-line"></i> : "+"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-1">
          Nothing Selected
        </div>
      )}
    </section>
  );
};

export default PreviewDomain;
