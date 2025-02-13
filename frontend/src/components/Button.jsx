import React from "react";

const Button = ({children, label, customClass, handleClick }) => {
  return (
    <button
      className={`${customClass} font-medium cursor-pointer px-6 py-2 rounded-lg outline-none`}
      onClick={handleClick}
    >
      {label}
      {children}
    </button>
  );
};

export default Button;
