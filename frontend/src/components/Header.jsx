import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "/src/assets/logo.png"

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  const authNavigation = [
    { name: "Dashboard", href: "/" },
    // { name: "Settings", href: "/settings" },
    { name: "Sign Out", href: "/sign-in" },
  ];

  const guestNavigation = [
    { name: "Sign Up", href: "sign-up" },
    { name: "Sign In", href: "sign-in" },
  ];

  const navigation = isAuthenticated ? authNavigation : guestNavigation;

  return (
    <header className="bg-white w-full  sticky inset-x-0 top-0 z-50">
      <nav className="max-w-[1550px] w-full mx-auto flex items-center justify-between p-6 lg:px-6 ">
        <div className="flex md:flex-1">
          <Link to={"/"}>
            <img src={logo} className="w-[120px]" alt="GatherPro" />
          </Link>
        </div>
        <div className="flex md:hidden">
          <button
            className="-m-2.5 cursor-pointer inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="">Menu</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute bg-white inset-x-0 top-0 z-50">
            <button
              className="absolute right-10 top-6 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              X
            </button>
            <div className="flex items-center justify-center min-h-screen flex-col p-6 gap-y-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        <div className="text-[0.9rem] hidden md:flex items-center md:gap-x-12">
          {navigation.map((item) =>
            item.name === "Sign Out" ? (
              <button
                key={item.name}
                className="px-4 py-2 rounded-md cursor-pointer bg-black text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignOut();
                }}
              >
                {item.name}
              </button>
            ) : (
              <NavLink key={item.name} to={item.href} className="text-gray-700">
                {item.name}
              </NavLink>
            )
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
