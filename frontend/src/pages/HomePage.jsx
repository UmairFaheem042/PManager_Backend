import React from "react";
import Button from "../components/Button";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const HomePage = () => {
  const { loading } = useAuth();
  if (loading) return <Loading />;

  return (
    <div className="flex flex-1 px-6 pb-6 ">
      <section className="border border-gray-200 bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] rounded-xl p-2 flex-1 flex flex-col items-center justify-center gap-10 text-center">
        <h6 className="text-[0.85rem] lg:text-sm text-gray-400 border border-gray-300 rounded-full px-4 py-2">
        <i className="ri-lock-line"></i>{" "}Secure, Simple, and Smart Password Management
        </h6>
        <h1 className="lg:leading-16 text-4xl md:text-5xl lg:text-6xl font-bold">
          Your Passwords, Safe and <br /> Accessible Anytime
        </h1>
        <p className="text-[0.85rem] lg:text-md text-gray-500 md:w-[80%] lg:w-[70%] font-medium">
          Manage and store all your passwords securely in one place. With
          end-to-end encryption and seamless access, never worry about
          forgetting a password again.
        </p>
        <NavLink to={"/sign-up"}>
          <Button
            label={"Get Started"}
            customClass={
              "bg-purple-400 text-white hover:bg-purple-700 active:bg-purple-700 focus:bg-purple-700 "
            }
          />
        </NavLink>
      </section>
    </div>
  );
};

export default HomePage;
