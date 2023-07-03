import React, { useState , useEffect } from "react";
import Modal from "react-modal";
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import PlusNavbar from "../components/PlusNavbar";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import {API_BASE_URL} from '../api.config.js';


function LoginPage() {
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const { t, i18n } = useTranslation();
  const token = Cookies.get("PLUSID");


  useEffect(() => {
    const savedLanguage = Cookies.get('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);
  


  const closeEdit = () => {
    setEditIsOpen(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(",")[1];
        setUploadedFile(base64String);
        setUploadedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };



  const handlePreview = () => {
    if (!uploadedFile) {
      return <div>No file uploaded</div>;
    }
  
    const fileExtension = uploadedFileName.split(".").pop().toLowerCase();
  
    if (fileExtension === "png" || fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "gif") {
      // Image preview
      return <img src={`data:image/${fileExtension};base64,${uploadedFile}`} alt="Document Thumbnail" />;
    } else {
      // Download link for other file types
      return (
        <div>
          <a href={`data:application/octet-stream;base64,${uploadedFile}`} download={uploadedFileName}>
            Download File
          </a>
        </div>
      );
    }
  };
  

  const customStyles = {
    content: {
      width: "auto",
      maxWidth: "700px",
      height: "550px",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
  };

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
              // setUserInformation(data)            
          })


        } catch (error) {
          Cookies.remove('PLUSID');
          console.error(error);
        }
      }
    }
  
    fetchData();
  }, [token]);

  return (
    <>
    <PlusNavbar />
      <div className="bg-ft-light h-screen flex items-center justify-center">
      <p>{t('loginPage.username')}</p>
        <input type="file" onChange={handleFileUpload} />
        <button onClick={() => setEditIsOpen(true)}>Open Preview</button>
        <Modal isOpen={editIsOpen} onRequestClose={closeEdit} style={customStyles} ariaHideApp={false}>
          <p>Preview</p>
          {handlePreview()}
          <button onClick={closeEdit}>Close Preview</button>
        </Modal>
      </div>
    </>
  );
}

export default LoginPage;
