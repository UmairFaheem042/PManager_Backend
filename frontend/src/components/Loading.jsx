import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center absolute top-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  );
};

export default Loading;
