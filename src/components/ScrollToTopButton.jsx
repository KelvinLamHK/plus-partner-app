import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add scroll event listener to show/hide the button
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 550) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    
    <div
      className={`scroll-to-top-button ${isVisible ? "visible " : "hidden"}`}
      onClick={handleClick}
    >
<button
  type="button"
  data-te-ripple-init
  data-te-ripple-color="light"
  className="fixed bottom-12 right-5 inline-block rounded-full bg-ft-light p-3 uppercase leading-normal text-white  transition duration-150 ease-in-out ">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    strokeWidth="2.5"
    stroke="currentColor"
    className="h-4 w-4">
    <path
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
      clipRule="evenodd" />
  </svg>
</button>
    </div>
  );
};

export default ScrollToTopButton;