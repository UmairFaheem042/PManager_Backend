import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/UserContext";
import Loading from "./Loading";

const AddDomain = ({ isOpen, setIsOpen }) => {
  const { createDomain, loading } = useAuth();

  const dialogRef = useRef(null);

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: null,
    description: "",
    tags: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setFormData((prev) => ({
        ...prev,
        icon: file,
      }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("tags", formData.tags);

      if (image) {
        formDataToSend.append("image", image);
      }

      createDomain(formDataToSend, setIsOpen);
    } catch (error) {
      console.log("Unable to create new domain", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <dialog
      ref={dialogRef}
      className="absolute  left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 w-[600px] rounded-lg shadow-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Type domain name"
            required
            className="text-sm border border-gray-200 outline-none rounded p-2 placeholder:text-gray-300 focus:bg-purple-50 active:bg-purple-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal">Icon:</label>
          <input
            type="file"
            name="icon"
            onChange={handleImageChange}
            // onChange={handleChange}
            className="text-sm border border-gray-200 outline-none rounded p-2 
          file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
          file:text-sm file:font-semibold file:bg-purple-50 
          file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal">Description:</label>
          <textarea
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe this domain"
            className="resize-none text-sm border border-gray-200 outline-none rounded p-2 placeholder:text-gray-300 focus:bg-purple-50 active:bg-purple-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal">Tags:</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="type, like, this"
            className="text-sm border border-gray-200 outline-none rounded p-2 placeholder:text-gray-300 focus:bg-purple-50 active:bg-purple-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter Email"
            className="text-sm border border-gray-200 outline-none rounded p-2 placeholder:text-gray-300 focus:bg-purple-50 active:bg-purple-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter Password"
            className="text-sm border border-gray-200 outline-none rounded p-2 placeholder:text-gray-300 focus:bg-purple-50 active:bg-purple-50"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer bg-black text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Create
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default AddDomain;
