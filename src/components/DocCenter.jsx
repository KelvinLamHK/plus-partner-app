/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect,useRef } from 'react';
import '../css/campaignListcss.css';
import '../css/lineclamp2css.css';
import {API_BASE_URL} from '../api.config.js';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate} from 'react-router-dom';
import Visibility from './Visibility';
import Category from './Category';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useLocation } from "react-router-dom";
import ScrollToTopButton from './ScrollToTopButton';

function DocCenter(props) {
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const valueList = location.state?.selectedOption || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  const inputCategory = location.state?.selectedCategory || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  const inputSubCategory = location.state?.selectedSubCategory || null;
  const inputRefTitleEnglish = useRef(null);
  const inputRefEffectiveDateFrom = useRef(null);
  const inputRefEffectiveDateTo = useRef(null);
  const [selectedValue, setSelectedValue] = useState();
  const [Page, setPage] = useState();
  const [Orderby, setOrderby] = useState("updatedDate");
  const [OrderSequence, setOrderSequence] = useState("desc");
  const [titleEnglish, setTitleEnglish] = useState();
  const [effectiveDateFrom, setEffectiveDateFrom] = useState(null);
  const [effectiveDateTo, setEffectiveDateTo] = useState(null);
  const [visibility, setVisibility] = useState(location.state?.selectedOption || []);
  const [mainCategory, setMainCategory] = useState(location.state?.selectedCategory || null);
  const [subCategory, setSubCategory] = useState(location.state?.selectedSubCategory || null);
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [preResult, setPreResult] = useState();
  const [nextResult, setNextResult] = useState();
  const [pagination, setPagination] = useState({});
  const [isMobileScreen, setIsMobileScreen] = useState(((window.innerWidth <= 1250)?true:false));
  // eslint-disable-next-line
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
      role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
    },
    pageableParameter: {
      pageNumber: 0,
      pageSize: 10,
      orderBy: "updatedDate",
      orderSequence: "desc"
    },
    documentCenterParameter: {
      titleEnglish: titleEnglish,
      effectiveDateFrom: effectiveDateFrom,
      effectiveDateTo: effectiveDateTo,
      visibilityList: [],
      level1CategoryId: null,
      level2CategoryId: null,
    }
  });
  const [reloadCounter, setReloadCounter] = useState(0);

  const handleReload = () => {

    setReloadCounter(prevCounter => prevCounter + 1);
  };



  useEffect(() => {

    if(valueList.length!==0){
    const selectedVisibility = valueList.map(item => item.value);
    setVisibility(selectedVisibility);
    }
    if(inputCategory!==null){
      setMainCategory(inputCategory);
      }
    
      if(inputSubCategory!==null){
        setSubCategory(inputSubCategory);
        }
  }, [valueList, inputSubCategory, inputCategory]);

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
        role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
      },
      pageableParameter: {
        pageNumber: 0,
        pageSize: event.target.value,
        orderBy: Orderby,
        orderSequence: OrderSequence
      },
      documentCenterParameter: {
        titleEnglish: titleEnglish,
        effectiveDateFrom: effectiveDateFrom,
        effectiveDateTo: effectiveDateTo,
        visibilityList: visibility,
        level1CategoryId: mainCategory,
        level2CategoryId: subCategory,
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
        role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
      },
      pageableParameter: {
        pageNumber: event-1,
        pageSize: pagination.pageSize,
        orderBy: Orderby,
        orderSequence: OrderSequence
      },
      documentCenterParameter: {
        titleEnglish: titleEnglish,
        effectiveDateFrom: effectiveDateFrom,
        effectiveDateTo: effectiveDateTo,
        visibilityList: visibility,
        level1CategoryId: mainCategory,
        level2CategoryId: subCategory,
      }
    });
  
  };

  const handleCampaignChange = () => {
    setTitleEnglish(inputRefTitleEnglish.current.value)
    setEffectiveDateFrom((inputRefEffectiveDateFrom.current.value===""?null:inputRefEffectiveDateFrom.current.value))
    setEffectiveDateTo((inputRefEffectiveDateTo.current.value===""?null:inputRefEffectiveDateTo.current.value))
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
        role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
      },
      pageableParameter: {
        pageNumber: 0,
        pageSize: pagination.pageSize,
        orderBy: Orderby,
        orderSequence: OrderSequence
      },
      documentCenterParameter: {
        titleEnglish: inputRefTitleEnglish.current.value,
        effectiveDateFrom: (inputRefEffectiveDateFrom.current.value===""?null:inputRefEffectiveDateFrom.current.value),
        effectiveDateTo: (inputRefEffectiveDateTo.current.value===""?null:inputRefEffectiveDateTo.current.value),
        visibilityList: visibility,
        level1CategoryId: mainCategory,
        level2CategoryId: subCategory,
      }
    });
  
  };

  const handleResetChange = () => {
    inputRefTitleEnglish.current.value="";
    inputRefEffectiveDateFrom.current.value="";
    inputRefEffectiveDateTo.current.value="";
    handleReload();
    setTitleEnglish("")
    setEffectiveDateFrom(null)
    setEffectiveDateTo(null)
    setVisibility([])
    setMainCategory(null)
    setSubCategory(null)
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
        role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
      },
      pageableParameter: {
        pageNumber: 0,
        pageSize: pagination.pageSize,
        orderBy: "updatedDate",
        orderSequence: "desc"
      },
      documentCenterParameter: {
        titleEnglish: "",
        effectiveDateFrom: null,
        effectiveDateTo: null,
        visibilityList: [],
        level1CategoryId: null,
        level2CategoryId: null,
      }
    });
  
  };



  useEffect(() => {
    fetch(`${API_BASE_URL}/document-center/list`, {
      method: 'POST',
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(data => {
        if(data.documentCenterList){
          setCampaigns(data.documentCenterList);
        }else{
          setCampaigns([]);
        }
        setPagination(data.pagination);
        if (data.pagination.pageNumber === 0) {
          setPreResult(1);
          setNextResult(data.pagination.pageSize);
        }else{
          setPreResult(data.pagination.pageNumber*data.pagination.pageSize+1);
          setNextResult((data.pagination.pageNumber+1)*data.pagination.pageSize);
        }

  
        if (!data.pagination.hasNext) {
          setPreResult((data.pagination.totalPages - 1) * data.pagination.pageSize + 1);
          setNextResult(data.pagination.totalNumberOfRecords - (data.pagination.totalPages - 1) * data.pagination.pageSize+data.pagination.pageNumber*data.pagination.pageSize)
        }
      })
      .catch(error => console.error(error));

      fetch(`${API_BASE_URL}/document-center/category/list`, {
        method: 'POST',
      })
        .then(response => response.json())
        .then(data => {
          setCategories(data.firstLevelCategoryList);
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
          role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
        },
        pageableParameter: {
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          orderBy: event,
          orderSequence: "asc"
        },
        documentCenterParameter: {
          titleEnglish: titleEnglish,
          effectiveDateFrom: effectiveDateFrom,
          effectiveDateTo: effectiveDateTo,
          visibilityList: visibility,
          level1CategoryId: mainCategory,
          level2CategoryId: subCategory,
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
          role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
        },
        pageableParameter: {
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          orderBy: event,
          orderSequence: "desc"
        },
        documentCenterParameter: {
          titleEnglish: titleEnglish,
          effectiveDateFrom: effectiveDateFrom,
          effectiveDateTo: effectiveDateTo,
          visibilityList: visibility,
          level1CategoryId: mainCategory,
          level2CategoryId: subCategory,
        }
      })
    }
    
  }

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
    navigate('/EditDocument',{state:{event}});
  }

  // const ViewDetail = (event) => {
  //   navigate('/CampaignDetail',{state:{event}});
  // }

  

  return (
    <>
    {isMobileScreen ? (
      
      <div className='w-full '>
    <div className=''>
      <h1>Document Center</h1>
    </div>
    {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
               <div className='mt-4 flex'>
               <a className='bg-ft-light text-center w-full text-white py-3 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft' href='/CreateDoc'>
               Upload
               </a>
             </div>
            :
            <></>
          }

<div className='border border-red-300 py-3 px-3 rounded-md mt-3'>
            <Visibility  key={`vis-${reloadCounter}`} reloadCounter={reloadCounter}/>
            <div className='flex mt-4'>
           
            <Category  key={`vis-${reloadCounter}`} reloadCounter={reloadCounter}/>
            </div>
          
  
                <div className='flex mt-4'>
                    <div className='w-full '>
                    <span>Title</span>
                    <span className="input-search">
                        <input
                        data-input=""
                        className="form-control"
                        type="search"
                        placeholder="Title"
                        maxLength="500"
                        id="Input_SearchCampaignName"
                        ref={inputRefTitleEnglish}
                        style={{ userSelect: "auto" }}
                        />
                    </span>
                    </div>
                   
                </div>
                <div className='flex mt-4'>
                <div className='w-1/2 mr-4'>
                    <span>Effective Date from</span>
                    <span className="input-search">
                        <input
                        type="date"
                        className="form-control"
                        placeholder="Effective Period From"
                        maxLength="500"
                        ref={inputRefEffectiveDateFrom}
                        id="Input_SearchCampaignCode"
                        style={{ userSelect: "auto" }}
                        />
                    </span>
                  </div>
                  <div className='w-1/2'>
                    <span>Effective Date till</span>
                    <span className="input-search">
                        <input
                        type="date"
                        className="form-control"
                        
                        placeholder="Effective Period To"
                        maxLength="500"
                        ref={inputRefEffectiveDateTo}
                        id="Input_SearchCampaignCode2"
                        style={{ userSelect: "auto" }}
                        />
                    </span>
                  </div>
                </div>
            <div className='flex mt-5 justify-end'> 
          <div className='mr-5'>
            <a onClick={()=>handleResetChange()} className="cursor-pointer bg-white text-ft-light ring-ft-light ring-1 px-3 py-2 rounded hover:bg-ft hover:text-white active:bg-ft-light active:ring-1 active:ring-ft">
              Reset
            </a>
          </div>
          <div className=''>
          <a onClick={() => handleCampaignChange()} className="cursor-pointer bg-ft-light text-white px-3 py-2 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft">
              Search
            </a>
          </div>
          </div>
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

  <div className="flex">
    <table className=" flex w-full bg-white">
      <thead className="sm:w-1/5 w-2/5 text-white">
      {campaigns || campaigns.length !== 0 ?campaigns.map((campaignMobileHead) => {
        return (
        <tr className="pl-1 bg-ft-light flex flex-col mb-2 border border-slate-300" key={campaignMobileHead.documentCenterId}>
             
            <th className='h-6 font-normal'>Title</th>
          <th className='h-6 font-normal'>Main Category</th>
          <th className='h-6 font-normal'>Sub-Category</th>
          <th className='h-6 font-normal'>Publish Date</th>
          <th className='h-6 font-normal'>Expiry Date</th>
          <th className='h-6 font-normal'>File(1)</th>
          <th className='h-6 font-normal'>File(2)</th>
          <th className='h-6 font-normal'>File(3)</th>
          {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
              <th className='h-6 font-normal mb-1'>Edit</th>
              :
              <></>
          }
        </tr>
        );}):""}
      </thead>
      <tbody className="sm:w-4/5 w-3/5 ">
      {campaigns.map((campaignMobileBody) => {
            const startDate = new Date(campaignMobileBody.effectiveDateFrom);
            const endDate = new Date(campaignMobileBody.effectiveDateTo);
            const formattedStartDate = startDate.toISOString().slice(0, 10);
            const formattedEndDate = endDate.toISOString().slice(0, 10);

   

            if(campaignMobileBody.file1Name === null){
              campaignMobileBody.file1Name = '';
            }
            campaignMobileBody.level1CategoryId=String(campaignMobileBody.level1CategoryId);
            campaignMobileBody.level2CategoryId=String(campaignMobileBody.level2CategoryId);

            if(campaignMobileBody.level2CategoryId === null){
              campaignMobileBody.level2CategoryId = "";
            }

          return (
            <tr className="flex flex-col border border-slate-300 mb-2" key={campaignMobileBody.documentCenterId}>
              <td className='pl-3 pr-3 h-6'>{campaignMobileBody.titleEnglish}</td>
              <td className='pl-3 pr-3 h-6'>{
                          categories
                          .filter((cat) => cat.categoryId === campaignMobileBody.level1CategoryId)
                          .map((mainCat) => (mainCat.categoryEnglish))
                        }</td>
              <td className='pl-3 pr-3 h-6'>{
                            categories
                              .filter(cat => cat.categoryId === campaignMobileBody.level1CategoryId)
                              .flatMap(mainCat => {
                                if (mainCat.secondLevelCategoryList) {
                                  return mainCat.secondLevelCategoryList
                                    .filter(subCat => subCat.categoryId === campaignMobileBody.level2CategoryId)
                                    .map(mainCat => mainCat.categoryEnglish);
                                }
                                return [];
                              })
                          }</td>
              <td className='pl-3 pr-3 h-6'>{formattedStartDate}</td>
              <td className='pl-3 pr-3 h-6'>{formattedEndDate}</td>
              <td className='pl-3 pr-3 h-6'>
                <div>
                  <a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(campaignMobileBody.file1Id, campaignMobileBody.file1Name)}>
                    {campaignMobileBody.file1Name}
                  </a>
                </div>
              </td>
              <td className='pl-3 pr-3 h-6'>
                <div>
                  <a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(campaignMobileBody.file2Id, campaignMobileBody.file2Name)}>
                    {campaignMobileBody.file2Name}
                  </a>
                </div>
              </td>
              <td className='pl-3 pr-3 h-6'>
                <div>
                  <a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(campaignMobileBody.file3Id, campaignMobileBody.file3Name)}>
                    {campaignMobileBody.file3Name}
                  </a>
                </div>
              </td>


              {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
                   <td className='pl-3 pr-3 h-6 mb-1'>
                   <a onClick={()=> EditDocument(campaignMobileBody)}>
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
            <h1>Document Center</h1>
          </div>
          <div className=''>
          {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
             <a className='bg-ft-light text-white px-3 py-2 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft' href='/CreateDoc'>
             Upload
             </a>
            :
            <></>
          }  
          
          </div>
        </div>
        <div className='border border-red-300 py-3 px-3 rounded-md '>
            <Visibility  key={`vis-${reloadCounter}`} reloadCounter={reloadCounter}/>
            <div className='flex mt-4'>
           
            <Category  key={`vis-${reloadCounter}`} reloadCounter={reloadCounter}/>
            </div>
          
  
                <div className='flex mt-4'>
                    <div className='w-full '>
                    <span>Title</span>
                    <span className="input-search">
                        <input
                        data-input=""
                        className="form-control"
                        type="search"
                        placeholder="Title"
                        maxLength="500"
                        id="Input_SearchCampaignName"
                        ref={inputRefTitleEnglish}
                        style={{ userSelect: "auto" }}
                        />
                    </span>
                    </div>
                   
                </div>
                <div className='flex mt-4'>
                <div className='w-1/2 mr-4'>
                    <span>Effective Date from</span>
                    <span className="input-search">
                        <input
                        type="date"
                        className="form-control"
                        placeholder="Effective Period From"
                        maxLength="500"
                        ref={inputRefEffectiveDateFrom}
                        id="Input_SearchCampaignCode"
                        style={{ userSelect: "auto" }}
                        />
                    </span>
                  </div>
                  <div className='w-1/2'>
                    <span>Effective Date till</span>
                    <span className="input-search">
                        <input
                        type="date"
                        className="form-control"
                        
                        placeholder="Effective Period To"
                        maxLength="500"
                        ref={inputRefEffectiveDateTo}
                        id="Input_SearchCampaignCode2"
                        style={{ userSelect: "auto" }}
                        />
                    </span>
                  </div>
                </div>
            <div className='flex mt-5 justify-end'> 
          <div className='mr-5'>
            <a onClick={()=>handleResetChange()} className="cursor-pointer bg-white text-ft-light ring-ft-light ring-1 px-3 py-2 rounded hover:bg-ft hover:text-white active:bg-ft-light active:ring-1 active:ring-ft">
              Reset
            </a>
          </div>
          <div className=''>
          <a onClick={() => handleCampaignChange()} className="cursor-pointer bg-ft-light text-white px-3 py-2 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft">
              Search
            </a>
          </div>
          </div>
        </div>
       
        <div className='mr-5 mt-4'>
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
        <div className='w-table flex '>
        <div className='overflow-x w-full '>
        <table className='table-fixed overflow-scroll w-full block'>
            <thead>
                <tr className='border border-slate-300 '>
                <th className=' hover:text-ft-light cursor-pointer pl-5 h-8' onClick={()=> handleOrder("titleEnglish")}>
                <div className='inline-block h-6 w-80'>
                Title
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
                </div>
              </th>
            <th className=' h-8 '>
            <div className='inline-block h-6 w-48'>
            Main Category
              </div>
            </th>
            <th className=' h-8'>
            <div className='inline-block h-6 w-48'>
            Sub-Category
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("effectiveDateFrom")}>
            <div className='inline-block h-6 w-40'>
            Publish Date
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("effectiveDateTo")}>
            <div className='inline-block h-6 w-40'>
            Expiry Date
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("file1Name")}>
            <div className='inline-block h-6 w-44'>
            File(1)
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("file2Name")}>
            <div className='inline-block h-6 w-44'>
            File(2)
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8 ' onClick={()=> handleOrder("file3Name")}>
            <div className='inline-block h-6 w-44'>File(3)
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            
            {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
            <th className=' h-8'>
            <div className='inline-block h-6 w-16'>
              Edit
               </div>
          </th>:
            <></>}
                </tr>
            </thead>
            <tbody className='text-left '>
            {campaigns.map((campaign) => {
                const startDate = new Date(campaign.effectiveDateFrom);
                const endDate = new Date(campaign.effectiveDateTo);
                const formattedStartDate = startDate.toISOString().slice(0, 10);
                const formattedEndDate = endDate.toISOString().slice(0, 10);

       

                if(campaign.file1Name === null){
                  campaign.file1Name = '';
                }
                campaign.level1CategoryId=String(campaign.level1CategoryId);
                campaign.level2CategoryId=String(campaign.level2CategoryId);

                if(campaign.level2CategoryId === null){
                  campaign.level2CategoryId = "";
                }

                return (
                  <tr className="border border-slate-300 h-16" key={campaign.documentCenterId}>
                     <td className=''><div className='w-72 truncate pl-5 items-center'>{campaign.titleEnglish}</div></td>
                    <td className=''>
                      <div className='w-36 truncate  items-center align-middle'>
                        {
                          categories
                          .filter((cat) => cat.categoryId === campaign.level1CategoryId)
                          .map((mainCat) => (mainCat.categoryEnglish))
                        }
                      </div>
                    </td>
                    <td className=''>
                      <div className='w-36 truncate items-center align-middle' >
                          {
                            categories
                              .filter(cat => cat.categoryId === campaign.level1CategoryId)
                              .flatMap(mainCat => {
                                if (mainCat.secondLevelCategoryList) {
                                  return mainCat.secondLevelCategoryList
                                    .filter(subCat => subCat.categoryId === campaign.level2CategoryId)
                                    .map(mainCat => mainCat.categoryEnglish);
                                }
                                return [];
                              })
                          }
                          </div>
                        </td>
                    <td className=''><div className='w-36 truncate items-center align-middle' >{formattedStartDate}</div></td>
                    <td className=''><div className='w-36 truncate items-center align-middle' >{formattedEndDate}</div></td>
                    <td className=''><div className='w-36 truncate items-center align-middle' ><a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(campaign.file1Id, campaign.file1Name)}> {campaign.file1Name}</a></div></td>
                    <td className=''><div className='w-36 truncate items-center align-middle' ><a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(campaign.file2Id, campaign.file2Name)}> {campaign.file2Name}</a></div></td>
                    <td className=''><div className='w-36 truncate items-center align-middle' ><a className="cursor-pointer	 text-ft-light hover:text-ft" onClick={() => downloadFile(campaign.file3Id, campaign.file3Name)}> {campaign.file3Name}</a></div></td>
                    {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
                   <td className=''>
                   <a href='/EditDocument' onClick={()=> EditDocument(campaign)}>
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

export default DocCenter;