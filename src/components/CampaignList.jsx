/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect,useRef } from 'react';
import '../css/campaignListcss.css';
import '../css/lineclamp2css.css';
import {API_BASE_URL} from '../api.config.js';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ScrollToTopButton from './ScrollToTopButton';
import { useNavigate} from 'react-router-dom';
import Modal from 'react-modal';
import "css-file-icons"

function CampaignList(props) {
  const [showModal, setShowModal] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const inputRefCamName = useRef(null);
  const inputRefCamCode = useRef(null);
  const [selectedValue, setSelectedValue] = useState();
  const [Page, setPage] = useState();
  const [Orderby, setOrderby] = useState("updatedDate");
  const [OrderSequence, setOrderSequence] = useState("desc");
  const [campaigns, setCampaigns] = useState([]);
  const [CampaignCode, setCampaignCode] = useState();
  const [CampaignName, setCampaignName] = useState();
  const [preResult, setPreResult] = useState();
  const [nextResult, setNextResult] = useState();
  const [pagination, setPagination] = useState({});
  const [isMobileScreen, setIsMobileScreen] = useState(((window.innerWidth <= 1250)?true:false));
  const [isXsMobileScreen, setXsIsMobileScreen] = useState(((window.screen.width<= 385)?true:false));
  const [postData, setPostData] = useState({
    userParameter: {
      loginName: props.userInformation.username ?? "",
      name: props.userInformation.name ?? "",
      companyID: props.userInformation.companyID ?? "",
      email: props.userInformation.email ?? "",
      brokerCode: props.userInformation.brokerCode ?? "",
      ifaIdentity: props.userInformation.ifaIdentity ?? "",
      pibaNumber: props.userInformation.pibaNumber ?? "",
      ifaCaNameEng: props.userInformation.ifaCaNameEng ?? "",
      ifaCaNameOther: props.userInformation.ifaCaNameOther ?? "",
      companyName: props.userInformation.companyName ?? "",
      ifaCaLicenseNumber: props.userInformation.ifaCaLicenseNumber ?? "",
      role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"||props.userInformation.role==="cee-user"||props.userInformation.role==="pdd-user"?"internal-admin":props.userInformation.role) ?? ""
    },
    pageableParameter: {
      pageNumber: 0,
      pageSize: 10,
      orderBy: Orderby,
      orderSequence: OrderSequence
    },
    campaignListParameter: {
      campaignCode: CampaignCode??"",
        campaignName: CampaignName??""
    }
  });

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setPostData({
      userParameter: {
        loginName: props.userInformation.username ?? "",
        name: props.userInformation.name ?? "",
        companyID: props.userInformation.companyID ?? "",
        email: props.userInformation.email ?? "",
        brokerCode: props.userInformation.brokerCode ?? "",
        ifaIdentity: props.userInformation.ifaIdentity ?? "",
        pibaNumber: props.userInformation.pibaNumber ?? "",
        ifaCaNameEng: props.userInformation.ifaCaNameEng ?? "",
        ifaCaNameOther: props.userInformation.ifaCaNameOther ?? "",
        companyName: props.userInformation.companyName ?? "",
        ifaCaLicenseNumber: props.userInformation.ifaCaLicenseNumber ?? "",
        role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"||props.userInformation.role==="cee-user"||props.userInformation.role==="pdd-user"?"internal-admin":props.userInformation.role) ?? ""
      },
      pageableParameter: {
        pageNumber: 0,
        pageSize: event.target.value,
        orderBy: Orderby,
        orderSequence: OrderSequence
      },
      campaignListParameter: {
        campaignCode: CampaignCode,
        campaignName: CampaignName
      }
    });
  
  };
  
  const handlePageChange = (event) => {
    setPage(event)
    setPostData({
      userParameter: {
        loginName: props.userInformation.username ?? "",
        name: props.userInformation.name ?? "",
        companyID: props.userInformation.companyID ?? "",
        email: props.userInformation.email ?? "",
        brokerCode: props.userInformation.brokerCode ?? "",
        ifaIdentity: props.userInformation.ifaIdentity ?? "",
        pibaNumber: props.userInformation.pibaNumber ?? "",
        ifaCaNameEng: props.userInformation.ifaCaNameEng ?? "",
        ifaCaNameOther: props.userInformation.ifaCaNameOther ?? "",
        companyName: props.userInformation.companyName ?? "",
        ifaCaLicenseNumber: props.userInformation.ifaCaLicenseNumber ?? "",
        role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"||props.userInformation.role==="cee-user"||props.userInformation.role==="pdd-user"?"internal-admin":props.userInformation.role) ?? ""
      },
      pageableParameter: {
        pageNumber: event-1,
        pageSize: pagination.pageSize,
        orderBy: Orderby,
        orderSequence: OrderSequence
      },
      campaignListParameter: {
        campaignCode: CampaignCode,
        campaignName: CampaignName
      }
    });
  
  };

  const handleCampaignChange = () => {
    setCampaignCode(inputRefCamCode.current.value)
    setCampaignName(inputRefCamName.current.value)
    setPostData({
      userParameter: {
        loginName: props.userInformation.username ?? "",
        name: props.userInformation.name ?? "",
        companyID: props.userInformation.companyID ?? "",
        email: props.userInformation.email ?? "",
        brokerCode: props.userInformation.brokerCode ?? "",
        ifaIdentity: props.userInformation.ifaIdentity ?? "",
        pibaNumber: props.userInformation.pibaNumber ?? "",
        ifaCaNameEng: props.userInformation.ifaCaNameEng ?? "",
        ifaCaNameOther: props.userInformation.ifaCaNameOther ?? "",
        companyName: props.userInformation.companyName ?? "",
        ifaCaLicenseNumber: props.userInformation.ifaCaLicenseNumber ?? "",
        role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"||props.userInformation.role==="cee-user"||props.userInformation.role==="pdd-user"?"internal-admin":props.userInformation.role) ?? ""
      },
      pageableParameter: {
        pageNumber: 0,
        pageSize: pagination.pageSize,
        orderBy: Orderby,
        orderSequence: OrderSequence
      },
      campaignListParameter: {
        campaignCode: inputRefCamCode.current.value,
        campaignName: inputRefCamName.current.value
      }
    });
  
  };

  const handleResetChange = () => {
    inputRefCamCode.current.value=""
    inputRefCamName.current.value=""
    setCampaignCode("")
    setCampaignName("")
    setPage(1)
    setPostData({
      userParameter: {
        loginName: props.userInformation.username ?? "",
        name: props.userInformation.name ?? "",
        companyID: props.userInformation.companyID ?? "",
        email: props.userInformation.email ?? "",
        brokerCode: props.userInformation.brokerCode ?? "",
        ifaIdentity: props.userInformation.ifaIdentity ?? "",
        pibaNumber: props.userInformation.pibaNumber ?? "",
        ifaCaNameEng: props.userInformation.ifaCaNameEng ?? "",
        ifaCaNameOther: props.userInformation.ifaCaNameOther ?? "",
        companyName: props.userInformation.companyName ?? "",
        ifaCaLicenseNumber: props.userInformation.ifaCaLicenseNumber ?? "",
        role:  (props.userInformation.role === "pdd-admin" || props.userInformation.role === "cee-admin"||props.userInformation.role==="cee-user"||props.userInformation.role==="pdd-user")
        ? "internal-admin"
        : (props.userInformation.role || "")
      },
      pageableParameter: {
        pageNumber: 0,
        pageSize: pagination.pageSize,
        orderBy: "updatedDate",
        orderSequence: "desc"
      },
      campaignListParameter: {
        campaignCode: "",
        campaignName: ""
      }
    });
  
  };



  useEffect(() => {
    console.log(postData)
    fetch(`${API_BASE_URL}/campaign/headers`, {
      method: 'POST',
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(data => {
        
        // if (props.userInformation.role === "pdd-admin" || props.userInformation.role === "pdd-user") {
        //   filteredCampaigns = data.campaignList.filter(campaign => campaign.template === "PDD - CI Conversion Campaign");
        // } else if (props.userInformation.role === "cee-admin" || props.userInformation.role === "cee-user") {
        //   filteredCampaigns = data.campaignList.filter(campaign => campaign.template !== "PDD - CI Conversion Campaign");
        // }
        // setCampaigns(filteredCampaigns);
        if(data.campaignList!==undefined){
          let filteredCampaigns = data.campaignList; 
          setCampaigns(filteredCampaigns);
        }

        if(data.pagination!==undefined){
          setPagination(data.pagination);

          if (data.pagination.pageNumber === 0) {
            setPreResult(1);
            setNextResult(data.pagination.pageSize);
          } else {
            setPreResult(data.pagination.pageNumber * data.pagination.pageSize + 1);
            setNextResult((data.pagination.pageNumber + 1) * data.pagination.pageSize);
          }
    
          if (!data.pagination.hasNext) {
            setPreResult((data.pagination.totalPages - 1) * data.pagination.pageSize + 1);
            setNextResult(data.pagination.totalNumberOfRecords - (data.pagination.totalPages - 1) * data.pagination.pageSize + data.pagination.pageNumber * data.pagination.pageSize);
          }
      }else{
        let temp = [];
        temp.pageSize = 0;
        temp.totalPages = 0;
        temp.totalNumberOfRecords = 0;
        setPagination(temp)
      }
      })
      .catch(error => console.error(error));
  }, [postData, selectedValue, Page]);
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [Page])
  
  useEffect(() => {
    function handleResize() {
      setIsMobileScreen(window.innerWidth <= 1250);
      setXsIsMobileScreen(window.screen.width<= 385);
    }
  
    handleResize();
    window.addEventListener("resize", handleResize);
  
    // Add this block to update isMobileScreen when the screen size is larger than 1207 pixels
    return () => {
      window.removeEventListener("resize", handleResize);
      setIsMobileScreen(false);
      setXsIsMobileScreen(false);
    };
  }, []);


  const handleOrder = (event) =>{
    handleOrderBy(event);
    handlePostData(event);
  }

  const handleOrderBy = (event) =>{
    setOrderby(event)
  }

  const handlePostData = (event) =>{
    if(OrderSequence==="desc"){
      setOrderSequence("asc")
      setPostData({
        userParameter: {
          loginName: props.userInformation.username ?? "",
          name: props.userInformation.name ?? "",
          companyID: props.userInformation.companyID ?? "",
          email: props.userInformation.email ?? "",
          brokerCode: props.userInformation.brokerCode ?? "",
          ifaIdentity: props.userInformation.ifaIdentity ?? "",
          pibaNumber: props.userInformation.pibaNumber ?? "",
          ifaCaNameEng: props.userInformation.ifaCaNameEng ?? "",
          ifaCaNameOther: props.userInformation.ifaCaNameOther ?? "",
          companyName: props.userInformation.companyName ?? "",
          ifaCaLicenseNumber: props.userInformation.ifaCaLicenseNumber ?? "",
          role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"||props.userInformation.role==="cee-user"||props.userInformation.role==="pdd-user"?"internal-admin":props.userInformation.role) ?? ""
        },
        pageableParameter: {
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          orderBy: event,
          orderSequence: "asc"
        },
        campaignListParameter: {
          campaignCode: CampaignCode,
          campaignName: CampaignName
        }
      })
    }else{
      setOrderSequence("desc")
      setPostData({
        userParameter: {
          loginName: props.userInformation.username ?? "",
          name: props.userInformation.name ?? "",
          companyID: props.userInformation.companyID ?? "",
          email: props.userInformation.email ?? "",
          brokerCode: props.userInformation.brokerCode ?? "",
          ifaIdentity: props.userInformation.ifaIdentity ?? "",
          pibaNumber: props.userInformation.pibaNumber ?? "",
          ifaCaNameEng: props.userInformation.ifaCaNameEng ?? "",
          ifaCaNameOther: props.userInformation.ifaCaNameOther ?? "",
          companyName: props.userInformation.companyName ?? "",
          ifaCaLicenseNumber: props.userInformation.ifaCaLicenseNumber ?? "",
          role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"||props.userInformation.role==="cee-user"||props.userInformation.role==="pdd-user"?"internal-admin":props.userInformation.role) ?? ""
        },
        pageableParameter: {
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          orderBy: event,
          orderSequence: "desc"
        },
        campaignListParameter: {
          campaignCode: CampaignCode,
          campaignName: CampaignName
        }
      })
    }
    
  }

  const navigate = useNavigate();

  const EditCampaign = (event) => {
    navigate('/EditCampaign',{state:{event}});
  }

  const ViewDetail = (campaignHeaderId, campaignName, campaignTemplate) => {
    navigate('/CampaignDetail',{state:{campaignHeaderId,campaignName, campaignTemplate}});
  }


const customStyles = {
  content: {
    width: 'auto',
    maxWidth:'1200px',
    height: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
};

const openEdit = (thumbnailDocID) => {
  handlePreview(thumbnailDocID)
  setEditIsOpen(true);
};

const closeEdit = () => {
  setUploadedFileName("")
  setUploadedFile("")
  setEditIsOpen(false);
  setShowModal(false);
};


const handlePreview = (thumbnailDocID) => {
  fetch(`${API_BASE_URL}/document/download`, {
    method: 'POST',
    body: JSON.stringify({
      documentParameter: {
        documentId: thumbnailDocID
      }
    })
  })
  .then(response => response.json())
  .then(data => {
    if(data.documentName){
      setUploadedFileName(data.documentName)
      setUploadedFile(data.documentBase64String)
    }
  })
  .catch(error => console.error(error));

  
};


const preview = () => {


  const fileExtension = uploadedFileName.split(".").pop().toLowerCase();

  if (fileExtension === "png" || fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "gif") {
    // Image preview
    return <img src={`data:image/${fileExtension};base64,${uploadedFile}`} alt="Document Thumbnail" />;
  } 
};

const download = () => {
  const fileExtension = uploadedFileName.split(".").pop().toLowerCase();
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
  if (fileExtension === "png" || fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "gif") {
    // Image preview
    return (
      <div> 
        <div className='text-center'> 
          <p>
            {uploadedFileName} 
          </p>
        </div>
      <div className='w-72 flex mt-5 justify-between'>

          <div className=''>
            <button className=" text-white bg-ft-light rounded px-3 py-2">
              <a className="text-white" href={`data:${fileType};base64,${uploadedFile}`} download={uploadedFileName}>
                Download
              </a>
            </button>
          
          </div>
          <div className=''>
            <button className=' bg-ft-light text-white px-3 py-2 rounded' onClick={closeEdit}>Close</button>
          </div>
      </div>
    </div>
    )
  }else{
    const reArrange = "fi fi-size-xl fi-"+fileExtension;
    return (
      <div>
      <div className='mt-3'>
        <div className={reArrange}>
          <div className="fi-content">{fileExtension}</div>
        </div>
        <div className='text-center'> 
          <p>
            {uploadedFileName} 
          </p>
        </div>
      </div>
       <div className='w-84 flex mt-5 justify-center'>

          <div className='mr-10'>
              <button className=" text-white bg-ft-light rounded px-3 py-2">
                <a className="text-white" href={`data:application/octet-stream;base64,${uploadedFile}`} download={uploadedFileName}>
                  Download
                </a>
              </button>
            
            </div>
            <div className=''>
              <button className=' bg-ft-light text-white px-3 py-2 rounded' onClick={closeEdit}>Close</button>
            </div>
      </div>
   </div>
   )
  }

  }

  const openMobile = (docId) =>{
    handlePreview(docId)
    setShowModal(true)
  } 

  return (
    <>
    {isMobileScreen ? (
    <div className='w-full '>
    <div className=''>
      <h1>Campaign</h1>
    </div>
    {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
               <div className='mt-4 flex'>
               <a className='bg-ft-light text-center w-full text-white py-3 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft' href='/CreateCampaign'>
                 Create
               </a>
             </div>
            :
            <></>
          }

  <div className="mt-4">
    <span>Campaign Name</span>
    <span className="input-search">
      <input
        data-input=""
        className="form-control py-3"
        type="search"
        placeholder="Campaign Name"
        maxLength="500"
        id="Input_SearchCampaignName"
        ref={inputRefCamName}
        style={{ userSelect: "auto" }}
      />
    </span>
  </div>
 
  <div className="mt-3">
    <span>Campaign Code</span>
    <span className="input-search">
      <input
        data-input=""
        className="form-control py-3"
        type="search"
        placeholder="Campaign Code"
        maxLength="500"
        ref={inputRefCamCode}
        id="Input_SearchCampaignCode"
        style={{ userSelect: "auto" }}
      />
    </span>
  </div>


    <div className='flex mt-4'>
      <a onClick={() => handleCampaignChange()} className="text-center w-full bg-ft-light text-white py-3 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft">
        Search
      </a>
    </div>
    <div className='flex mt-3'>
      <a onClick={()=>handleResetChange()} className="text-center w-full bg-white text-ft-light ring-ft-light ring-1 py-3 rounded hover:bg-ft hover:text-white active:bg-ft-light active:ring-1 active:ring-ft">
        Reset
      </a>
    </div>

  <div className='mt-4'>
    <p>Show
    <select
id="countries"
aria-label="Select page size"
className="mx-2 w-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ft-light focus:border-ft-light p-2.5"
value={selectedValue}
onChange={handleChange}
>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select> 
      records per page.
    </p>

  </div>
  {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-5/6 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
               
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
        
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <h1 className='text-center mb-5'>Preview</h1>
                 {preview()}
                 {download()}
                </div>
               
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

  <div className="flex">
    <table className=" flex w-full bg-white">
      <thead className="sm:w-1/5 w-2/5 text-white">
      {campaigns || campaigns.length !== 0 ?campaigns.map((campaignMobileHead) => {
        return (
        <tr className="pl-1 bg-ft-light flex flex-col mb-2 border border-slate-300" key={campaignMobileHead.campaignHeaderId}>
              {((isXsMobileScreen)||(campaignMobileHead.campaignNameEng.split(" ")[0].length<20))?
              <><th className='font-normal h-12'>campaigns Name</th></>
              :
              <th className='h-6 font-normal'>campaigns Name</th>}
               {((isXsMobileScreen)||(campaignMobileHead.campaignCode.split(" ")[0].length<20))?
              <><th className='h-12 font-normal'>campaigns Code</th></>
              :
              <th className='h-6 font-normal'>campaigns Code</th>}
          
          <th className='h-6 font-normal'>Start Date</th>
          <th className='h-6 font-normal'>End Date</th>
          <th className='h-6 font-normal'>Latest Update</th>
          <th className='h-6 font-normal'>IFA/CA</th>
          {(!campaignMobileHead.remark===null)&&((campaignMobileHead.remark.length>22)&&(isXsMobileScreen))?
              <th className='h-12 truncate font-normal'>Remarks</th>
              :
              <th className='h-6 font-normal'>Remarks</th>}
          <th className='h-6 font-normal'>Preview</th>
          {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
            <th className='h-6 font-normal mb-1'>Edit</th>:
            <></>}
        </tr>
        );}):""}
      </thead>
      <tbody className="sm:w-4/5 w-3/5 ">
      {campaigns.map((campaignMobileBody) => {
          const startDate = new Date(campaignMobileBody.campaignStartDate);
          const endDate = new Date(campaignMobileBody.campaignEndDate);
          const updatedDate = new Date(campaignMobileBody.updatedDate);
          const formattedStartDate = startDate.toISOString().slice(0, 10);
          const formattedEndDate = endDate.toISOString().slice(0, 10);
          const formattedUpdatedDate = updatedDate.toISOString().slice(0, 10);

          if (campaignMobileBody.remark === "NULL") {
            campaignMobileBody.remark = '';
          }

          let check = "N"; // Declare check variable
    
          if (props.userInformation.role === "pdd-admin" || props.userInformation.role === "pdd-user") {
            if (campaignMobileBody.template === "PDD - CI Conversion Campaign") {
              check = "Y"; // Update check value
            }
          } else if (props.userInformation.role === "cee-admin" || props.userInformation.role === "cee-user") {
            if (campaignMobileBody.template !== "PDD - CI Conversion Campaign") {
              check = "Y"; // Update check value
            }
          } else {
            check = "Y"; // Update check value
          }

          return (
            <tr className="flex flex-col border border-slate-300 mb-2" key={campaignMobileBody.campaignHeaderId}>
              
              {check === "Y"?
                          <>
                          {((isXsMobileScreen)||(campaignMobileBody.campaignNameEng.split(" ")[0].length<20))?
              <td className='pl-3 pr-3 h-12 lineclamp2'><a className='text-ft-light hover:text-ft' onClick={()=> ViewDetail(campaignMobileBody.campaignHeaderId,campaignMobileBody.campaignNameEng, campaignMobileBody.template)} href="/CampaignDetail">{campaignMobileBody.campaignNameEng}</a></td>
              :
              <td className='pl-3 pr-3 h-6 truncate'><a className='text-ft-light hover:text-ft' onClick={()=> ViewDetail(campaignMobileBody.campaignHeaderId,campaignMobileBody.campaignNameEng, campaignMobileBody.template)} href="/CampaignDetail">{campaignMobileBody.campaignNameEng}</a></td>}
              
              {((isXsMobileScreen)||(campaignMobileBody.campaignCode.split(" ")[0].length<20))?
              <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.campaignCode}</td>
              :
              <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.campaignCode}</td>}
                          </>
                          :
                          <>
                          {((isXsMobileScreen)||(campaignMobileBody.campaignNameEng.split(" ")[0].length<20))?
              <td className='pl-3 pr-3 h-12 lineclamp2'><a className='text-gray-500 hover:text-gray-500'>{campaignMobileBody.campaignNameEng}</a></td>
              :
              <td className='pl-3 pr-3 h-6 truncate'><a className='text-gray-500 hover:text-gray-500' >{campaignMobileBody.campaignNameEng}</a></td>}
              
              {((isXsMobileScreen)||(campaignMobileBody.campaignCode.split(" ")[0].length<20))?
              <td className='pl-3 pr-3 h-12 break-all text-gray-500 hover:text-gray-500'>{campaignMobileBody.campaignCode}</td>
              :
              <td className='pl-3 pr-3 h-6 truncate text-gray-500 hover:text-gray-500'>{campaignMobileBody.campaignCode}</td>}
                          </>
                         }
                         

                         {check === "Y"?
                        <>
                            <td className='pl-3 pr-3 h-6'>{formattedStartDate}</td>
              <td className='pl-3 pr-3 h-6'>{formattedEndDate}</td>
              <td className='pl-3 pr-3 h-6'>{formattedUpdatedDate}</td>
              <td className='pl-3 pr-3 h-6'>{campaignMobileBody.ifaCaIndicator}</td>
              {(!campaignMobileBody.remark===null)&&(isXsMobileScreen)?
              <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.remark}</div></td>
              :
              <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.remark}</td>}
                        </>
                      :
                        <>
                           <td className='pl-3 pr-3 h-6 text-gray-500'>{formattedStartDate}</td>
              <td className='pl-3 pr-3 h-6 text-gray-500'>{formattedEndDate}</td>
              <td className='pl-3 pr-3 h-6 text-gray-500'>{formattedUpdatedDate}</td>
              <td className='pl-3 pr-3 h-6 text-gray-500'>{campaignMobileBody.ifaCaIndicator}</td>
              {(!campaignMobileBody.remark===null)&&(isXsMobileScreen)?
              <td className='pl-3 pr-3 h-12 text-gray-500'><div className='lineclamp2 '>{campaignMobileBody.remark}</div></td>
              :
              <td className='pl-3 pr-3 h-6 truncate text-gray-500'>{campaignMobileBody.remark}</td>}
                        </>
                      }
            



              <td className='pl-3 pr-3 h-6'>      {campaignMobileBody.thumbnailDocID!==0&&check==="Y"?
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a onClick={()=> openMobile(campaignMobileBody.thumbnailDocID)}  className=''>
                        <svg fill="none" className='campaign h-6 ' stroke="#009188" strokeWidth="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                        </svg>
                        </a>:<></>}</td>


                        {check==="Y"&&(props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin")?
                   <td className='pl-3 pr-3 h-6 mb-1'>
                   <a href='/EditCampaign' onClick={()=> EditCampaign(campaignMobileBody)}>
                     <svg className='campaign h-6' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                       <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                     </svg>
                   </a>
                 </td>:
                  <></>}
              
             
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  <div className="flex flex-col items-center">
  <div>
    {pagination.totalNumberOfRecords===0?<p className="text-sm text-gray-700">
    No items to show...</p>:<p className="text-sm text-gray-700">
      Showing<span className="font-medium"> {preResult}</span> to <span className="font-medium">{nextResult}</span> of{' '}
      <span className="font-medium">{(pagination.totalNumberOfRecords)}</span> results
    </p>}
  </div>
  {pagination && pagination.totalNumberOfRecords > 0 && (
      <Stack spacing={2}>
        <Pagination
          page={parseInt(pagination.pageNumber + 1)}
          shape={'circular'}
          count={
            pagination.totalNumberOfRecords && pagination.pageSize && !isNaN(pagination.totalNumberOfRecords) && !isNaN(pagination.pageSize)
              ? parseInt(Math.trunc(pagination.totalNumberOfRecords / pagination.pageSize) + 1)
              : 0
          }
          onChange={(e, value) => handlePageChange(value)}
        />
      </Stack>
    )}
  </div>
  <ScrollToTopButton />
</div>

  )
  :   
  (
      <div className='w-deflaut px-2'>
        <div className='flex justify-content-between align-items-center my-3'>
          <div className=''>
            <h1>Campaign</h1>
          </div>
          {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
            <div className=''>
              <a className='bg-ft-light text-white px-3 py-2 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft' href='/CreateCampaign'>
                Create
              </a>
            </div>
            :
            <></>
          }
        </div>
        <div className='w-full flex justify-center mb-4'>
        <div className="w-1/3 mr-5">
          <span>Campaign Name</span>
          <span className="input-search">
            <input
              data-input=""
              className="form-control"
              type="search"
              placeholder="Campaign Name"
              maxLength="500"
              id="Input_SearchCampaignName"
              ref={inputRefCamName}
              style={{ userSelect: "auto" }}
            />
          </span>
        </div>
        <div className="w-1/3 mr-5">
          <span>Campaign Code</span>
          <span className="input-search">
            <input
              data-input=""
              className="form-control"
              type="search"
              placeholder="Campaign Code"
              maxLength="500"
              ref={inputRefCamCode}
              id="Input_SearchCampaignCode"
              style={{ userSelect: "auto" }}
            />
          </span>
        </div>
        <div className="w-1/3 flex flex-col justify-between">
          <div className='h-1/2'>
          </div>
          <div className='h-1/2 flex'> 
          <div className='mr-5'>
            <a href="#PleaseEnableJavascript.html" onClick={() => handleCampaignChange()} className="bg-ft-light text-white px-3 py-2 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft">
              Search
            </a>
          </div>
          <div className=''>
            <a href='#PleaseEnableJavascript.html' onClick={()=>handleResetChange()} className="bg-white text-ft-light ring-ft-light ring-1 px-3 py-2 rounded hover:bg-ft hover:text-white active:bg-ft-light active:ring-1 active:ring-ft">
              Reset
            </a>
          </div>
          </div>
        </div>
        </div>
        <div className='mr-5'>
          <p>Show
          <select
      id="countries"
      aria-label="Select page size"
      className="mx-2 w-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ft-light focus:border-ft-light p-2.5"
      value={selectedValue}
      onChange={handleChange}
    >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select> 
            records per page.
          </p>

        </div>
      <Modal isOpen={editIsOpen} onRequestClose={closeEdit} style={customStyles} ariaHideApp={false}>
          <h1 className='mb-4'>Preview</h1>
          {preview()}
          {download()}
        </Modal>
        <div className='overflow-y-hidden' >
          <table className="rounded-md border-collapse border border-slate-800 w-table " >
          <thead className=''>
            <tr className="border border-slate-300 " >
              <th className=' hover:text-ft-light cursor-pointer pl-5 w-56 ' onClick={()=> handleOrder("campaignNameEng")}>
                Campaign Name
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
              </th>
            <th className=' hover:text-ft-light cursor-pointer w-56 ' onClick={()=> handleOrder("campaignCode")}>
              Campaign Code
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
            </th>
            <th className=' hover:text-ft-light cursor-pointer w-32 ' onClick={()=> handleOrder("campaignStartDate")}>
              Start Date
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
            </th>
            <th className=' hover:text-ft-light cursor-pointer w-32' onClick={()=> handleOrder("campaignEndDate")}>
              End Date
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
            </th>
            <th className=' hover:text-ft-light cursor-pointer w-36' onClick={()=> handleOrder("updatedDate")}>
              Latest Update
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
            </th>
            <th className=' hover:text-ft-light cursor-pointer' onClick={()=> handleOrder("ifaCaIndicator")}>
              IFA/CA
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
            </th>
            <th className=' hover:text-ft-light cursor-pointer w-36' onClick={()=> handleOrder("remark")}>
              Remarks
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
            </th>
            <th className=' hover:text-ft-light cursor-pointer' onClick={()=> handleOrder("thumbnailDocID")}>
              Preview
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
            </th>
            {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
            <th className=' w-16'>
              Edit
            </th>:
            <></>}
            </tr>
            </thead>
            <tbody className='text-left'>
            
            {campaigns.map((campaign) => {
                  const startDate = new Date(campaign.campaignStartDate);
                  const endDate = new Date(campaign.campaignEndDate);
                  const updatedDate = new Date(campaign.updatedDate);
                  const formattedStartDate = startDate.toISOString().slice(0, 10);
                  const formattedEndDate = endDate.toISOString().slice(0, 10);
                  const formattedUpdatedDate = updatedDate.toISOString().slice(0, 10);
                  
                  if (campaign.remark === "NULL") {
                    campaign.remark = '';
                  }
                
                  let check = "N"; // Declare check variable
    
                  if (props.userInformation.role === "pdd-admin" || props.userInformation.role === "pdd-user") {
                    if (campaign.template === "PDD - CI Conversion Campaign") {
                      check = "Y"; // Update check value
                    }
                  } else if (props.userInformation.role === "cee-admin" || props.userInformation.role === "cee-user") {
                    if (campaign.template !== "PDD - CI Conversion Campaign") {
                      check = "Y"; // Update check value
                    }
                  } else {
                    check = "Y"; // Update check value
                  }
                  
                  return (
                    
                    <tr className="border border-slate-300 h-16" key={campaign.campaignHeaderId}>
                      <td className=''>
                        <div className='w-52 lineclamp2 pl-5'>
                          {check === "Y"?
                          <a onClick={()=> ViewDetail(campaign.campaignHeaderId,campaign.campaignNameEng, campaign.template)} className='text-ft-light hover:text-ft ' href="/CampaignDetail">
                          {campaign.campaignNameEng}
                        </a>
                          :
                          <a className='text-gray-500 hover:text-gray-500 '>
                          {campaign.campaignNameEng}
                        </a>
                         }
                          {/* <a onClick={()=> ViewDetail(campaign.campaignHeaderId,campaign.campaignNameEng, campaign.template)} className='text-ft-light hover:text-ft ' href="/CampaignDetail">
                            {campaign.campaignNameEng}
                          </a> */}
                        </div>
                      </td>
                      {check === "Y"?
                        <>
                          <td className=''><div className='w-48 break-all'>{campaign.campaignCode}</div></td>
                          <td className='w-32'>{formattedStartDate}</td>
                          <td className='w-32'>{formattedEndDate}</td>
                          <td className='w-36'>{formattedUpdatedDate}</td>
                          <td className=''>{campaign.ifaCaIndicator}</td>
                          <td className=''><div data-tooltip-target="tooltip-default" className='w-32 lineclamp2'>{campaign.remark}</div></td>
                        </>
                      :
                        <>
                          <td className=''><div className='w-48 break-all text-gray-500'>{campaign.campaignCode}</div></td>
                          <td className='w-32 text-gray-500'>{formattedStartDate}</td>
                          <td className='w-32 text-gray-500'>{formattedEndDate}</td>
                          <td className='w-36 text-gray-500'>{formattedUpdatedDate}</td>
                          <td className='text-gray-500'>{campaign.ifaCaIndicator}</td>
                          <td className='text-gray-500'><div data-tooltip-target="tooltip-default" className='w-32 lineclamp2'>{campaign.remark}</div></td>
                        </>
                      }
                      <td className=''>
                      <div className='flex w-16 align-middle justify-center'>
                    
                        {campaign.thumbnailDocID!==0&&check==="Y"?
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a onClick={()=> openEdit(campaign.thumbnailDocID)}  className=''>
                        <svg fill="none" className='campaign h-8 ' stroke="#009188" strokeWidth="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                        </svg>
                        </a>:<></>}
                      </div>
                    </td>
                    {check==="Y"&&(props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin")?
                  <td className=''>
                    <a onClick={()=> EditCampaign(campaign)} href='/EditCampaign'>
                      <svg className='campaign h-8' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                      </svg>
                    </a>
                  </td>:
                  <></>}
                     
                  </tr>
                );
              })}
              
              </tbody>
              
              </table>
              </div>
              <div className="flex items-center justify-between px-4 py-3 md:px-6">
      <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
        <div>
          {pagination.totalNumberOfRecords===0?<p className="text-sm text-gray-700">
          No items to show...</p>:<p className="text-sm text-gray-700">
            Showing<span className="font-medium"> {preResult}</span> to <span className="font-medium">{nextResult}</span> of{' '}
            <span className="font-medium">{(pagination.totalNumberOfRecords)}</span> results
          </p>}
        </div>
          <div>
          {pagination && pagination.totalNumberOfRecords > 0 && (
            <Stack spacing={2}>
              <Pagination
                page={parseInt(pagination.pageNumber + 1)}
                shape={'circular'}
                count={
                  pagination.totalNumberOfRecords && pagination.pageSize && !isNaN(pagination.totalNumberOfRecords) && !isNaN(pagination.pageSize)
                    ? (pagination.totalNumberOfRecords % pagination.pageSize)===0?pagination.totalNumberOfRecords / pagination.pageSize: (parseInt(Math.trunc(pagination.totalNumberOfRecords / pagination.pageSize)+ 1))
                    : 0
                }
                onChange={(e, value) => handlePageChange(value)}
              />
            </Stack>
          )}
        </div>
      </div>
    </div>
  </div>)}
            </>
  )}

export default CampaignList;