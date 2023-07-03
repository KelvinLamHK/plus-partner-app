/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Cookies from "js-cookie";
import PlusNavbar from "../components/PlusNavbar";
// import LoadingScreen from "../components/LoadingScreen";
import "../css/LandingPagecss.css"
import Calendar from "../components/Calendar"
// import Searchbar from "../components/Searchbar"
import NoItem from "../components/NoItem";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import {API_BASE_URL} from '../api.config.js';
import { useNavigate} from 'react-router-dom';

function LandingPage() {
  const [userInformation, setUserInformation] = useState([]);
  const token = Cookies.get("PLUSID");
  const [links, setLinks] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [isPin, setIsPin] = useState([]);
  const [isPromo, setIsPromo] = useState([]);
  const [isMobileScreen, setIsMobileScreen] = useState(((window.innerWidth <= 1250)?true:false));
  // const [isXsMobileScreen, setXsIsMobileScreen] = useState(((window.screen.width<= 385)?true:false));

  useEffect(() => {
    function handleResize() {
      setIsMobileScreen(window.innerWidth <= 1250);
      // setXsIsMobileScreen(window.screen.width<= 385);
    }
  
    handleResize();
    window.addEventListener("resize", handleResize);
  
    // Add this block to update isMobileScreen when the screen size is larger than 1207 pixels
    return () => {
      window.removeEventListener("resize", handleResize);
      setIsMobileScreen(false);
      // setXsIsMobileScreen(false);
    };
  }, []);
  
  useEffect(() => {
    async function fetchData() {
      const deviceId = await getCurrentBrowserFingerPrint();
      if (!token) {
        window.location.href = "/login";
      } else {
        try {
          fetch(`${API_BASE_URL}/authentication/protected`, {
            method: 'POST',
            body: JSON.stringify({
         
                authorization: 'plus ' + token,
                deviceId: deviceId
              
            })
          }).then(data => { 

            if(data.headers.get('content-type').includes('application/json')){
              return data.json();
            }else{
              Cookies.remove('PLUSID');
              window.location.href = "/login";
            }
          }).then(data => {
              setUserInformation(data)            
              // setIsLoading(false);
          })


        } catch (error) {
          Cookies.remove('PLUSID');
          console.error(error);
          // setIsLoading(false);
          window.location.href = "/login";
        }
      }
    }
  
    fetchData();
  }, [token]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/document-center/list`, {
      method: 'POST',
      body: JSON.stringify({
        userParameter: {
          loginName: userInformation.username ?? "",
          name: userInformation.name ?? "",
          companyID: userInformation.companyID ?? "",
          email: userInformation.email ?? "",
          brokerCode: userInformation.brokerCode ?? "",
          ifaIdentity: userInformation.ifaIdentity ?? "",
          pibaNumber: userInformation.pibaNumber ?? "",
          ifaCaNameEng: userInformation.ifaCaNameEng ?? "",
          ifaCaNameOther: userInformation.ifaCaNameOther ?? "",
          companyName: userInformation.companyName ?? "",
          ifaCaLicenseNumber: userInformation.ifaCaLicenseNumber ?? "",
          role: userInformation.role ?? ""
        },
        pageableParameter: {
          pageNumber: 0,
          pageSize: 100000,
          orderBy: "updatedDate",
          orderSequence: "desc"
        },
        documentCenterParameter: {
          isPin: "Y"
        }
      })
    })
      .then(response => response.json())
      .then(data => {
          setIsPin(data.documentCenterList)
      })

      fetch(`${API_BASE_URL}/document-center/list`, {
        method: 'POST',
        body: JSON.stringify({
          userParameter: {
            loginName: userInformation.username ?? "",
          name: userInformation.name ?? "",
          companyID: userInformation.companyID ?? "",
          email: userInformation.email ?? "",
          brokerCode: userInformation.brokerCode ?? "",
          ifaIdentity: userInformation.ifaIdentity ?? "",
          pibaNumber: userInformation.pibaNumber ?? "",
          ifaCaNameEng: userInformation.ifaCaNameEng ?? "",
          ifaCaNameOther: userInformation.ifaCaNameOther ?? "",
          companyName: userInformation.companyName ?? "",
          ifaCaLicenseNumber: userInformation.ifaCaLicenseNumber ?? "",
          role: userInformation.role ?? ""
          },
          pageableParameter: {
            pageNumber: 0,
            pageSize: 100000,
            orderBy: "updatedDate",
            orderSequence: "desc"
          },
          documentCenterParameter: {
            isPromo: "Y"
          }
        })
      })
        .then(response => response.json())
        .then(data => {
          if(data.documentCenterList){
          const promo = data.documentCenterList
          .filter(
            (promoDate) =>
              new Date(promoDate.effectiveDateFrom) <= new Date() &&
              new Date(promoDate.effectiveDateTo) >= new Date()
          )
          
            setIsPromo(promo)
          }
        })

      fetch(`${API_BASE_URL}/cms/links`, {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => {
          setLinks(data);
        })
        .catch(error => console.error(error));

      fetch(`${API_BASE_URL}/cms/communications`, {
        method: 'POST',
        body: JSON.stringify({
          pageableParameter: {
            pageNumber: 0,
            pageSize: 10000,
            orderBy: "latestUpdate",
            orderSequence: "desc"
          }
        })
      })
        .then(response => response.json())
        .then(data => {
          setCommunications(data.tcommunicationEntityList);
        })
        .catch(error => console.error(error));


  }, []);

  const downloadFile = (fileId,fileName) => {

    fetch(`${API_BASE_URL}/document/download`, {
      method: 'POST',
      body: JSON.stringify({
        documentParameter: {
          documentId: fileId
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        const fileExtension = data.documentName.split('.').pop().toLowerCase();
        let fileType = '';
        switch (fileExtension) {
          case "csv":
            fileType = "text/csv";
            break;
          case "doc":
            fileType = "application/msword";
            break;
          case "docx":
            fileType =
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            break;
          case "ppt":
            fileType = "application/vnd.ms-powerpoint";
            break;
          case "pptx":
            fileType =
              "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            break;
          case "xls":
            fileType = "application/vnd.ms-excel";
            break;
          case "xlsx":
            fileType =
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            break;
          case "pdf":
            fileType = "application/pdf";
            break;
          case "png":
            fileType = "image/png";
            break;
          case "jpeg":
          case "jpg":
            fileType = "image/jpeg";
            break;
          case "gif":
            fileType = "image/gif";
            break;
          default:
            fileType = "application/octet-stream";
            break;
        }
  
        const decodedFile = window.atob(data.documentBase64String);
        const byteArray = new Uint8Array(decodedFile.length);
        for (let i = 0; i < decodedFile.length; ++i) {
          byteArray[i] = decodedFile.charCodeAt(i);
        }
  
        const blob = new Blob([byteArray], { type: fileType });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error(error));
  
  };
 
  const navigate = useNavigate();

  const EditDocument = (event) => {
    navigate('/ViewDocument',{state:{event}});
  }
// Dispaly 
  return (
    <>
      {isMobileScreen ? (
        <>
        <PlusNavbar userInformation={userInformation} />
          <div className="md:flex md:justify-center">
          <div className="p-3 md:flex md:flex-row md:w-deflaut">
            <div className="space-y-2 md:h-auto md:w-3/4 md:flex md:flex-col md:mr-4">
              <div className="">
              <div className="h-tableCommunication relative flex justify-center">
                    <div className="titlebar h-12 absolute ">
                      <span className="bold h4 text-white">Brokers Communications</span>
                    </div>

                    {communications.filter(
                              (communication) =>
                                new Date(communication.startDate) <= new Date() &&
                                new Date(communication.endDate) >= new Date()
                            ).length === 0 ? (
                      <>
                        <div className="bg rounded shadow-lg w-full mt-3 flex justify-center items-center">
                            <NoItem />
                        </div>
                      </>
                    ) : (
                      <div className="bg rounded shadow-lg w-full mt-3 flex justify-center">
                        <ul className="mt-5 w-full mr-5 overflow-auto" style={{ paddingLeft: "20px", listStyleType: "circle" }}>
                          {communications
                            .sort((a, b) => (a.isPin === "Y" ? -1 : 1))
                            .filter(
                              (communication) =>
                                new Date(communication.startDate) <= new Date() &&
                                new Date(communication.endDate) >= new Date()
                            )
                            .map((communication, index) => (
                              <div className="border border-red-500 p-2 flex justify-between items-center" key={index}>
                                <div>
                                  <p className="mb-0 font-bold">Publish Date: {new Date(communication.startDate).toISOString().split('T')[0]}</p>
                                  <p className="mb-0">{communication.contentEngName}</p>
                                </div>
                                {communication.isPin === "Y" && (
                                  <svg fill="#004846" stroke="#004846" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-6">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z"></path>
                                  </svg>
                                )}
                              </div>
                            ))}
                        </ul>
                      </div>
                    )}
                    </div>
                <div className="h-96 relative flex justify-center mt-3">
                <div className="margin titlebar h-12 absolute mt-2">
                    <span className="bold h4 text-white">Latest Promo</span>
                  </div>
                  {isPromo.length === 0 ? (
                      <>
                        <div className="bg rounded shadow-lg w-full mt-3 flex justify-center items-center">
                            <NoItem />
                        </div>
                      </>
                    ) : (
                      <div className="bg rounded shadow-lg w-full mt-3 flex justify-center">
                        <ul className="mt-5 w-full mr-5 overflow-auto" style={{ paddingLeft: "20px", listStyleType: "circle" }}>
                        {isPromo
                            .map((promo, index) => (
                              <div className="border border-red-500 p-2 flex-col items-center" key={index}>
                                <div className="flex">
                                  <div className="w-2/5 pr-2">
                                    <p className="mb-0 font-bold line-clamp-1"><a href='/ViewDocument' className="text-ft" onClick={()=> EditDocument(promo)}>{promo.titleEnglish}</a></p>
                                  </div>
                                  <div className="w-1/5 px-2">
                                    <p className="mb-0 font-bold line-clamp-1">
                                      <a className="cursor-pointer	 text-ft-light hover:text-ft" 
                                        onClick={() => downloadFile(promo.file1Id, promo.file1Name)}> 
                                          {promo.file1Name}
                                      </a>
                                    </p>
                                  </div>
                                  <div className="w-1/5 px-2">
                                      <p className="mb-0 font-bold line-clamp-1">
                                        <a className="cursor-pointer	 text-ft-light hover:text-ft" 
                                          onClick={() => downloadFile(promo.file2Id, promo.file2Name)}> 
                                            {promo.file2Name}
                                        </a>
                                      </p>                                  
                                    </div>
                                  <div className="w-1/5 px-2">
                                    <p className="mb-0 font-bold line-clamp-1">
                                      <a className="cursor-pointer	 text-ft-light hover:text-ft" 
                                        onClick={() => downloadFile(promo.file3Id, promo.file3Name)}> 
                                          {promo.file3Name}
                                      </a>
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="mb-0 line-clamp-2">{promo.descriptionEnglish}</p>
                                </div>
                                
                              </div>
                            ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
             
            </div>
            <div className="md:h-full md:w-1/4 md:flex md:flex-col md:items-center space-y-2">
              <div className=" w-full h-96 md:h-screen relative flex justify-center mt-4">
                <div className=" titlebar h-12 absolute truncate ">
                    <span className="bold h4 text-white">Document Center</span>
                  </div>
                  <div className="bg rounded shadow-lg w-full  p-3 flex">
                      <div className="w-full my-2 mt-5 overflow-auto">
                        <div>
                        {!isPin || isPin.length === 0 ? (
                              <div className="flex justify-center items-center mt-5">
                                <NoItem />
                              </div>
                            ) : (
                              <ul className="" style={{ paddingLeft: '20px', listStyleType: 'circle' }}>
                                {isPin.map((pin, index) => (
                                  <li key={index}>
                                    <a
                                      onClick={() => EditDocument(pin)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-ft hover:text-ft-light text-lg line-clamp-1 cursor-pointer"
                                    >
                                      {new Date() > new Date(pin.effectiveDateTo) ? "(Expired) " : ""}
                                      {pin.titleEnglish}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                        </div>
                  </div>
              </div>
              <div className="h-auto relative flex justify-center ">
                  <div className="titlebar h-12 absolute">
                    <span className="bold h4 text-white">Quick Links</span>
                  </div>
                  <div className="bg rounded shadow-lg w-full mt-3 p-3 flex">
                      <div className="w-full my-2 mt-4">
                        <div>
                          {links.length===0?<><div className="flex justify-center items-center mt-5"><NoItem /></div></>:
                          <ul style={{ paddingLeft: '20px' ,listStyleType: 'circle'}}>
                            {links.map((link, index) => (
                              <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-ft hover:text-ft-light text-lg">
                                  {link.linkEngName}
                                </a>
                              </li>
                            ))}
                          </ul>}
                        </div>
                        </div>
                  </div>
                </div>
                
                <div className="md:w-1/2  relative flex justify-center">
                <div className="titlebar h-12 absolute mt-3">
                    <span className="bold h4 text-white">Event Calendar</span>
                  </div>
                  <div className="bg rounded shadow-lg w-full mt-5 flex justify-center">
                    <Calendar />
                  </div>
                </div>
               
              </div>
          </div>
          </div>
        </>
      ) : (
        <>
          <PlusNavbar userInformation={userInformation} />
          <div className="md:flex md:justify-center">
          <div className="p-3 md:flex md:flex-row md:w-deflaut">
            <div className="space-y-2 md:h-auto md:w-3/4 md:flex md:flex-col md:mr-4">
              <div className="">
              <div className="h-tableCommunication relative flex justify-center">
                    <div className="titlebar h-12 absolute ">
                      <span className="bold h4 text-white">Brokers Communications</span>
                    </div>

                    {communications.filter(
                              (communication) =>
                                new Date(communication.startDate) <= new Date() &&
                                new Date(communication.endDate) >= new Date()
                            ).length === 0 ? (
                      <>
                        <div className="bg rounded shadow-lg w-full mt-3 flex justify-center items-center">
                            <NoItem />
                        </div>
                      </>
                    ) : (
                      <div className="bg rounded shadow-lg w-full mt-3 flex justify-center">
                        <ul className="mt-5 w-full mr-5 overflow-auto" style={{ paddingLeft: "20px", listStyleType: "circle" }}>
                          {communications
                            .sort((a, b) => (a.isPin === "Y" ? -1 : 1))
                            .filter(
                              (communication) =>
                                new Date(communication.startDate) <= new Date() &&
                                new Date(communication.endDate) >= new Date()
                            )
                            .map((communication, index) => (
                              <div className="border border-red-500 p-2 flex justify-between items-center" key={index}>
                                <div>
                                  <p className="mb-0 font-bold">Publish Date: {new Date(communication.startDate).toISOString().split('T')[0]}</p>
                                  <p className="mb-0">{communication.contentEngName}</p>
                                </div>
                                {communication.isPin === "Y" && (
                                  <svg fill="#004846" stroke="#004846" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-6">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z"></path>
                                  </svg>
                                )}
                              </div>
                            ))}
                        </ul>
                      </div>
                    )}
                    </div>
                <div className="h-96 relative flex justify-center">
                <div className="margin titlebar h-12 absolute mt-2">
                    <span className="bold h4 text-white">Latest Promo</span>
                  </div>
                  {isPromo.length === 0 ? (
                      <>
                        <div className="bg rounded shadow-lg w-full mt-3 flex justify-center items-center">
                            <NoItem />
                        </div>
                      </>
                    ) : (
                      <div className="bg rounded shadow-lg w-full mt-3 flex justify-center">
                        <ul className="mt-5 w-full mr-5 overflow-auto" style={{ paddingLeft: "20px", listStyleType: "circle" }}>
                        {isPromo
                            .map((promo, index) => (
                              <div className="border border-red-500 p-2 flex-col items-center" key={index}>
                                <div className="flex">
                                  <div className="w-2/5 pr-2">
                                    <p className="mb-0 font-bold line-clamp-1"><a href='/ViewDocument' className="text-ft" onClick={()=> EditDocument(promo)}>{promo.titleEnglish}</a></p>
                                  </div>
                                  <div className="w-1/5 px-2">
                                    <p className="mb-0 font-bold line-clamp-1">
                                      <a className="cursor-pointer	 text-ft-light hover:text-ft" 
                                        onClick={() => downloadFile(promo.file1Id, promo.file1Name)}> 
                                          {promo.file1Name}
                                      </a>
                                    </p>
                                  </div>
                                  <div className="w-1/5 px-2">
                                      <p className="mb-0 font-bold line-clamp-1">
                                        <a className="cursor-pointer	 text-ft-light hover:text-ft" 
                                          onClick={() => downloadFile(promo.file2Id, promo.file2Name)}> 
                                            {promo.file2Name}
                                        </a>
                                      </p>                                  
                                    </div>
                                  <div className="w-1/5 px-2">
                                    <p className="mb-0 font-bold line-clamp-1">
                                      <a className="cursor-pointer	 text-ft-light hover:text-ft" 
                                        onClick={() => downloadFile(promo.file3Id, promo.file3Name)}> 
                                          {promo.file3Name}
                                      </a>
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="mb-0 line-clamp-2">{promo.descriptionEnglish}</p>
                                </div>
                                
                              </div>
                            ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
              <div className="md:flex md:flex-row md:space-x-2 ">
                <div className="md:w-1/2  relative flex justify-center">
                <div className="titlebar h-12 absolute">
                    <span className="bold h4 text-white">Event Calendar</span>
                  </div>
                  <div className="bg rounded shadow-lg w-full mt-3 flex justify-center">
                    <Calendar />
                  </div>
                </div>
                <div className="margin md:w-1/2 h-auto relative flex justify-center ">
                  <div className="titlebar h-12 absolute ">
                    <span className="bold h4 text-white">Quick Links</span>
                  </div>
                  <div className="bg rounded shadow-lg w-full mt-3 p-3 flex">
                      <div className="w-full my-2 mt-4">
                        <div>
                          {links.length===0?<><div className="flex mt-48"><NoItem /></div></>:
                          <ul style={{ paddingLeft: '20px' ,listStyleType: 'circle'}}>
                            {links.map((link, index) => (
                              <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-ft hover:text-ft-light text-lg">
                                  {link.linkEngName}
                                </a>
                              </li>
                            ))}
                          </ul>}
                        </div>
                        </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:h-full md:w-1/4 md:flex md:flex-col md:items-center space-y-2">
              {/* <div className="margin w-full h-36 md:h-36 relative flex justify-center">
                  <div className="titlebar h-12 absolute truncate ">
                    <span className="bold h4 text-white">Policy Inquiry</span>
                  </div>
                  <div className="bg rounded shadow-lg w-full mt-3 flex justify-center p-2">                      
                    <Searchbar />
                  </div>
                </div> */}
              <div className=" w-full h-96 md:h-screen relative flex justify-center">
                <div className="margin titlebar h-12 absolute truncate ">
                    <span className="bold h4 text-white">Document Center</span>
                  </div>
                  <div className="bg rounded shadow-lg w-full  p-3 flex">
                      <div className="w-full my-2 mt-5 overflow-auto">
                        <div>
                        {!isPin || isPin.length === 0 ? (
                              <div className="flex mt-48">
                                <NoItem />
                              </div>
                            ) : (
                              <ul className="" style={{ paddingLeft: '20px', listStyleType: 'circle' }}>
                                {isPin.map((pin, index) => (
                                  <li key={index}>
                                    <a
                                      onClick={() => EditDocument(pin)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-ft hover:text-ft-light text-lg line-clamp-1 cursor-pointer"
                                    >
                                      {new Date() > new Date(pin.effectiveDateTo) ? "(Expired) " : ""}
                                      {pin.titleEnglish}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                        </div>
                  </div>
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </>
  );
}

export default LandingPage;