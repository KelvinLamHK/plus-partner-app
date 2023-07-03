import React from "react";


const Searchbar = () => {
  return (
    <div className="flex items-center mt-4">
    <div className="flex space-x-1">
        <input
            type="text"
            className="block w-full px-4 py-2 text-ft bg-white border rounded-full focus:border-ft focus:ring-ft focus:outline-none focus:ring focus:ring-opacity-40"
            placeholder="Search..."
        />
        <button className="px-4 text-white bg-ft-light rounded-full hover:bg-ft-light active:text-ft active:bg-white active:ring-ft active:ring-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </button>
    </div>
</div>
  );
};

export default Searchbar;