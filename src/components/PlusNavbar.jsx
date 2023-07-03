import { Transition } from "@headlessui/react";
import Dropdown from "react-bootstrap/Dropdown";
import NWL_bilingual from "../img/NWL_bilingual.png";
import "../css/Navbarcss.css";
import { useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import user from "../img/user.png";
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';

const PlusNavbar = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('中IEN');
  const {t, i18n } = useTranslation();

  const trigger = useRef(null);
  const dropdown = useRef(null);
  // close on click outside
  useEffect(() => {
 
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef()

  const handleLanguageChange = (language) => {
    Cookies.set('language', language); // Save selected language to cookie
    setSelectedLanguage(language);
    // Perform any additional logic or API calls for language change if needed
    window.location.reload(); // Refresh the page

  };
  

  return (
    <div>
      <nav className="shadow ">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 md:flex md:justify-center md:w-deflaut">
       
          <div className="flex items-center justify-between w-full h-16">
             <div className="w-auto">
            <div className="flex items-center ">
              <div className="flex-shrink-0">
                <img
                  className="h-12 pointer"
                  src={NWL_bilingual}
                  alt="Workflow"
                  onClick={() => {
                    window.location = "/home";
                  }}
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4 ">
                <Dropdown>
                {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
                  <>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {t('nav.cms')}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      href="/BrokerCom"
                      className={
                        location.pathname === "/BrokerCom" ? " cursor-default pointer-events-none active text-center bg-ft" : "inactive text-center hover:bg-ft-light hover:text-white active:bg-ft"
                      }
                    >
                      {t('nav.cms.brokerComm')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{ textAlign: "center" }}
                      className={
                        location.pathname === "/Categories" ? " cursor-default pointer-events-none active text-center bg-ft" : "inactive text-center hover:bg-ft-light hover:text-white active:bg-ft"
                      }
                      href="/Categories"
                    >
                      {t('nav.cms.categories')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{ textAlign: "center" }}
                      className={
                        location.pathname === "/EventCalendar" ? " cursor-default pointer-events-none active text-center bg-ft" : "inactive text-center hover:bg-ft-light hover:text-white active:bg-ft"
                      }
                      href="/EventCalendar"
                    >
                      {t('nav.cms.eventCal')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{ textAlign: "center" }}
                      className={
                        location.pathname === "/QuickLinks" ? " cursor-default pointer-events-none active text-center bg-ft" : "inactive text-center hover:bg-ft-light hover:text-white active:bg-ft"
                      }
                      href="/QuickLinks"
                    >
                      {t('nav.cms.quickLink')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                  </>:<></>}
                </Dropdown>
                  <a className="m-16 relative group " href="/Campaign">
                    <span
                      className={
                        location.pathname === "/Campaign"
                          ? "text-ft-light hover:text-ft-light font-bold"
                          : "text-gray-900"
                      } 
                    >
                      {t('nav.campaign')}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-1 bg-ft-light transition-all group-hover:w-full">
                      {" "}
                    </span>
                  </a>

                  <a className="m-16 relative group" href="/DocCenter">
                  <span
                      className={
                        location.pathname === "/DocCenter"
                          ? "text-ft-light hover:text-ft-light font-bold"
                          : "text-gray-900"
                      } 
                    >
                      {t('nav.docCenter')}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-0 h-1 bg-ft-light transition-all group-hover:w-full"></span>
                  </a>
                </div>
              </div>
            </div>
            </div>
            <div>
            <div className="hidden md:block">
              <div className="flex  items-center h-16">
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic">
                    中IEN
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      className={selectedLanguage === 'en' ? "active text-center" : "inactive text-center hover:bg-ft-light hover:text-white active:bg-ft"}
                      onClick={() => handleLanguageChange('en')}
                    >
                      EN
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={selectedLanguage === 'zh' ? "active text-center" : "inactive text-center hover:bg-ft-light hover:text-white active:bg-ft"}
                      onClick={() => handleLanguageChange('zh')}
                    >
                      繁
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={selectedLanguage === 'sim' ? "active text-center" : "inactive text-center hover:bg-ft-light hover:text-white active:bg-ft"}
                      onClick={() => handleLanguageChange('sim')}
                    >
                      簡
                    </Dropdown.Item>
                  </Dropdown.Menu>

                </Dropdown>
                {/*  Divider */}
                <hr className="w-px h-6 bg-slate-400 mx-3 " />
                <img
                      className="w-8 h-8 rounded-full"
                      src={user}
                      width="32"
                      height="32"
                      alt="User"
                    />
                <Dropdown>
                  <Dropdown.Toggle  id="dropdown-basic">
                  
                
                      <span className="truncate text-sm font-medium group-hover:text-slate-800">
                        {props.userInformation.username}
                      </span>
              
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      href="/login"
                      className="hover:bg-ft-light hover:text-white active:bg-ft"
                      onClick={() => {Cookies.remove('PLUSID')}}>
                      {t('nav.logout')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-ft inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-ft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
            <div ref={divRef} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
           
              <a
                href="/Campaign"
                className={
                  location.pathname === "/Campaign"
                    ? "text-ft-light hover:text-ft-light font-bold  block px-3 py-2 rounded-md text-base"
                    : "text-ft hover:bg-ft-light hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                } 
              >
               {t('nav.campaign')}
              </a>
              <a
                href="/DocCenter"
                className={
                  location.pathname === "/DocCenter"
                    ? "text-ft-light hover:text-ft-light font-bold  block px-3 py-2 rounded-md text-base"
                    : "text-ft hover:bg-ft-light hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                } 
              >
                {t('nav.docCenter')}
              </a>
              <p className="text-f block px-3 py-2 rounded-md text-base font-medium -mb-3">
              {t('nav.cms')}
            </p>
            <a
                href="/BrokerCom"
                className={
                  location.pathname === "/BrokerCom"
                    ? "text-ft-light hover:text-ft-light font-bold  block px-3 py-2 rounded-md text-base ml-3"
                    : "text-ft hover:bg-ft-light hover:text-white block px-3 py-2 rounded-md text-base font-medium ml-3"
                } 
              >
                {t('nav.cms.brokerComm')}
            </a>
            <a
                href="/Categories"
                className={
                  location.pathname === "/Categories"
                    ? "text-ft-light hover:text-ft-light font-bold  block px-3 py-2 rounded-md text-base ml-3"
                    : "text-ft hover:bg-ft-light hover:text-white block px-3 py-2 rounded-md text-base font-medium ml-3"
                } 
              >
                 {t('nav.cms.categories')}
            </a>
            <a
                href="/EventCalendar"
                className={
                  location.pathname === "/EventCalendar"
                    ? "text-ft-light hover:text-ft-light font-bold  block px-3 py-2 rounded-md text-base ml-3"
                    : "text-ft hover:bg-ft-light hover:text-white block px-3 py-2 rounded-md text-base font-medium ml-3"
                } 
              >
                {t('nav.cms.eventCal')}
            </a>
            <a
                href="/QuickLinks"
                className={
                  location.pathname === "/QuickLinks"
                    ? "text-ft-light hover:text-ft-light font-bold  block px-3 py-2 rounded-md text-base ml-3"
                    : "text-ft hover:bg-ft-light hover:text-white block px-3 py-2 rounded-md text-base font-medium ml-3"
                } 
              >
                {t('nav.cms.quickLink')}
            </a>
              <a

                className="text-ft hover:bg-ft-light hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                href="/login"
               onClick={() => {Cookies.remove('PLUSID')}}
              >
                {t('nav.logout')}
              </a>
              <div className="flex px-3 py-2 rounded-md text-base font-medium ">
              <div className="flex justify-center">
                <div className="flex justify-center w-1/3 text-center">
                  <p
                    className={`w-16 mb-0 text-${selectedLanguage === 'EN' ? 'white bg-ft hover:text-white' : 'ft bg-white'} block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => handleLanguageChange('EN')}
                  >
                    EN
                  </p>
                </div>
                <div className="flex justify-center w-1/3 text-center">
                  <p
                    className={`w-16 mb-0 text-${selectedLanguage === '繁' ? 'ft bg-white' : 'ft bg-white'} block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => handleLanguageChange('繁')}
                  >
                    繁
                  </p>
                </div>
                <div className="flex justify-center w-1/3 text-center">
                  <p
                    className={`w-16 mb-0 text-${selectedLanguage === '简' ? 'ft bg-white' : 'ft bg-white'} block px-3 py-2 rounded-md text-base font-medium`}
                    onClick={() => handleLanguageChange('简')}
                  >
                    简
                  </p>
                </div>
              </div>
                
              </div>
        
            </div>
          </div>
          
          )}
        </Transition>
      </nav>
    </div>
  );
};

export default PlusNavbar;
