import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import PlusNavbar from "../components/PlusNavbar";
import LoadingScreen from "../components/LoadingScreen";
import "bootstrap/dist/css/bootstrap.css";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import {API_BASE_URL} from '../api.config.js';
import EditCampaignForm from "../components/EditCampaignForm";
import {useLocation} from 'react-router-dom';



function EditCampaignPage() {
  const [userInformation, setUserInformation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("PLUSID");
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      const deviceId = await getCurrentBrowserFingerPrint();
      if (!token) {
        window.location.href = "/login";
      } else {
        try {
          fetch(`${API_BASE_URL}/authentication/protected`, {
            method: "POST",
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
              setIsLoading(false);
          })


        } catch (error) {
          Cookies.remove('PLUSID');
          console.error(error);
          setIsLoading(false);
        }
      }
    }
  
    fetchData();
  }, [token]);


  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <PlusNavbar userInformation={userInformation} />
          <div className="md:flex md:justify-center">
            <div className="p-3 md:w-deflaut md:flex">
                <div className="w-full">
                    <a href="/Campaign"><h1 className="my-4 text-ft-light hover:text-ft hover:underline">{location.state.event.campaignNameEng}</h1></a>
                    <EditCampaignForm userInformation={userInformation} campaign={(location.state!==null)?location.state.event:""}/>

                </div>
            </div>
        </div>
        </>
      )}
    </>
  );
}

export default EditCampaignPage;