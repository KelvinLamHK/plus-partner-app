/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect} from 'react';
import {API_BASE_URL} from "../api.config.js"
import Swal from "sweetalert2";
import { MultiSelect } from "react-multi-select-component";

const CreateDocForm = (props) =>  {
  const [isMobileScreen, setIsMobileScreen] = useState((window.innerWidth <= 1250?true:false));
  const [IFACA, setIFACA] = useState(props.documentCenterList.ifaCaIndicator);
  const [values, setValues] = useState({
    titleEnglish: props.documentCenterList.titleEnglish,
    titleTraditionalChinese: props.documentCenterList.titleTraditionalChinese,
    titleSimplifiedChinese: (props.documentCenterList.titleSimplifiedChinese===null?"":props.documentCenterList.titleSimplifiedChinese),
    descriptionEnglish: props.documentCenterList.descriptionEnglish,
    descriptionTraditionalChinese:props.documentCenterList.descriptionTraditionalChinese,
    descriptionSimplifiedChinese: (props.documentCenterList.descriptionSimplifiedChinese===null?"":props.documentCenterList.descriptionSimplifiedChinese),
    effectiveDateFrom: props.documentCenterList.effectiveDateFrom.slice(0, 10),
    effectiveDateTo: props.documentCenterList.effectiveDateTo.slice(0, 10),
  });
  const [isPin, setIsPin] = useState((props.documentCenterList.isPin==="Y"?true:false));
  const [isPromo, setIsPromo] = useState((props.documentCenterList.isPromo==="Y"?true:false));
  const [fileId1, setFileId1] = useState(props.documentCenterList.file1Id);
  const [fileId2, setFileId2] = useState(props.documentCenterList.file2Id);
  const [fileId3, setFileId3] = useState(props.documentCenterList.file3Id);
  const [fileName1, setFileName1] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [fileName3, setFileName3] = useState("");
  const [base1, setBase1] = useState("");
  const [base2, setBase2] = useState("");
  const [base3, setBase3] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(props.documentCenterList.level1CategoryId);
  const [selectedSubCategory, setSelectedSubCategory] = useState(props.documentCenterList.level2CategoryId);
 
  useEffect(() => {
   
    fetch(`${API_BASE_URL}/document-center/visibility/list`, {
      method: 'POST',
      body: JSON.stringify({
        documentCenterParameter:{
          documentCenterId: props.documentCenterList.documentCenterId
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        const agentCodes = data.map((agent) => agent.agentCode);

        fetch(`${API_BASE_URL}/broker/list`, {
          method: 'POST',
          body: JSON.stringify()
        })
          .then(response => response.json())
          .then(data => {
            const filteredBrokerCodes = data.filter((broker) =>
            agentCodes.includes(broker.brokerCode)
            );

            const formattedSelect = filteredBrokerCodes.map((broker) => ({
              label: `${broker.brokerName} (${broker.brokerCode})`,
              value: broker.brokerCode
              }));
              
              setSelected(formattedSelect)

            const formattedOptions = data.map(broker => ({
              label: `${broker.brokerName}(${broker.brokerCode})`,
              value: broker.brokerCode
            }));

            setOptions(formattedOptions);
          });
       


      });

      if(fileId1){
      fetch(`${API_BASE_URL}/document/download`, {
        method: 'POST',
        body: JSON.stringify({
          documentParameter: {
            documentId: props.documentCenterList.file1Id
          }
        })
      }).then(response => response.json()).then(data => {
        setFileName1(data.documentName)
        setBase1(data.documentBase64String)
      })

    }

    if(fileId2){
      fetch(`${API_BASE_URL}/document/download`, {
        method: 'POST',
        body: JSON.stringify({
          documentParameter: {
            documentId: props.documentCenterList.file2Id
          }
        })
      }).then(response => response.json()).then(data => {
        setFileName2(data.documentName)
        setBase2(data.documentBase64String)

      })

    }

    if(fileId3){
      fetch(`${API_BASE_URL}/document/download`, {
        method: 'POST',
        body: JSON.stringify({
          documentParameter: {
            documentId: props.documentCenterList.file3Id
          }
        })
      }).then(response => response.json()).then(data => {
        setFileName3(data.documentName)
        setBase3(data.documentBase64String)

      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const downloadFile = (number) => {
    if(number===1){
      download(fileName1,base1)
    }

    if(number ===2){
      download(fileName2,base2)
    }

    if(number===3){
      download(fileName3,base3)
    }

  }

  const download = (name, base) =>{
    const fileExtension = name.split('.').pop().toLowerCase();
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
  
        const decodedFile = window.atob(base);
        const byteArray = new Uint8Array(decodedFile.length);
        for (let i = 0; i < decodedFile.length; ++i) {
          byteArray[i] = decodedFile.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: fileType });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  }

  const handleSelect = (selected) => {
    setSelected(selected);
  };

  const handleIsPinChange = () =>{
    if(isPin){
        setIsPin(false)
    }else{
        setIsPin(true)
    }
  }

  const handleIsPromoChange = () =>{
    if(isPromo){
        setIsPromo(false)
    }else{
        setIsPromo(true)
    }
  }

  const handleFileInputChange = (e,number) => {
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
                    documentCategory: "document-center",
                    documentType: "document"

                  }

        })
          })
            .then(response => response.json())
            .then(data => {
                if(number===1){
                    setFileId1(data.referenceId)
                }
                if(number===2){
                    setFileId2(data.referenceId)
                }
                if(number===3){
                    setFileId3(data.referenceId)
                }
            });
    };
    reader.readAsDataURL(file);
    }
}



  const handleIFACAChange = (event) => {
    setIFACA(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const goBack = () => {
    window.location.href = "/DocCenter";
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
      const response = await fetch(`${API_BASE_URL}/document-center`, {
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
            documentCenterParameter: {
                documentCenterId: props.documentCenterList.documentCenterId,
                titleEnglish:values.titleEnglish,                    
                titleTraditionalChinese:values.titleTraditionalChinese,         
                titleSimplifiedChinese:values.titleSimplifiedChinese,          
                documentStatus:"",                  
                level1CategoryId:selectedMainCategory,                
                level2CategoryId:selectedSubCategory,                
                descriptionEnglish:values.descriptionEnglish,              
                descriptionTraditionalChinese:values.descriptionTraditionalChinese,   
                descriptionSimplifiedChinese:values.descriptionSimplifiedChinese,    
                file1Id:fileId1,                         
                file2Id:fileId2,                         
                file3Id:fileId3,                         
                effectiveDateFrom:values.effectiveDateFrom,               
                effectiveDateTo:values.effectiveDateTo,
                isPin: (isPin?"Y":"N"),
                isPromo: (isPromo?"Y":"N"),
                ifaCaIndicator: IFACA,
                visibilityList: selected.map(select => 
                    select.value
                )
            }
        })
      });
      const data = await response.text();
      if (isNaN(+data)) {
        Swal.fire({
            icon: 'success',
            title: ('Document Updated'),
            showConfirmButton: false,
            timer: 1700
        }).then(function() {
            window.location = "/DocCenter";
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



  useEffect(() => {
    fetch(`${API_BASE_URL}/document-center/category/list`, {
      method: 'POST',
      body: JSON.stringify()
    })
      .then(response => response.json())
      .then(data => {
        setMainCategories(data.firstLevelCategoryList);
      });
  }, []);

  const handleMainCategoryChange = (event) => {
    const selectedMainCategoryId = event.target.value;
    setSelectedMainCategory(selectedMainCategoryId);
    setSelectedSubCategory(0);
  };

  const handleSubCategoryChange = (event) => {
    const selectedSubCategoryId = event.target.value;
    setSelectedSubCategory(selectedSubCategoryId);
  };

  const subCategoryOptions = selectedMainCategory
    ? mainCategories.find(category => category.categoryId === selectedMainCategory)?.secondLevelCategoryList
    : null;

  return (
    <>
    {isMobileScreen ? ( 
    <>
     <div>
        <form className='border border-red rounded ' onSubmit={handleSubmit}>
              
        <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label>Visibility:<span className='text-red-600'>*</span></label>
             <MultiSelect
                 options={options}
                 value={selected}
                 onChange={handleSelect}
                 labelledBy={"Select"}
                 isCreatable={true}
                 required
             />
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="titleEnglish">Title(Eng)<span className='text-red-600'>*</span></label>
             <input
                 type="text"
                 className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                 id="titleEnglish"
                 name="titleEnglish"
                 value={values.titleEnglish}
                 onChange={handleChange}
                 required
             />
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="titleTraditionalChinese">Title(Trad Chi)<span className='text-red-600'>*</span></label>
             <input
                 type="text"
                 className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                 id="titleTraditionalChinese"
                 name="titleTraditionalChinese"
                 value={values.titleTraditionalChinese}
                 onChange={handleChange}
                 required
             />
                </div>
            </div>
        <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="titleSimplifiedChinese">Title(Simp Chi)</label>
             <input
                 type="text"
                 className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                 id="titleSimplifiedChinese"
                 name="titleSimplifiedChinese"
                 value={values.titleSimplifiedChinese}
                 onChange={handleChange}
             />
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="IFA/CA">Channel<span className='text-red-600'>*</span></label>
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
            <label htmlFor="effectiveDateFrom">Start Date<span className='text-red-600'>*</span></label>
             <input
                 type="date"
                 className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                 id="effectiveDateFrom"
                 name="effectiveDateFrom"
                 value={values.effectiveDateFrom}
                 onChange={handleChange}
                 required
             />
                </div>
            </div>
        <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="effectiveDateTo">End Date<span className='text-red-600'>*</span></label>
             <input
                 type="date"
                 className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                 id="effectiveDateTo"
                 name="effectiveDateTo"
                 value={values.effectiveDateTo}
                 onChange={handleChange}
                 required
             />
                </div>
            </div>

            <div className="form-row flex mx-3 my-5">
            <div className='px-4 w-full'>
             <label></label><br></br>
             <a href="/Categories" className=' bg-ft-light text-white px-4 py-4 rounded hover:bg-ft'>Create new category</a>
            </div>
            </div>

            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label>Category:<span className='text-red-600'>*</span></label><br></br>
                <select value={selectedMainCategory} onChange={handleMainCategoryChange} className="rounded border  border-red-400 h-10 w-full">
                <option value="" className="text-ft">Select main category</option>
                {mainCategories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryEnglish}
                    </option>
                ))}
                </select>
                    
                </div>
            </div>

            {subCategoryOptions && (
                <div className="form-row flex mx-3 my-5">  
                <div className='px-4 w-full'>
                <label>Subcategory:</label><br></br>
                <select value={selectedSubCategory} onChange={handleSubCategoryChange} className="rounded border  border-red-300 h-10 w-full">
                    <option value="">Select subcategory</option>
                    {subCategoryOptions.map(subCategory => (
                    <option key={subCategory.categoryId} value={subCategory.categoryId}>
                        {subCategory.categoryEnglish}
                    </option>
                    ))}
                </select>
                </div>
                </div>
                )}

            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="descriptionEnglish">Description<span className='text-red-600'>*</span></label>
             <textarea
                 type="text"
                 className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                 id="descriptionEnglish"
                 name="descriptionEnglish"
                 value={values.descriptionEnglish}
                 onChange={handleChange}
                 required
             />
                    
                </div>
            </div>

            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="descriptionTraditionalChinese">Description(Trad Chi)<span className='text-red-600'>*</span>
                </label>
             <textarea
                 type="text"
                 className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                 id="descriptionTraditionalChinese"
                 name="descriptionTraditionalChinese"
                 value={values.descriptionTraditionalChinese}
                 onChange={handleChange}
                 required
             />
                    
                </div>
            </div>

            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <label htmlFor="descriptionSimplifiedChinese">Description(Simp Chi)
                </label>
             <textarea
                 type="text"
                 className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                 id="descriptionSimplifiedChinese"
                 name="descriptionSimplifiedChinese"
                 value={values.descriptionSimplifiedChinese}
                 onChange={handleChange}
             />
                    
                </div>
            </div>




            <div className="form-row flex m-3">  
                <div className='px-4 w-full'>
                <h4>File (1)</h4>
                <h5>Current file: {fileId1!==0?<a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(1)}> {fileName1}</a>:"No uploaded file"}</h5>
                    <label htmlFor="file-upload1" className="upload-label mr-3 ">
                        Browse to {fileId1?"replace":"upload"}
                    </label>
                    <input
                        id="file-upload1"
                        type="file"
                        accept="image/*,.pdf,.xlsx, .xls, .csv, .ppt, .pptx, .doc, .docx"
                        onChange={e => handleFileInputChange(e, 1)}
                    />
                </div>
            </div>

            <div className="form-row flex m-3">  
                <div className='px-4 w-full'>
                <h4>File (2)</h4>
                <h5>Current file: <a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(2)}> {fileName2}</a></h5>
                    <label htmlFor="file-upload2" className="upload-label mr-3">
                    Browse to {fileId2?"replace":"upload"}
                    </label>
                    <input
                        id="file-upload2"
                        type="file"
                        accept="image/*,.pdf,.xlsx, .xls, .csv, .ppt, .pptx, .doc, .docx"
                        onChange={e => handleFileInputChange(e,2)}
                    />
                </div>
            </div>

            <div className="form-row flex m-3">  
                <div className='px-4 w-full'>
                <h4>File (3)</h4>
                <h5>Current file: <a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(3)}> {fileName3} </a></h5>
                    <label htmlFor="file-upload3" className="upload-label mr-3">
                    Browse to {fileId3?"replace":"upload"}
                    </label>
                    <input
                        id="file-upload3"
                        type="file"
                        accept="image/*,.pdf,.xlsx, .xls, .csv, .ppt, .pptx, .doc, .docx"
                        onChange={e => handleFileInputChange(e,3)}
                    />
                </div>
            </div>

            <div className="form-row flex mx-3 mt-5">
            <div className='px-4 w-full'>
         <label className="relative inline-flex items-center mr-5 cursor-pointer">
                <input type="checkbox" onChange={handleIsPinChange} value={isPin} className="sr-only peer"  />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ft-light"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Pin?</span>
                </label>
                    </div>
                </div>

                <div className="form-row flex mx-3 mt-4">
                <div className='px-4 w-full'>
                
                    <label className="relative inline-flex items-center mr-5 cursor-pointer">
                <input type="checkbox" onChange={handleIsPromoChange} value={isPromo} className="sr-only peer"  />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ft-light"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Send to Latest Promos?</span>
                </label>
                    </div>
                </div>
           


                <div className="px-6 py-4 flex justify-end">
     <button type="Submit" className=" text-white bg-ft-light hover:bg-ft rounded-md px-4 py-2 active:bg-white active:text-ft active:ring-1 active:ring-ft transition">Save</button>
     <button onClick={goBack} type="button" className="ml-4 text-ft-light ring-1 ring-ft-light bg-white hover:bg-ft hover:text-white rounded-md px-4 py-2 active:bg-white active:text-red-500 active:ring-1 active:ring-red-500 transition">Cancel</button>
        </div>
        </form>
       
    </div>
    </>
    
    ):(
    <div>
        <form className='border border-red rounded p-1' onSubmit={handleSubmit}>
        <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
            <div className="mt-3">
                <label>Visibility:<span className='text-red-600'>*</span></label>
                    <MultiSelect
                        options={options}
                        value={selected}
                        onChange={handleSelect}
                        labelledBy={"Select visibility"}
                        isCreatable={true}
                        required
                    />
                    
                    </div>
                </div>
            </div>
            
        <div className="form-row flex mx-3 my-5">
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="titleEnglish">Title(Eng)<span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="titleEnglish"
                        name="titleEnglish"
                        value={values.titleEnglish}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="titleTraditionalChinese">Title(Trad Chi)<span className='text-red-600'>*</span></label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="titleTraditionalChinese"
                        name="titleTraditionalChinese"
                        value={values.titleTraditionalChinese}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        </div>
        <div className="form-row flex mx-3 my-5">
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="titleSimplifiedChinese">Title(Simp Chi)</label>
                    <input
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="titleSimplifiedChinese"
                        name="titleSimplifiedChinese"
                        value={values.titleSimplifiedChinese}
                        onChange={handleChange}
                    />
                </div>
            </div>
             <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                    <label htmlFor="IFA/CA">Channel<span className='text-red-600'>*</span></label>
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
           
        </div>
        <div className="form-row flex mx-3 my-5">
        <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                <label htmlFor="effectiveDateFrom">Start Date<span className='text-red-600'>*</span></label>
                    <input
                        type="date"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="effectiveDateFrom"
                        name="effectiveDateFrom"
                        value={values.effectiveDateFrom}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                <label htmlFor="effectiveDateTo">End Date<span className='text-red-600'>*</span></label>
                    <input
                        type="date"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="effectiveDateTo"
                        name="effectiveDateTo"
                        value={values.effectiveDateTo}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        </div>
        <div className="form-row flex mx-3 my-5">
            <div className="form-group w-full ml-6 flex ">
           
            <div className="mt-2 w-2/5 mr-4">
        <label>Category:<span className='text-red-600'>*</span></label><br></br>
        <select value={selectedMainCategory} onChange={handleMainCategoryChange} className="rounded border  border-red-400 h-10 w-full">
          <option value="" className="text-ft">Select main category</option>
          {mainCategories.map(category => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryEnglish}
            </option>
          ))}
        </select>
      </div>

      {subCategoryOptions && (
        <div className="mt-2 w-2/5 mr-4">
          <label>Subcategory:</label><br></br>
          <select value={selectedSubCategory} onChange={handleSubCategoryChange} className="rounded border  border-red-300 h-10 w-full">
            <option value="">Select subcategory</option>
            {subCategoryOptions.map(subCategory => (
              <option key={subCategory.categoryId} value={subCategory.categoryId}>
                {subCategory.categoryEnglish}
              </option>
            ))}
          </select>
        </div>
      )}

                <div className="mt-2 w-1/5">
                    <label></label><br></br>
                    <a href="/Categories" className=' bg-ft-light text-white px-4 py-4 rounded hover:bg-ft'>Create new category</a>
                </div>
            </div>
           
        </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
                    <label htmlFor="descriptionEnglish">Description<span className='text-red-600'>*</span></label>
                    <textarea
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="descriptionEnglish"
                        name="descriptionEnglish"
                        value={values.descriptionEnglish}
                        onChange={handleChange}
                        required
                    />
                    
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
                    <label htmlFor="descriptionTraditionalChinese">Description(Trad Chi)<span className='text-red-600'>*</span>
</label>
                    <textarea
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="descriptionTraditionalChinese"
                        name="descriptionTraditionalChinese"
                        value={values.descriptionTraditionalChinese}
                        onChange={handleChange}
                        required
                    />
                    
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">  
            <div className='px-4 w-full'>
                    <label htmlFor="descriptionSimplifiedChinese">Description(Simp Chi)

</label>
                    <textarea
                        type="text"
                        className="form-control ring-0 hover:border-ft-light active:border-ft-light focus:border-ft-light"
                        id="descriptionSimplifiedChinese"
                        name="descriptionSimplifiedChinese"
                        value={values.descriptionSimplifiedChinese}
                        onChange={handleChange}
                    />
                    
                </div>
            </div>
            <div className="form-row flex m-3">  
                <div className='px-4 w-full'>
                    <h4>File (1)</h4>
                    <h5>Current file: {fileId1!==0?<a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(1)}> {fileName1}</a>:"No uploaded file"}</h5>
                    <label htmlFor="file-upload1" className="upload-label mr-3 ">
                        Browse to {fileId1?"replace":"upload"}
                    </label>
                    <input
                        id="file-upload1"
                        type="file"
                        accept="image/*,.pdf,.xlsx, .xls, .csv, .ppt, .pptx, .doc, .docx"
                        onChange={e => handleFileInputChange(e, 1)}
                    />
                </div>
            </div>
            <div className="form-row flex m-3">  
                <div className='px-4 w-full'>
                    <h4>File (2)</h4>
                    <h5>Current file: <a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(2)}> {fileName2}</a></h5>
                    <label htmlFor="file-upload2" className="upload-label mr-3">
                    Browse to {fileId2?"replace":"upload"}
                    </label>
                    <input
                        id="file-upload2"
                        type="file"
                        accept="image/*,.pdf,.xlsx, .xls, .csv, .ppt, .pptx, .doc, .docx"
                        onChange={e => handleFileInputChange(e,2)}
                    />
                </div>
            </div>
            <div className="form-row flex m-3">  
                <div className='px-4 w-full'>
                    <h4>File (3)</h4>
                    <h5>Current file: <a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(3)}> {fileName3} </a></h5>
                    <label htmlFor="file-upload3" className="upload-label mr-3">
                    Browse to {fileId3?"replace":"upload"}
                    </label>
                    <input
                        id="file-upload3"
                        type="file"
                        accept="image/*,.pdf,.xlsx, .xls, .csv, .ppt, .pptx, .doc, .docx"
                        onChange={e => handleFileInputChange(e,3)}
                    />
                </div>
            </div>
            <div className="form-row flex mx-3 my-5">
        <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                <label className="relative inline-flex items-center mr-5 cursor-pointer">
            <input type="checkbox" defaultChecked={isPin} onChange={handleIsPinChange} value={isPin} className="sr-only peer"  />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ft-light"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 ">Pin?</span>
            </label>
                </div>
            </div>
            <div className="form-group w-1/2 flex justify-center">
                <div className='w-11/12'>
                <label className="relative inline-flex items-center mr-5 cursor-pointer">
            <input type="checkbox" defaultChecked={isPromo} onChange={handleIsPromoChange} value={isPromo} className="sr-only peer"  />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ft-light"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">Send to Latest Promos?</span>
            </label>
                </div>
            </div>
        </div>
        

            <div className="px-6 py-4 flex justify-end">
            <button type="Submit" className=" text-white bg-ft-light hover:bg-ft rounded-md px-4 py-2 active:bg-white active:text-ft active:ring-1 active:ring-ft transition">Save</button>
            <button onClick={goBack} type="button" className="ml-4 text-ft-light ring-1 ring-ft-light bg-white hover:bg-ft hover:text-white rounded-md px-4 py-2 active:bg-white active:text-red-500 active:ring-1 active:ring-red-500 transition">Cancel</button>
        </div>
        </form>
       
    </div>
  )}
  </>
)}

export default CreateDocForm;