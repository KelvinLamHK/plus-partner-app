import React, { useState, useEffect} from 'react';
import {API_BASE_URL} from "../api.config.js"
import Swal from "sweetalert2";

const EditCampaignForm = (props) =>  {
const [isMobileScreen, setIsMobileScreen] = useState((window.innerWidth <= 1250?true:false));
  const [IFACA, setIFACA] = useState(props.campaign.ifaCaIndicator);
  const [template, setTemplate] = useState(props.campaign.template??"CEE - Birthday Delight");
  const [thumbnailDocID,setThumbnailDocID] = useState(props.campaign.thumbnailDocID)
  const [values, setValues] = useState({
    campaignNameEng:props.campaign.campaignNameEng,
    campaignCode: props.campaign.campaignCode,
    campaignNameZHTW: props.campaign.campaignNameZHTW,
    campaignStartDate: props.campaign.campaignStartDate.slice(0, 10),
    campaignNameZHCN: props.campaign.campaignNameZHCN,
    campaignEndDate: props.campaign.campaignEndDate.slice(0, 10),
    remark:props.campaign.remark,
    file:props.campaign.file,
    thumbnailDocID:props.campaign.thumbnailDocID
  });

//   const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  useEffect(() => {
    if(props.campaign.thumbnailDocID!==0){
    fetch(`${API_BASE_URL}/document/download`, {
        method: 'POST',
        body: JSON.stringify({
          documentParameter: {
            documentId: props.campaign.thumbnailDocID
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        if(data.documentName){
          setUploadedFileName(data.documentName)
        //   setUploadedFile(data.documentBase64String)
        }
      })
      .catch(error => console.error(error));
    }
  }, [props.campaign.thumbnailDocID]);

  const handleFileInputChange = (e) => {
        const file = e.target.files[0];

        if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result.split(",")[1];
            fetch(`${API_BASE_URL}/document/upload`, {
                method: 'POST',
                body: JSON.stringify({
                    userParameter: {
                        loginName: "IFA-0317543-00006",
                        name: "XXXXXXXX Wong",
                        companyID: "IFA",
                        email: "xxxxxxxxxxxx@iamlegacy.com",
                        brokerCode: "0328693;0317543;0328693;0328693",
                        ifaIdentity: "USER",
                        pibaNumber: "PIBA-0433-022049",
                        ifaCaNameEng: "XXXX Ip Wun",
                        ifa_ca_name_oth: "XXX",
                        ifaCaNameOther: "IA9205",
                        companyName: null,
                        ifaCaLicenseNumber: "TR1234",
                        role: "internal-admin"
                    },
                    documentParameter: {
                        documentName: file.name,
                        base64FileString: base64String,
                        documentCategory: "campaign",
                        documentType: "thumbnail"

                      }

            })
              })
                .then(response => response.json())
                .then(data => {
                  setThumbnailDocID(data.referenceId)
                });
        };
        reader.readAsDataURL(file);
        }
    }



  const handleIFACAChange = (event) => {
    setIFACA(event.target.value);
  };

  const handleTemplateChange = (event) => {
    setTemplate(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const goBack = () => {
    window.location.href = "/Campaign";
    return null;
  }

  const handleSubmit = async (e) => {
    if(values.campaignNameZHCN === undefined || values.campaignNameZHCN === null){
        values.campaignNameZHCN=""
    }

    if(values.thumbnailDocID === undefined || values.thumbnailDocID === null){
        values.thumbnailDocID=""
    }

    if(values.remark === undefined || values.remark === null){
        values.remark=""
    }

    if(values.file === undefined || values.file === null){
        values.file=""
    }

    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/campaign/header`, {
        method: 'POST',
        body: JSON.stringify({
            userParameter: {
                loginName: "IFA-0317543-00006",
                name: "XXXXXXXX Wong",
                companyID: "IFA",
                email: "xxxxxxxxxxxx@iamlegacy.com",
                brokerCode: "0328693;0317543;0328693;0328693",
                ifaIdentity: "USER",
                pibaNumber: "PIBA-0433-022049",
                ifaCaNameEng: "XXXX Ip Wun",
                ifa_ca_name_oth: "XXX",
                ifaCaNameOther: "IA9205",
                companyName: null,
                ifaCaLicenseNumber: "TR1234",
                role: "internal-admin"
            },
            campaignHeaderParameter: {
                campaignHeaderId: props.campaign.campaignHeaderId,
                campaignCode: values.campaignCode,
                campaignNameEng: values.campaignNameEng,
                campaignNameZHTW: values.campaignNameZHTW,
                campaignNameZHCN:values.campaignNameZHCN,
                ifaCaIndicator: IFACA,
                remark: values.remark,
                thumbnailDocID: (thumbnailDocID=== "" || thumbnailDocID === null?0:thumbnailDocID),
                campaignStartDate: values.campaignStartDate,
                campaignEndDate: values.campaignEndDate,
                template:template
            }
        })
      });
      const data = await response.text();
      if (isNaN(+data)) {
        Swal.fire({
            icon: 'success',
            title: (props===""?'Created Campaign':'Updated Campaign'),
            showConfirmButton: false,
            timer: 1700
        }).then(function() {
            window.location = "/Campaign";
        });
    }
    } catch (error) {
    } 
  };

  useEffect(() => {
    function handleResize() {
      setIsMobileScreen(window.innerWidth <= 1250);
     
    }
  
    handleResize();
    window.addEventListener("resize", handleResize);
  
    // Add this block to update isMobileScreen when the screen size is larger than 1207 pixels
    return () => {
      window.removeEventListener("resize", handleResize);
      setIsMobileScreen(false);
     
    };
  }, []);

  return (
    <>
    {isMobileScreen ? ( 
    <div>
        <form className='border border-red rounded ' onSubmit={handleSubmit}>
              
        <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="campaignNameEng">Campaign Name(Eng)<span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignNameEng"
                        name="campaignNameEng"
                        value={values.campaignNameEng}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="campaignNameZHTW">Campaign Name(Trad Chi)<span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignNameZHTW"
                        name="campaignNameZHTW"
                        value={values.campaignNameZHTW}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="campaignStartDate">Start Date<span className='text-red-600'>*</span></label>
                    <input
                        type="date"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignStartDate"
                        name="campaignStartDate"
                        value={values.campaignStartDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="campaignCode">Campaign Code<span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignCode"
                        name="campaignCode"
                        value={values.campaignCode}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="campaignNameZHCN">Campaign Name(Simp Chi)</label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignNameZHCN"
                        name="campaignNameZHCN"
                        value={values.campaignNameZHCN}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="campaignEndDate">End Date<span className='text-red-600'>*</span></label>
                    <input
                        type="date"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignEndDate"
                        name="campaignEndDate"
                        value={values.campaignEndDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="IFA/CA">IFA/CA<span className='text-red-600'>*</span></label>
                    <select
                        id="IFACA"
                        aria-label="Select IFA/CA"
                        className="w-full bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ft-light focus:border-ft-light p-2.5"
                        value={IFACA}
                        name="ifaCaIndicator"
                        onChange={handleIFACAChange}
                        >
                        <option value="IFA/CA">IFA & CA</option>
                        <option value="IFA">IFA</option>
                        <option value="CA">CA</option>
                    </select> 
                </div>

                </div>
                <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
                    <label htmlFor="template">Template <span className='text-red-600'>*</span></label>
                    {props.campaign.template!=="CEE - K Dollar"&&props.campaign.template!=="PDD - CI Conversion Campaign"?
                    <select
                        id="template"
                        aria-label="Select template"
                        className="w-full bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ft-light focus:border-ft-light p-2.5"
                        value={template}
                        name="template"
                        onChange={handleTemplateChange}
                        >
                        <option value="CEE - Birthday Delight">CEE - Birthday Delight</option>
                       
                    </select>
                    :
                    <select
                        id="template"
                        aria-label="Select template"
                        className="w-full bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ft-light focus:border-ft-light p-2.5"
                        value={template}
                        name="template"
                        onChange={handleTemplateChange}
                        >
                          {props.userInformation.role==="internal-admin"||props.userInformation.role==="cee-admin"?
                        <option value="CEE - K Dollar">CEE - K Dollar</option>
                        :
                        <></>
                        }
                         {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"?
                        <option value="PDD - CI Conversion Campaign">PDD - CI Conversion Campaign</option>
                        :
                        <></>
                        }
                    </select>} 
                
            </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
                    <label htmlFor="remark">Remarks</label>
                    <textarea
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="remark"
                        name="remark"
                        value={values.remark}
                        onChange={handleChange}
                    />
                    
                </div>
            </div>
            <div className="form-row flex m-3">  
                <div className='px-4 w-full'>
                    <label htmlFor="file-upload" className="upload-label mr-3">
                        Browse to upload
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                    />
                </div>
            </div>
            <div className="px-6 py-4 flex justify-end">
            <button onClick={goBack} type="button" className="text-ft-light ring-1 ring-ft-light bg-white hover:bg-ft hover:text-white rounded-md px-4 py-2 active:bg-white active:text-red-500 active:ring-1 active:ring-red-500 transition">Cancel</button>
            <button type="Submit" className="ml-4 text-white bg-ft-light hover:bg-ft rounded-md px-4 py-2 active:bg-white active:text-ft active:ring-1 active:ring-ft transition">Save</button>
        </div>
        </form>
       
    </div>):(
    <div>
        <form className='border border-red rounded p-1' onSubmit={handleSubmit}>
        <div className="form-row flex mx-3 my-5">
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="campaignNameEng">Campaign Name(Eng)<span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignNameEng"
                        name="campaignNameEng"
                        value={values.campaignNameEng}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="campaignCode">Campaign Code<span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignCode"
                        name="campaignCode"
                        value={values.campaignCode}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        </div>
        <div className="form-row flex mx-3 my-5">
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="campaignNameZHTW">Campaign Name(Trad Chi)<span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignNameZHTW"
                        name="campaignNameZHTW"
                        value={values.campaignNameZHTW}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="form-group w-1/2 flex justify-center">
            <div className='w-11/12'>
            <label htmlFor="campaignStartDate">Start Date<span className='text-red-600'>*</span></label>
                    <input
                        type="date"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignStartDate"
                        name="campaignStartDate"
                        value={values.campaignStartDate}
                        onChange={handleChange}
                        required
                    />
                   
                </div>
            </div>
        </div>
        <div className="form-row flex mx-3 my-5">
            <div className="form-group w-1/2 flex justify-center">
            <div className='w-11/12'>
            <label htmlFor="campaignNameZHCN">Campaign Name(Simp Chi)</label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignNameZHCN"
                        name="campaignNameZHCN"
                        value={values.campaignNameZHCN}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="campaignEndDate">End Date<span className='text-red-600'>*</span></label>
                    <input
                        type="date"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="campaignEndDate"
                        name="campaignEndDate"
                        value={values.campaignEndDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        </div>
        <div className="form-row flex mx-3 my-5">
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="IFA/CA">IFA/CA<span className='text-red-600'>*</span></label>
                    <select
                        id="IFACA"
                        aria-label="Select IFA/CA"
                        className="w-full bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ft-light focus:border-ft-light p-2.5"
                        value={IFACA}
                        name="ifaCaIndicator"
                        onChange={handleIFACAChange}
                        >
                        <option value="IFA/CA">IFA & CA</option>
                        <option value="IFA">IFA</option>
                        <option value="CA">CA</option>
                    </select> 
                </div>
            </div>
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="IFA/CA">Template <span className='text-red-600'>*</span></label>
                    {props.campaign.template!=="CEE - K Dollar"&&props.campaign.template!=="PDD - CI Conversion Campaign"?
                    <select
                        id="template"
                        aria-label="Select template"
                        className="w-full bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ft-light focus:border-ft-light p-2.5"
                        value={template}
                        name="template"
                        onChange={handleTemplateChange}
                        >
                        <option value="CEE - Birthday Delight">CEE - Birthday Delight</option>
                       
                    </select>
                    :
                    <select
                        id="template"
                        aria-label="Select template"
                        className="w-full bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ft-light focus:border-ft-light p-2.5"
                        value={template}
                        name="template"
                        onChange={handleTemplateChange}
                        >
                          {props.userInformation.role==="internal-admin"||props.userInformation.role==="cee-admin"?
                        <option value="CEE - K Dollar">CEE - K Dollar</option>
                        :
                        <></>
                        }
                         {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"?
                        <option value="PDD - CI Conversion Campaign">PDD - CI Conversion Campaign</option>
                        :
                        <></>
                        }
                    </select>} 
                </div>
            </div>
        </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
                    <label htmlFor="remark">Remarks</label>
                    <textarea
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="remark"
                        name="remark"
                        value={values.remark}
                        onChange={handleChange}
                    />
                    
                </div>
            </div>
            
            <div className="flex-col form-row flex m-3">  
            <div className='px-4 font-bold'>
                Current file: {uploadedFileName===""?"No uploaded file":uploadedFileName}
            </div>
                <div className='px-4 w-full mt-2'>
                    <label htmlFor="file-upload" className="upload-label mr-3">
                        {uploadedFileName===""?"Browse to upload":"Browse to replace"}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                    />
                </div>
            </div>
            <div className="px-6 py-4 flex justify-end">
            <button onClick={goBack} type="button" className="text-ft-light ring-1 ring-ft-light bg-white hover:bg-ft hover:text-white rounded-md px-4 py-2 active:bg-white active:text-red-500 active:ring-1 active:ring-red-500 transition">Cancel</button>
            <button type="Submit" className="ml-4 text-white bg-ft-light hover:bg-ft rounded-md px-4 py-2 active:bg-white active:text-ft active:ring-1 active:ring-ft transition">Save</button>
        </div>
        </form>
       
    </div>
  )}
  </>
)}

export default EditCampaignForm;