/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect} from 'react';
import '../css/campaignListcss.css';
import '../css/lineclamp2css.css';
import {API_BASE_URL} from '../api.config.js';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ScrollToTopButton from './ScrollToTopButton';
import { useLocation} from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";
import { debounce } from "lodash";
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


function CampaignDetailList(props) {

  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const PermcampaignHeaderId = ((location.state?.campaignHeaderId)===undefined?localStorage.getItem('campaignheaderId'):location.state.campaignHeaderId);
  const PermcampaignHeaderName = ((location.state?.campaignName)===undefined?localStorage.getItem('campaignName'):location.state.campaignName);
  const PermcampaignTemplate = ((location.state?.campaignTemplate)===undefined?localStorage.getItem('campaignTemplate'):location.state.campaignTemplate);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [reArrange, setReArrange] = useState("");
  const [originCampaign, setOriginCampaign] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/campaign/details`, {
      method: 'POST',
      body: JSON.stringify({
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
          pageSize: 1000000,
          orderBy: "campaignDetailId", 
          orderSequence: "desc"
        },
        campaignDetailParameter: {
          campaignHeaderId: PermcampaignHeaderId,
    
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        setOriginCampaign(data.campaignDetailList);
      });
  }, []); // Empty dependency array to run the effect only once
  


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const customStyles = {
    content: {
      width: 'auto',
      maxWidth:'650px',
      height: '450px',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
    },
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/campaign/details/upload`, {
        method: 'POST',
        body: JSON.stringify({
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
          campaignDetailListParameter: {
            campaignHeaderId: PermcampaignHeaderId,
            campaignDetailList: importedData.map((data) => ({ ...data, campaignHeaderId: PermcampaignHeaderId }))
          }
        })
      });
      const data = await response.text();
      if (isNaN(+data)) {
        Swal.fire({
            icon: 'success',
            title: ('Campaign Detail imported'),
            showConfirmButton: false,
            timer: 1700
        }).then(function() {
            window.location.reload();
        });
    }
    } catch (error) {
    } 
  };

  const downloadTemplate = (fileName) => {
    const filePath = require("../templates/" + fileName); // Modify the path to the template file
  
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Assuming the data is in the first sheet of the Excel file
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Assuming the title is in the first row (index 0)
      const title = jsonData[0];
  
      // Define the mapping between Excel column titles and JSON property names for template 1
      const template1Mapping = {
        "Party ID": "partyId",
        "Policyowner name (TC)": "clientFullNameChi",
        "Policyowner name (EN)": "clientFullNameEng",
        "Policyowner Mobile": "mobile",
        "Policyowner Email": "email",
        "Customer Language Preference (TC/SC/EN)": "languageForCommunication",
        "Reference Policy No.": "latestIssuedPolicy",
        "Customer communication (eDM/MMS)": "communicationChannel",
        "K Dollar": "kDollar",
        "K Dollar membership number": "kDollarMembership",
        "Redemption Status": "redemptionStatus",
      };
  
      // Define the mapping between Excel column titles and JSON property names for template 2
      const template2Mapping = {
        "Policy Number": "latestIssuedPolicy",
        "Current Plan Code": "currentPlanCode",
        "Title": "title",
        "Client Name": "clientFullNameEng",
        "Area Code": "mobileAreaCode",
        "Mobile": "mobile",
        "Email": "email",
        "PICS Status": "picsIndicator",
        "Existing Customer": "existingCustomer",
        "Customer / Party ID": "partyId",
        "Region Code": "servAgentRegion",
        "Agent/Broker Code": "trCode",
        "Agent/Broker Name": "trNameEng",
        "Broker Contact (email)": "servAgentEmail",
      };
  
      let templateType = null;
      let mapping = null;
  
      // Check if the column titles match the expected titles for template 1 and the uploaded template matches PermcampaignTemplate
      if (
        PermcampaignTemplate === "CEE - K Dollar" &&
        title.every((t) => template1Mapping.hasOwnProperty(t))
      ) {
        templateType = "Template 1";
        mapping = template1Mapping;
      }
  
      // Check if the column titles match the expected titles for template 2 and the uploaded template matches PermcampaignTemplate
      if (
        PermcampaignTemplate === "PDD - CI Conversion Campaign" &&
        title.every((t) => template2Mapping.hasOwnProperty(t))
      ) {
        templateType = "Template 2";
        mapping = template2Mapping;
      }
  
      if (!templateType) {
        // Handle the case when the template is not recognized or the column titles don't match
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Invalid template or unrecognized column titles",
          type: "error",
        });
        return;
      }
  
      // Assuming the data starts from the second row (index 1)
      const importedData = jsonData.slice(1).map((row) => {
        const dataObj = {};
        row.forEach((value, index) => {
          const columnTitle = title[index];
          const propertyName = mapping[columnTitle];
          dataObj[propertyName] = value;
        });
        return dataObj;
      }).filter((data) => Object.keys(data).length !== 0);
  
      const fileExtension = file.name.split(".").pop().toLowerCase();
  
      const reArrange = "fi fi-size-xl fi-" + fileExtension;
      setFileExtension(fileExtension);
      setReArrange(reArrange);
      setImportedData(importedData);
      setFileName(file.name); // Store the file name

    };
  
    if (file) {
      reader.readAsArrayBuffer(file);
    }
  };

  const options = [
    { label: "Client Name(Eng)", value: "clientFullNameEng" },
    { label: "Client Name(Chi)", value: "clientFullNameChi" },
    { label: "Date of Birth From", value: "dateOfBirthFrom" },
    { label: "Date of Birth To", value: "dateOfBirthTo" },
    { label: "Birthday Month(E.g. June -> 06)", value: "birthdayMonth" },
    { label: "First Policy Issue Date From", value: "firstPolicyIssueDateFrom" },
    { label: "First Policy Issue Date To", value: "firstPolicyIssueDateTo" },
    { label: "Latest Issued Policy", value: "latestIssuedPolicy" },
    { label: "Broker / Agent Code", value: "servAgentCode" },
    // { label: "Company Name", value: "trNameEng" },
    { label: "Agent Name", value: "servAgentName" },
  ];

  const kDollarOptions = [
    { label: "Party ID", value: "partyId" },
    { label: "Policyowner name (TC)", value: "clientFullNameChi" },
    { label: "Policyowner name (EN)", value: "clientFullNameEng" },
    { label: "Policyowner Mobile", value: "mobile" },
    { label: "Policyowner Email", value: "email" },
    { label: "Customer Language Preference (TC/SC/EN)", value: "languageForCommunication" },
    { label: "Customer communication (eDM/MMS)", value: "communicationChannel" },
    { label: "Reference Policy No.", value: "latestIssuedPolicy" },
    { label: "K Dollar membership number", value: "kDollarMembership" },
    { label: "Redemption Status ", value: "redemptionStatus" },
  ];

  const ciOptions = [
    { label: "Policy Number ", value: "latestIssuedPolicy" },
    { label: "Current Plan Code ", value: "currentPlanCode" },
    { label: "Area Code", value: "mobileAreaCode" },
    { label: "Mobile", value: "mobile" },
    { label: "Email", value: "email" },
    { label: "PICS Status", value: "picsIndicator" },
    { label: "Customer / Party ID", value: "partyId" },
    { label: "Region Code", value: "servAgentRegion" },
    { label: "Agent/Broker Code", value: "trCode" },
    // { label: "Agent/Broker Name", value: "trNameEng" },
    { label: "Client Name", value: "clientFullNameEng" },
    { label: "Existing Customer", value: "existingCustomer" },
    { label: "Broker Contact (email)", value: "servAgentEmail" },
    { label: "Title", value: "title" },
  ];


  const [selected, setSelected] = useState([]);
  const [inputs, setInputs] = useState(options.map((option) => ({ value: "" })));
  const [inputValue, setInputValue] = useState(options.map((option) => ({ value: "" })));

  const handleSelect = (selectedOption) => {
    setSelected(selectedOption);
  };

  const handleCancel = (optionToRemove) => {
    const newSelected = selected.filter((option) => option.value !== optionToRemove.value);
    setSelected(newSelected);
    const inputBox = document.getElementById(`input_${optionToRemove.value}`);
    if (inputBox) {
      inputBox.value = "";
      handleInputChange(optionToRemove, "");
    }
  };

  const handleInputChange = debounce((option, value) => {
    const templateOption = (PermcampaignTemplate === "PDD - CI Conversion Campaign" ? ciOptions : PermcampaignTemplate === "CEE - K Dollar" ? kDollarOptions : options);
    const newInputs = [...inputs];
    const index = templateOption.findIndex((o) => o.value === option.value);
  
    if (index !== -1) { // Check if index is valid
      newInputs[index].value = value;
      setInputs(newInputs);
  
      const inputValue = templateOption.reduce((acc, cur) => {
        const inputIndex = templateOption.findIndex((o) => o.value === cur.value);
        acc[cur.value] = newInputs[inputIndex].value.trim() === "" ? "" : newInputs[inputIndex].value || null;
        return acc;
      }, {});
  
      setInputValue(inputValue);
    }
  }, 500);
 
  const [selectedValue, setSelectedValue] = useState();
  const [Page, setPage] = useState();
  const [Orderby, setOrderby] = useState("campaignDetailId");
  const [OrderSequence, setOrderSequence] = useState("desc");
  const [campaigns, setCampaigns] = useState([]);
  const [preResult, setPreResult] = useState();
  const [nextResult, setNextResult] = useState();
  const [pagination, setPagination] = useState({});
  const [isMobileScreen, setIsMobileScreen] = useState(((window.innerWidth <= 1250)?true:false));
  const [isXsMobileScreen, setXsIsMobileScreen] = useState(((window.screen.width<= 500)||(window.innerWidth<=500)?true:false));
  const [detailData, setDetailData] = useState({
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
    campaignDetailParameter: {
      campaignHeaderId: PermcampaignHeaderId,

    }
  });


  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setDetailData({
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
      campaignDetailParameter: {
        campaignHeaderId: PermcampaignHeaderId,
        ...(inputValue.clientFullNameEng && { clientFullNameEng: inputValue.clientFullNameEng }),
        ...(inputValue.clientFullNameChi && { clientFullNameChi: inputValue.clientFullNameChi }),
        ...(inputValue.dateOfBirthFrom && { dateOfBirthFrom: inputValue.dateOfBirthFrom }),
        ...(inputValue.dateOfBirthTo && { dateOfBirthTo: inputValue.dateOfBirthTo }),
        ...(inputValue.firstPolicyIssueDateFrom && { firstPolicyIssueDateFrom: inputValue.firstPolicyIssueDateFrom }),
        ...(inputValue.firstPolicyIssueDateTo && { firstPolicyIssueDateTo: inputValue.firstPolicyIssueDateTo }),
        ...(inputValue.latestIssuedPolicy && { latestIssuedPolicy: inputValue.latestIssuedPolicy }),
        ...(inputValue.servAgentCode && { servAgentCode: inputValue.servAgentCode }),
        ...(inputValue.servAgentName && { servAgentName: inputValue.servAgentName }),
        ...(inputValue.kDollarMembership && { kDollarMembership: inputValue.kDollarMembership }),
        ...(inputValue.redemptionStatus && { redemptionStatus: inputValue.redemptionStatus }),
        ...(inputValue.currentPlanCode && { currentPlanCode: inputValue.currentPlanCode }),
        ...(inputValue.title && { title: inputValue.title }),
        ...(inputValue.existingCustomer && { existingCustomer: inputValue.existingCustomer }),
        ...(inputValue.partyId && { partyId: inputValue.partyId }),
        ...(inputValue.birthdayMonth && { birthdayMonth: inputValue.birthdayMonth }),
        ...(inputValue.mobile && { mobile: inputValue.mobile }),
        ...(inputValue.email && { email: inputValue.email }),
        ...(inputValue.languageForCommunication && { languageForCommunication: inputValue.languageForCommunication }),
        ...(inputValue.communicationChannel && { communicationChannel: inputValue.communicationChannel }),
        ...(inputValue.servAgentEmail && { servAgentEmail: inputValue.servAgentEmail }),
        ...(inputValue.mobileAreaCode && { mobileAreaCode: inputValue.mobileAreaCode }),
        ...(inputValue.picsIndicator && { picsIndicator: inputValue.picsIndicator }),
      }
    });
  
  };
  
  const handlePageChange = (event) => {
    setPage(event)
    setDetailData({
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
      campaignDetailParameter: {
        campaignHeaderId: PermcampaignHeaderId,
        ...(inputValue.clientFullNameEng && { clientFullNameEng: inputValue.clientFullNameEng }),
        ...(inputValue.clientFullNameChi && { clientFullNameChi: inputValue.clientFullNameChi }),
        ...(inputValue.dateOfBirthFrom && { dateOfBirthFrom: inputValue.dateOfBirthFrom }),
        ...(inputValue.dateOfBirthTo && { dateOfBirthTo: inputValue.dateOfBirthTo }),
        ...(inputValue.firstPolicyIssueDateFrom && { firstPolicyIssueDateFrom: inputValue.firstPolicyIssueDateFrom }),
        ...(inputValue.firstPolicyIssueDateTo && { firstPolicyIssueDateTo: inputValue.firstPolicyIssueDateTo }),
        ...(inputValue.latestIssuedPolicy && { latestIssuedPolicy: inputValue.latestIssuedPolicy }),
        ...(inputValue.servAgentCode && { servAgentCode: inputValue.servAgentCode }),
        ...(inputValue.servAgentName && { servAgentName: inputValue.servAgentName }),
        ...(inputValue.kDollarMembership && { kDollarMembership: inputValue.kDollarMembership }),
        ...(inputValue.redemptionStatus && { redemptionStatus: inputValue.redemptionStatus }),
        ...(inputValue.currentPlanCode && { currentPlanCode: inputValue.currentPlanCode }),
        ...(inputValue.title && { title: inputValue.title }),
        ...(inputValue.existingCustomer && { existingCustomer: inputValue.existingCustomer }),
        ...(inputValue.partyId && { partyId: inputValue.partyId }),
        ...(inputValue.birthdayMonth && { birthdayMonth: inputValue.birthdayMonth }),
        ...(inputValue.mobile && { mobile: inputValue.mobile }),
        ...(inputValue.email && { email: inputValue.email }),
        ...(inputValue.languageForCommunication && { languageForCommunication: inputValue.languageForCommunication }),
        ...(inputValue.communicationChannel && { communicationChannel: inputValue.communicationChannel }),
        ...(inputValue.servAgentEmail && { servAgentEmail: inputValue.servAgentEmail }),
        ...(inputValue.mobileAreaCode && { mobileAreaCode: inputValue.mobileAreaCode }),
        ...(inputValue.picsIndicator && { picsIndicator: inputValue.picsIndicator }),
      }
    });
  
  };

  const handleCampaignChange = (campaignheaderId,campaignName, template) => {
    localStorage.setItem('campaignheaderId', campaignheaderId);
    localStorage.setItem('campaignName', campaignName);
    localStorage.setItem('campaignTemplate', template)
    
    setDetailData({
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
      campaignDetailParameter: {
        campaignHeaderId: campaignheaderId,
        ...(inputValue.clientFullNameEng && { clientFullNameEng: inputValue.clientFullNameEng }),
        ...(inputValue.clientFullNameChi && { clientFullNameChi: inputValue.clientFullNameChi }),
        ...(inputValue.dateOfBirthFrom && { dateOfBirthFrom: inputValue.dateOfBirthFrom }),
        ...(inputValue.dateOfBirthTo && { dateOfBirthTo: inputValue.dateOfBirthTo }),
        ...(inputValue.firstPolicyIssueDateFrom && { firstPolicyIssueDateFrom: inputValue.firstPolicyIssueDateFrom }),
        ...(inputValue.firstPolicyIssueDateTo && { firstPolicyIssueDateTo: inputValue.firstPolicyIssueDateTo }),
        ...(inputValue.latestIssuedPolicy && { latestIssuedPolicy: inputValue.latestIssuedPolicy }),
        ...(inputValue.servAgentCode && { servAgentCode: inputValue.servAgentCode }),
        ...(inputValue.servAgentName && { servAgentName: inputValue.servAgentName }),
        ...(inputValue.kDollarMembership && { kDollarMembership: inputValue.kDollarMembership }),
        ...(inputValue.redemptionStatus && { redemptionStatus: inputValue.redemptionStatus }),
        ...(inputValue.currentPlanCode && { currentPlanCode: inputValue.currentPlanCode }),
        ...(inputValue.title && { title: inputValue.title }),
        ...(inputValue.existingCustomer && { existingCustomer: inputValue.existingCustomer }),
        ...(inputValue.partyId && { partyId: inputValue.partyId }),
        ...(inputValue.birthdayMonth && { birthdayMonth: inputValue.birthdayMonth }),
        ...(inputValue.mobile && { mobile: inputValue.mobile }),
        ...(inputValue.email && { email: inputValue.email }),
        ...(inputValue.languageForCommunication && { languageForCommunication: inputValue.languageForCommunication }),
        ...(inputValue.communicationChannel && { communicationChannel: inputValue.communicationChannel }),
        ...(inputValue.servAgentEmail && { servAgentEmail: inputValue.servAgentEmail }),
        ...(inputValue.mobileAreaCode && { mobileAreaCode: inputValue.mobileAreaCode }),
        ...(inputValue.picsIndicator && { picsIndicator: inputValue.picsIndicator }),
      }
    });
  
  };

  const handleResetChange = () => {
    setPage(1)
    setDetailData({
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
        orderBy: "campaignDetailId",
        orderSequence: "desc"
      },
      campaignDetailParameter: {
        campaignHeaderId: PermcampaignHeaderId,
      }
    });
  
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/campaign/details`, {
      method: 'POST',
      body: JSON.stringify(detailData)
    })
      .then(response => response.json())
      .then(data => {

        setCampaigns(data.campaignDetailList);
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

  }, [detailData, selectedValue, Page]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [Page])
  
  useEffect(() => {
    function handleResize() {
      setIsMobileScreen(window.innerWidth <= 1250);
      setXsIsMobileScreen((window.screen.width<= 500)||(window.innerWidth<=500));
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
      setDetailData({
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
        campaignDetailParameter: {
          campaignHeaderId: PermcampaignHeaderId?? "",
          ...(inputValue.clientFullNameEng && { clientFullNameEng: inputValue.clientFullNameEng }),
          ...(inputValue.clientFullNameChi && { clientFullNameChi: inputValue.clientFullNameChi }),
          ...(inputValue.dateOfBirthFrom && { dateOfBirthFrom: inputValue.dateOfBirthFrom }),
          ...(inputValue.dateOfBirthTo && { dateOfBirthTo: inputValue.dateOfBirthTo }),
          ...(inputValue.firstPolicyIssueDateFrom && { firstPolicyIssueDateFrom: inputValue.firstPolicyIssueDateFrom }),
          ...(inputValue.firstPolicyIssueDateTo && { firstPolicyIssueDateTo: inputValue.firstPolicyIssueDateTo }),
          ...(inputValue.latestIssuedPolicy && { latestIssuedPolicy: inputValue.latestIssuedPolicy }),
          ...(inputValue.servAgentCode && { servAgentCode: inputValue.servAgentCode }),
          ...(inputValue.servAgentName && { servAgentName: inputValue.servAgentName }),
          ...(inputValue.kDollarMembership && { kDollarMembership: inputValue.kDollarMembership }),
          ...(inputValue.redemptionStatus && { redemptionStatus: inputValue.redemptionStatus }),
          ...(inputValue.currentPlanCode && { currentPlanCode: inputValue.currentPlanCode }),
          ...(inputValue.title && { title: inputValue.title }),
          ...(inputValue.existingCustomer && { existingCustomer: inputValue.existingCustomer }),
          ...(inputValue.partyId && { partyId: inputValue.partyId }),
          ...(inputValue.birthdayMonth && { birthdayMonth: inputValue.birthdayMonth }),
          ...(inputValue.mobile && { mobile: inputValue.mobile }),
          ...(inputValue.email && { email: inputValue.email }),
          ...(inputValue.languageForCommunication && { languageForCommunication: inputValue.languageForCommunication }),
          ...(inputValue.communicationChannel && { communicationChannel: inputValue.communicationChannel }),
          ...(inputValue.servAgentEmail && { servAgentEmail: inputValue.servAgentEmail }),
          ...(inputValue.mobileAreaCode && { mobileAreaCode: inputValue.mobileAreaCode }),
          ...(inputValue.picsIndicator && { picsIndicator: inputValue.picsIndicator }),
        }
      })
    }else{
      setOrderSequence("desc")
      setDetailData({
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
        campaignDetailParameter: {
          campaignHeaderId: PermcampaignHeaderId,
          ...(inputValue.clientFullNameEng && { clientFullNameEng: inputValue.clientFullNameEng }),
          ...(inputValue.clientFullNameChi && { clientFullNameChi: inputValue.clientFullNameChi }),
          ...(inputValue.dateOfBirthFrom && { dateOfBirthFrom: inputValue.dateOfBirthFrom }),
          ...(inputValue.dateOfBirthTo && { dateOfBirthTo: inputValue.dateOfBirthTo }),
          ...(inputValue.firstPolicyIssueDateFrom && { firstPolicyIssueDateFrom: inputValue.firstPolicyIssueDateFrom }),
          ...(inputValue.firstPolicyIssueDateTo && { firstPolicyIssueDateTo: inputValue.firstPolicyIssueDateTo }),
          ...(inputValue.latestIssuedPolicy && { latestIssuedPolicy: inputValue.latestIssuedPolicy }),
          ...(inputValue.servAgentCode && { servAgentCode: inputValue.servAgentCode }),
          ...(inputValue.servAgentName && { servAgentName: inputValue.servAgentName }),
          ...(inputValue.kDollarMembership && { kDollarMembership: inputValue.kDollarMembership }),
          ...(inputValue.redemptionStatus && { redemptionStatus: inputValue.redemptionStatus }),
          ...(inputValue.currentPlanCode && { currentPlanCode: inputValue.currentPlanCode }),
          ...(inputValue.title && { title: inputValue.title }),
          ...(inputValue.existingCustomer && { existingCustomer: inputValue.existingCustomer }),
          ...(inputValue.partyId && { partyId: inputValue.partyId }),
          ...(inputValue.birthdayMonth && { birthdayMonth: inputValue.birthdayMonth }),
          ...(inputValue.mobile && { mobile: inputValue.mobile }),
          ...(inputValue.email && { email: inputValue.email }),
          ...(inputValue.languageForCommunication && { languageForCommunication: inputValue.languageForCommunication }),
          ...(inputValue.communicationChannel && { communicationChannel: inputValue.communicationChannel }),
          ...(inputValue.servAgentEmail && { servAgentEmail: inputValue.servAgentEmail }),
          ...(inputValue.mobileAreaCode && { mobileAreaCode: inputValue.mobileAreaCode }),
          ...(inputValue.picsIndicator && { picsIndicator: inputValue.picsIndicator }),
        }
      })
    }
    
  }


  function exportToExcel(campaignDetailList) {
    let templateMapping;
  
    // Define template mappings based on PermcampaignTemplate
    if (PermcampaignTemplate === "CEE - K Dollar") {
      templateMapping = {
        "Party ID": "partyId",
        "Policyowner name (TC)": "clientFullNameChi",
        "Policyowner name (EN)": "clientFullNameEng",
        "Policyowner Email": "email",
        "Policyowner Mobile": "mobile",
        "Customer Language Preference (TC/SC/EN)": "languageForCommunication",
        "Reference Policy No.": "latestIssuedPolicy",
        "Customer communication (eDM/MMS)": "communicationChannel",
        "K Dollar": "kdollar",
        "K Dollar membership number": "kdollarMembership",
        "Redemption Status": "redemptionStatus",
      };
    } else if (PermcampaignTemplate === "PDD - CI Conversion Campaign") {
      templateMapping = {
        "Policy Number": "latestIssuedPolicy",
        "Current Plan Code": "currentPlanCode",
        "Title": "title",
        "Client Name": "clientFullNameEng",
        "Area Code": "mobileAreaCode",
        "Mobile": "mobile",
        "Email": "email",
        "PICS Status": "picsIndicator",
        "Existing Customer": "existingCustomer",
        "Customer / Party ID": "partyId",
        "Region Code": "servAgentRegion",
        "Agent/Broker Code": "trCode",
        "Agent/Broker Name": "trNameEng",
        "Broker Contact (email)": "servAgentEmail",
      };
    } else if (PermcampaignTemplate === "CEE - Birthday Delight") {
      templateMapping = {
        "Client Name(Eng)": "clientFullNameEng",
        "Client Name(Chi)": "clientFullNameChi",
        "Date of Birth": "dateOfBirth",
        "First Policy Issue Date": "firstPolicyIssueDate",
        "Latest Issued Policy": "latestIssuedPolicy",
        "Broker / Agent Code": "trCode",
        "Company Name": "servAgentName",
        "Agent Name": "trNameEng",
      };
    }
  
    // Map the campaign details based on the template
    const mappedCampaignDetailList = campaignDetailList.map((detail) => {
      const mappedDetail = {};
      for (const title in templateMapping) {
        const column = templateMapping[title];
        if (column === 'dateOfBirth' || column === 'firstPolicyIssueDate') {
          // Format the date values to remove the time portion
          const dateValue = detail[column] ? detail[column].split('T')[0] : '';
          mappedDetail[title] = dateValue;
        } else {
          mappedDetail[title] = detail[column];
        }
      }
      return mappedDetail;
    });
  
    // Create a new worksheet and set column widths
    const worksheet = XLSX.utils.json_to_sheet(mappedCampaignDetailList);
    const columnWidths = Object.keys(templateMapping).map((title) => ({ wch: title.length + 2 }));
    worksheet['!cols'] = columnWidths;
  
    // Customize styles for header row
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: 'CCCCCC' } },
    };
  
    // Apply styles to the header row
    for (let colIndex = 0; colIndex < columnWidths.length; colIndex++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      worksheet[cellRef].s = headerStyle;
    }
  
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaign Details');
  
    // Generate the Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = PermcampaignHeaderName + '.xlsx';
    link.click();
  }

  function onlyExport(){
    fetch(`${API_BASE_URL}/campaign/details`, {
      method: 'POST',
      body: JSON.stringify({
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
          pageSize: 1000000,
          orderBy: Orderby,
          orderSequence: "desc"
        },
        campaignDetailParameter: {
          campaignHeaderId: PermcampaignHeaderId,
          ...(inputValue.clientFullNameEng && { clientFullNameEng: inputValue.clientFullNameEng }),
          ...(inputValue.clientFullNameChi && { clientFullNameChi: inputValue.clientFullNameChi }),
          ...(inputValue.dateOfBirthFrom && { dateOfBirthFrom: inputValue.dateOfBirthFrom }),
          ...(inputValue.dateOfBirthTo && { dateOfBirthTo: inputValue.dateOfBirthTo }),
          ...(inputValue.firstPolicyIssueDateFrom && { firstPolicyIssueDateFrom: inputValue.firstPolicyIssueDateFrom }),
          ...(inputValue.firstPolicyIssueDateTo && { firstPolicyIssueDateTo: inputValue.firstPolicyIssueDateTo }),
          ...(inputValue.latestIssuedPolicy && { latestIssuedPolicy: inputValue.latestIssuedPolicy }),
          ...(inputValue.servAgentCode && { servAgentCode: inputValue.servAgentCode }),
          ...(inputValue.servAgentName && { servAgentName: inputValue.servAgentName }),
          ...(inputValue.kDollarMembership && { kDollarMembership: inputValue.kDollarMembership }),
          ...(inputValue.redemptionStatus && { redemptionStatus: inputValue.redemptionStatus }),
          ...(inputValue.currentPlanCode && { currentPlanCode: inputValue.currentPlanCode }),
          ...(inputValue.title && { title: inputValue.title }),
          ...(inputValue.existingCustomer && { existingCustomer: inputValue.existingCustomer }),
          ...(inputValue.partyId && { partyId: inputValue.partyId }),
          ...(inputValue.birthdayMonth && { birthdayMonth: inputValue.birthdayMonth }),
          ...(inputValue.mobile && { mobile: inputValue.mobile }),
          ...(inputValue.email && { email: inputValue.email }),
          ...(inputValue.languageForCommunication && { languageForCommunication: inputValue.languageForCommunication }),
          ...(inputValue.communicationChannel && { communicationChannel: inputValue.communicationChannel }),
          ...(inputValue.servAgentEmail && { servAgentEmail: inputValue.servAgentEmail }),
          ...(inputValue.mobileAreaCode && { mobileAreaCode: inputValue.mobileAreaCode }),
          ...(inputValue.picsIndicator && { picsIndicator: inputValue.picsIndicator }),
    
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        exportToExcel(data.campaignDetailList);
      });
  }

  const openMobile = () =>{
    setShowModal(true)
  }

  const closeMobile = () => {
    setShowModal(false)
  }


  return (
    <>
    {isMobileScreen ? ( <div className='w-full '>
          <div className=''>
          <h1><a href='/Campaign' className='text-ft-light hover:text-ft'>{PermcampaignHeaderName}</a></h1>
          </div>
          <div className='mt-5 flex'>
            <div className='w-full'> 
            <MultiSelect
        options={PermcampaignTemplate==="PDD - CI Conversion Campaign"?ciOptions:PermcampaignTemplate==="CEE - K Dollar"?kDollarOptions:options}
        value={selected}
        onChange={handleSelect}
        labelledBy={"Select"}
        isCreatable={true}
      />
      {selected.map((option, index) => (
        <div className="mt-2 " key={option.value}>
          <label>{option.label}:</label>
          <div className="flex">
            <input
              className="rounded mr-2"
              type={option.value==="dateOfBirthFrom"||option.value==="dateOfBirthTo"||option.value==="firstPolicyIssueDateFrom"||option.value==="firstPolicyIssueDateTo"?"date":"text"}
              id={`input_${option.value}`}
              defaultValue=""
              onInput={(e) => handleInputChange(option, e.target.value)}
            />
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleCancel({ ...option, index })}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
            </div>
          </div>
       
          <div className='flex mt-4'>
            <a onClick={() => handleCampaignChange(PermcampaignHeaderId,PermcampaignHeaderName, PermcampaignTemplate)} className="text-center w-full bg-ft-light text-white py-3 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft">
              Search
            </a>
          </div>
          <div className='flex mt-3'>
            <a onClick={()=>handleResetChange(PermcampaignHeaderId,PermcampaignHeaderName, PermcampaignTemplate)} className="text-center w-full bg-white text-ft-light ring-ft-light ring-1 py-3 rounded hover:bg-ft hover:text-white active:bg-ft-light active:ring-1 active:ring-ft">
              Reset
            </a>
          </div>



          {showModal ? (
        <>
         <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
              <div className="relative w-5/6 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
               
                    <form className="w-full px-12 my-5 " onSubmit={handleSubmit}>

<div className="flex items-center justify-center w-full">
    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {fileName===""?<><svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to import</span> or drag and drop</p></>
            :
            <>
            <div className={reArrange}>
              <div className="fi-content">{fileExtension}</div>
            </div>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"> {fileName}</p>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to replace</span> or drag and drop</p>
            </>}
            
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleUpload} accept=".xlsx, .xls"/>                </label>
</div> 

<div className='mt-4 text-center'>
{PermcampaignTemplate === "PDD - CI Conversion Campaign" && (
  <a onClick={() => downloadTemplate("PDD_CIConversion_Template.xlsx")} className='text-ft-light cursor-pointer hover:text-ft'>Download PDD - CI Conversion Campaign Template</a>
)}
{PermcampaignTemplate === "CEE - K Dollar" && (
  <a onClick={() => downloadTemplate("CEE_KDollar_Template.xlsx")} className='text-ft-light cursor-pointer hover:text-ft'>Download CEE - K Dollar Template</a>
)}
</div>
<div className='w-auto max-w-96 flex mt-4'>
  <button type='submit' className='w-1/2 mr-5 px-3 py-2 ring-ft-light bg-ft-light text-white rounded ring-1 active:bg-ft active:ring-ft'>Import</button>
  <button type='button' className='w-1/2 rounded px-3 py-2 ring-1 ring-ft-light' onClick={()=> closeMobile()}>
    Cancel
  </button>
</div>
</form>
</div>
</div>
</div>
<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}



          <div className='flex mt-5'>
          {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
            PermcampaignTemplate==="PDD - CI Conversion Campaign"||PermcampaignTemplate==="CEE - K Dollar"?<a onClick={ ()=> openMobile()} className='cursor-pointer w-1/3 mr-2 px-3 py-2 text-center bg-white text-ft-light ring-1 ring-ft-light rounded'>Import</a>:<></>
            :
            <></>
          }
            <a onClick={() => onlyExport()} className='cursor-pointer w-1/3 mr-2 px-3 py-2 text-center text-white bg-ft-light  rounded'>Export</a>
            <a onClick={() => exportToExcel(originCampaign)} className='cursor-pointer w-1/3 mr-2 px-3 py-2 text-center text-white bg-ft-light  rounded'>Export All</a>
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
        {PermcampaignTemplate==="PDD - CI Conversion Campaign"?		      
<table className=" flex w-full bg-white">
          <thead className="sm:w-2/5 w-2/5 text-white">
    {campaigns.map((campaignMobileTitle) => {
      return (
              <tr className="pl-1 bg-ft-light flex flex-col mb-2 border border-slate-300" key={campaignMobileTitle.campaignDetailId}>
            {isXsMobileScreen?
            <><th className='font-normal h-12'>Policy Number</th></>
            :
            <th className='h-6 font-normal'>Policy Number</th>}
             {isXsMobileScreen?
            <><th className='h-12 font-normal'>Current Plan Code</th></>
            :
            <th className='h-6 font-normal'>Current Plan Code</th>}
        {isXsMobileScreen?
            <><th className='h-12 font-normal'>Title</th></>
            :
            <th className='h-6 font-normal'>Title</th>}
        
        {isXsMobileScreen?
            <><th className='h-12 font-normal'>Client Name</th></>
            :
            <th className='h-6 font-normal'>Client Name</th>}
              {isXsMobileScreen?
            <><th className='h-12 font-normal'>Area Code</th></>
            :
            <th className='h-6 font-normal'>Area Code</th>}
              {isXsMobileScreen?
            <><th className='h-12 font-normal'>Mobile</th></>
            :
            <th className='h-6 font-normal'>Mobile</th>}

        {isXsMobileScreen?
            <th className='h-12 truncate font-normal'>Email</th>
            :
            <th className='h-6 font-normal'>Email</th>}
        {isXsMobileScreen?
            <th className='h-12 truncate font-normal'>PICS Status</th>
            :
            <th className='h-6 font-normal'>PICS Status</th>}
                            
                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>Existing Customer</th>
            :
            <th className='h-6 font-normal'>Existing Customer</th>}
                            
                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>Customer / Party ID</th>
            :
            <th className='h-6 font-normal'>Customer / Party ID</th>}
                            
                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>Region Code</th>
            :
            <th className='h-6 font-normal'>Region Code</th>}
                            
                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>Agent/Broker Code</th>
            :
            <th className='h-6 font-normal'>Agent/Broker Code</th>}
                            
                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>Agent/Broker Name</th>
            :
            <th className='h-6 font-normal'>Agent/Broker Name</th>}

                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>Broker Contact (email)</th>
            :
            <th className='h-6 font-normal'>Broker Contact (email)</th>}
        {/* <th className='h-6 font-normal mb-1'>Edit</th> */}
              </tr>
      );})}
          </thead>
          <tbody className="sm:w-3/5 w-3/5 ">
    {campaigns.map((campaignMobileBody) => {
      
        return (
          <tr className="flex flex-col border border-slate-300 mb-2" key={campaignMobileBody.campaignDetailId}>
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 lineclamp2'>{campaignMobileBody.latestIssuedPolicy}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.latestIssuedPolicy}</td>}
            
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.currentPlanCode}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.currentPlanCode}</td>}
            
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.title}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.title}</td>}

    
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.clientFullNameEng}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.clientFullNameEng}</td>}
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.mobileAreaCode}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{      campaignMobileBody.mobileAreaCode}
          </td>}
                                {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.mobile}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.mobile}</td>}
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.email}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.email}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.picsIndicator}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.picsIndicator}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.existingCustomer}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.existingCustomer}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.partyId}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.partyId}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.servAgentRegion}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.servAgentRegion}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.trCode}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.trCode}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.trNameEng}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.trNameEng}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.servAgentEmail}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.servAgentEmail}</td>}

            {/* <td className='pl-3 pr-3 h-6 mb-1'>
              <a href='/EditCampaign' onClick={()=> EditCampaign(campaignMobileBody)}>
                <svg className='campaign h-6' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                </svg>
              </a>
            </td> */}
          </tr>
        );
      })}
          </tbody>
      </table>
  :<></>}
  {PermcampaignTemplate==="CEE - K Dollar"?      
<table className=" flex w-full bg-white">
          <thead className="sm:w-2/5 w-2/5 text-white">
    {campaigns.map((campaignMobileTitle) => {
      return (
              <tr className="pl-1 bg-ft-light flex flex-col mb-2 border border-slate-300" key={campaignMobileTitle.campaignDetailId}>
            {isXsMobileScreen?
            <><th className='font-normal h-12'>Party ID</th></>
            :
            <th className='h-6 font-normal'>Party ID</th>}
             {isXsMobileScreen?
            <><th className='h-12 font-normal'>Policyowner name (TC) </th></>
            :
            <th className='h-6 font-normal'>Policyowner name (TC) </th>}
        {isXsMobileScreen?
            <><th className='h-12 font-normal'>Policyowner name (EN) </th></>
            :
            <th className='h-6 font-normal'>Policyowner name (EN) </th>}
        
        {isXsMobileScreen?
            <><th className='h-12 font-normal'>Policyowner Email</th></>
            :
            <th className='h-6 font-normal'>Policyowner Email</th>}
              {isXsMobileScreen?
            <><th className='h-12 font-normal'>Policyowner Mobile</th></>
            :
            <th className='h-6 font-normal'>Policyowner Mobile</th>}
              {isXsMobileScreen?
            <><th className='h-12 font-normal'>Language Preference</th></>
            :
            <th className='h-6 font-normal'>Customer Language Preference</th>}

        {isXsMobileScreen?
            <th className='h-12 font-normal'>Reference Policy No</th>
            :
            <th className='h-6 font-normal'>Reference Policy No</th>}
        {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>Customer communication </th>
            :
            <th className='h-6 font-normal'>Customer communication</th>}
                            
                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>K Dollar </th>
            :
            <th className='h-6 font-normal'>K Dollar </th>}
                            
                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>K Dollar membership no. </th>
            :
            <th className='h-6 font-normal'>K Dollar membership number </th>}
                            
                            {isXsMobileScreen?
            <th className='h-12 line-camp-2 font-normal'>Redemption Status </th>
            :
            <th className='h-6 font-normal'>Redemption Status </th>}
                            

        {/* <th className='h-6 font-normal mb-1'>Edit</th> */}
              </tr>
      );})}
          </thead>
          <tbody className="sm:w-3/5 w-3/5 ">
    {campaigns.map((campaignMobileBody) => {


        return (
          <tr className="flex flex-col border border-slate-300 mb-2" key={campaignMobileBody.campaignDetailId}>
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 lineclamp2'>{campaignMobileBody.partyId}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.partyId}</td>}
            
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.clientFullNameChi}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.clientFullNameChi}</td>}
            
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.clientFullNameEng}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.clientFullNameEng}</td>}

    
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.email}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.email}</td>}
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.mobile}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{      campaignMobileBody.mobile}
          </td>}
                                {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.languageForCommunication}</td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.languageForCommunication}</td>}
            {isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.latestIssuedPolicy}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.latestIssuedPolicy}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.communicationChannel}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.communicationChannel}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.kdollar}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.kdollar}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.kdollarMembership}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.kdollarMembership}</td>}

{isXsMobileScreen?
            <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.redemptionStatus}</div></td>
            :
            <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.redemptionStatus}</td>}

            {/* <td className='pl-3 pr-3 h-6 mb-1'>
              <a href='/EditCampaign' onClick={()=> EditCampaign(campaignMobileBody)}>
                <svg className='campaign h-6' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                </svg>
              </a>
            </td> */}
          </tr>
        );
      })}
          </tbody>
      </table>
  :<></>}


        {PermcampaignTemplate!=="PDD - CI Conversion Campaign"&&PermcampaignTemplate!=="CEE - K Dollar"?
		      <table className=" flex w-full bg-white">
			      <thead className="sm:w-2/5 w-2/5 text-white">
            {campaigns.map((campaignMobileTitle) => {
              return (
				      <tr className="pl-1 bg-ft-light flex flex-col mb-2 border border-slate-300" key={campaignMobileTitle.campaignDetailId}>
                    {isXsMobileScreen?
                    <><th className='font-normal h-12'>Client Name(Eng)</th></>
                    :
                    <th className='h-6 font-normal'>Client Name(Eng)</th>}
                     {isXsMobileScreen?
                    <><th className='h-12 font-normal'>Client Name(Chi)</th></>
                    :
                    <th className='h-6 font-normal'>Client Name(Chi)</th>}
                {isXsMobileScreen?
                    <><th className='h-12 font-normal'>Date of Birth</th></>
                    :
                    <th className='h-6 font-normal'>Date of Birth</th>}
                
                {isXsMobileScreen?
                    <><th className='h-12 font-normal'>First Policy Issue Date</th></>
                    :
                    <th className='h-6 font-normal'>First Policy Issue Date</th>}
                      {isXsMobileScreen?
                    <><th className='h-12 font-normal'>Latest Issued Policy</th></>
                    :
                    <th className='h-6 font-normal'>Latest Issued Policy</th>}
                      {isXsMobileScreen?
                    <><th className='h-12 font-normal'>Broker / Agent Code</th></>
                    :
                    <th className='h-6 font-normal'>Broker / Agent Code</th>}

                {isXsMobileScreen?
                    <th className='h-12 truncate font-normal'>Company Name</th>
                    :
                    <th className='h-6 font-normal'>Company Name</th>}
                <th className='h-12 font-normal'>Agent Name</th>
                {/* <th className='h-6 font-normal mb-1'>Edit</th> */}
				      </tr>
              );})}
			      </thead>
			      <tbody className="sm:w-3/5 w-3/5 ">
            {campaigns.map((campaignMobileBody) => {
                const dateOfBirth = new Date(campaignMobileBody.dateOfBirth);
                const firstPolicyIssueDate = new Date(campaignMobileBody.firstPolicyIssueDate);
                const formattedDateOfBirth = dateOfBirth.toISOString().slice(0, 10);
                const formattedFirstPolicyIssueDate = firstPolicyIssueDate.toISOString().slice(0, 10);



                return (
                  <tr className="flex flex-col border border-slate-300 mb-2" key={campaignMobileBody.campaignDetailId}>
                    {isXsMobileScreen?
                    <td className='pl-3 pr-3 h-12 lineclamp2'>{campaignMobileBody.clientFullNameEng}</td>
                    :
                    <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.clientFullNameEng}</td>}
                    
                    {isXsMobileScreen?
                    <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.clientFullNameChi}</td>
                    :
                    <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.clientFullNameChi}</td>}
                    
                    {isXsMobileScreen?
                    <td className='pl-3 pr-3 h-12 break-all'>{formattedDateOfBirth}</td>
                    :
                    <td className='pl-3 pr-3 h-6 truncate'>{formattedDateOfBirth}</td>}

            
                    {isXsMobileScreen?
                    <td className='pl-3 pr-3 h-12 break-all'>{formattedFirstPolicyIssueDate}</td>
                    :
                    <td className='pl-3 pr-3 h-6 truncate'>{formattedFirstPolicyIssueDate}</td>}
                    {isXsMobileScreen?
                    <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.latestIssuedPolicy}</td>
                    :
                    <td className='pl-3 pr-3 h-6 truncate'>{      campaignMobileBody.latestIssuedPolicy}
                  </td>}
                                        {isXsMobileScreen?
                    <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.servAgentCode}</td>
                    :
                    <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.servAgentCode}</td>}
                    {isXsMobileScreen?
                    <td className='pl-3 pr-3 h-12'><div className='lineclamp2 '>{campaignMobileBody.trNameEng}</div></td>
                    :
                    <td className='pl-3 pr-3 h-6 truncate'>{campaignMobileBody.trNameEng}</td>}
                    <td className='pl-3 pr-3 h-12 break-all'>{campaignMobileBody.servAgentName}</td>
                    {/* <td className='pl-3 pr-3 h-6 mb-1'>
                      <a href='/EditCampaign' onClick={()=> EditCampaign(campaignMobileBody)}>
                        <svg className='campaign h-6' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                        </svg>
                      </a>
                    </td> */}
                  </tr>
                );
              })}
			      </tbody>
		      </table>:
          <></>}
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
          <h1><a href='/Campaign' className='text-ft-light hover:text-ft'>{PermcampaignHeaderName}</a></h1>
          </div>
         
        </div>
   
        <div className='w-full flex justify-center mb-4'>
        <div className="w-2/3 mr-5">
        <div>
      <MultiSelect
        options={PermcampaignTemplate==="PDD - CI Conversion Campaign"?ciOptions:PermcampaignTemplate==="CEE - K Dollar"?kDollarOptions:options}
        value={selected}
        onChange={handleSelect}
        labelledBy={"Select"}
        isCreatable={true}
      />
      {selected.map((option, index) => (
        <div className="mt-2 " key={option.value}>
          <label>{option.label}:</label>
          <div className="flex">
            <input
              className="rounded mr-2"
              type={option.value==="dateOfBirthFrom"||option.value==="dateOfBirthTo"||option.value==="firstPolicyIssueDateFrom"||option.value==="firstPolicyIssueDateTo"?"date":"text"}
              id={`input_${option.value}`}
              defaultValue=""
              onInput={(e) => handleInputChange(option, e.target.value)}
            />
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleCancel({ ...option, index })}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
        </div>
        <div className="w-1/3 flex flex-col justify-between mt-2">
        
          <div className='h-1/2 flex'> 
          <div className='mr-5'>
            <a onClick={() => handleCampaignChange(PermcampaignHeaderId,PermcampaignHeaderName, PermcampaignTemplate)} className="bg-ft-light text-white px-3 py-2 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft cursor-pointer">
              Search
            </a>
          </div>
          <div className=''>
            <a onClick={()=>handleResetChange(PermcampaignHeaderId,PermcampaignHeaderName, PermcampaignTemplate)} className="bg-white text-ft-light ring-ft-light ring-1 px-3 py-2 rounded hover:bg-ft hover:text-white active:bg-ft-light active:ring-1 active:ring-ft cursor-pointer">
              Reset
            </a>
          </div>
          </div>
        </div>
        </div>
        <div className='mt-5 flex justify-between'>
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
          <div>
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} ariaHideApp={false}>
          <form className="w-full px-12" onSubmit={handleSubmit}>

            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {fileName===""?<><svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to import</span> or drag and drop</p></>
                        :
                        <>
                        <div className={reArrange}>
                          <div className="fi-content">{fileExtension}</div>
                        </div>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"> {fileName}</p>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to replace</span> or drag and drop</p>
                        </>}
                        
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleUpload} accept=".xlsx, .xls"/>                </label>
            </div> 

            <div className='mt-4 text-center'>
            {PermcampaignTemplate === "PDD - CI Conversion Campaign" && (
              <a onClick={() => downloadTemplate("PDD_CIConversion_Template.xlsx")} className='text-ft-light cursor-pointer hover:text-ft'>Download PDD - CI Conversion Campaign Template</a>
            )}
            {PermcampaignTemplate === "CEE - K Dollar" && (
              <a onClick={() => downloadTemplate("CEE_KDollar_Template.xlsx")} className='text-ft-light cursor-pointer hover:text-ft'>Download CEE - K Dollar Template</a>
            )}
            </div>
            <div className='w-auto max-w-96 flex mt-4'>
              <button type='submit' className='w-1/2 mr-5 px-3 py-2 ring-ft-light bg-ft-light text-white rounded ring-1 active:bg-ft active:ring-ft'>Import</button>
              <button type='button' className='w-1/2 rounded px-3 py-2 ring-1 ring-ft-light' onClick={closeModal}>
                Cancel
              </button>
          </div>
          </form>
          </Modal>
          {props.userInformation.role==="internal-admin"||props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?
            PermcampaignTemplate==="PDD - CI Conversion Campaign"||PermcampaignTemplate==="CEE - K Dollar"?<a onClick={openModal} className='cursor-pointer mr-2 px-3 py-2 bg-white text-ft-light ring-1 ring-ft-light rounded'>Import</a>:<></>
            :
            <></>
          }
            <a onClick={() => onlyExport()} className='mr-2 px-3 py-2 text-white bg-ft-light  rounded cursor-pointer'>Export</a>
            <a onClick={() => exportToExcel(originCampaign)} className='mr-2 px-3 py-2 text-white bg-ft-light rounded cursor-pointer'>Export All</a>
          </div>
        </div>
        <div className='w-table flex '>
        <div className='overflow-x w-full '>
        {PermcampaignTemplate==="PDD - CI Conversion Campaign"? <table className='table-fixed overflow-scroll w-full block'>
            <thead>
                <tr className='border border-slate-300 '>
                <th className=' hover:text-ft-light cursor-pointer pl-5 h-8' onClick={()=> handleOrder("latestIssuedPolicy")}>
                <div className='inline-block h-6 w-56'>
                Policy Number
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
                </div>
              </th>
          
            <th className=' hover:text-ft-light cursor-pointer h-8 ' onClick={()=> handleOrder("currentPlanCode")}>
            <div className='inline-block h-6 w-48'>
            Current Plan Code
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("title")}>
            <div className='inline-block h-6 w-56'>
            Title
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("clientFullNameEng")}>
            <div className='inline-block h-6 w-56'>
            Client Name
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("mobileAreaCode")}>
            <div className='inline-block h-6 w-48'>
            Area Code
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("mobile")}>
            <div className='inline-block h-6 w-44'>
            Mobile
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("email")}>
            <div className='inline-block h-6 w-44'>
            Email
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("picsIndicator")}>
            <div className='inline-block h-6 w-44'>
            PICS Status
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("existingCustomer")}>
            <div className='inline-block h-6 w-44'>
            Existing Customer
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("partyId")}>
            <div className='inline-block h-6 w-44'>
            Customer / Party ID
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("servAgentRegion")}>
            <div className='inline-block h-6 w-44'>
            Region Code
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("trCode")}>
            <div className='inline-block h-6 w-44'>
            Agent/Broker Code
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("trNameEng")}>
            <div className='inline-block h-6 w-44'>
            Agent/Broker Name
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("servAgentEmail")}>
            <div className='inline-block h-6 w-48'>
            Broker Contact (email)
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            {/* <th className=' h-8'>
              <div className='inline-block h-6 w-16'>
                Edit
                 </div>
            </th> */}
           
                </tr>
            </thead>
            <tbody className='text-left '>
            {campaigns.map((campaign) => {
                return (
                  <tr className="border border-slate-300 h-16" key={campaign.campaignDetailId}>
                    <td className=''><div className='w-52 lineclamp2 pl-5 items-center'>{campaign.latestIssuedPolicy}</div></td>
                    <td className=''><div className='w-48 break-all  items-center align-middle' >{campaign.currentPlanCode}</div></td>
                    <td className=''>{campaign.title}</td>
                    <td className=''>{campaign.clientFullNameEng}</td>
                    <td className=''>{campaign.mobileAreaCode}</td>
                    <td className=''>{campaign.mobile}</td>
                    <td className=''>{campaign.email}</td>
                    <td className=''>{campaign.picsIndicator}</td>
                    <td className=''>{campaign.existingCustomer}</td>
                    <td className=''>{campaign.partyId}</td>
                    <td className=''>{campaign.servAgentRegion}</td>
                    <td className=''>{campaign.trCode}</td>
                    <td className=''>{campaign.trNameEng}</td>
                    <td className=''>{campaign.servAgentEmail}</td>

                    {/* <td className=''>
                      <a href='/EditCampaign' onClick={()=> EditCampaign(campaign)}>
                        <svg className='campaign h-8' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                        </svg>
                      </a>
                    </td> */}
                  </tr>
                );
              })}
              
              </tbody>
        </table>:<></>}
        {PermcampaignTemplate==="CEE - K Dollar"? <table className='table-fixed overflow-scroll w-full block'>
            <thead>
                <tr className='border border-slate-300 '>
                <th className=' hover:text-ft-light cursor-pointer pl-5 h-8' onClick={()=> handleOrder("partyId")}>
                <div className='inline-block h-6 w-56'>
                Party ID
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
                </div>
              </th>
          
            <th className=' hover:text-ft-light cursor-pointer h-8 ' onClick={()=> handleOrder("clientFullNameChi")}>
            <div className='inline-block h-6 w-56'>
              Policyowner name (TC) 
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("clientFullNameEng")}>
            <div className='inline-block h-6 w-56'>
              Policyowner name (EN) 
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("email")}>
            <div className='inline-block h-6 w-56'>
              Policyowner Email
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("mobile")}>
            <div className='inline-block h-6 w-48'>
            Policyowner Mobile
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("languageForCommunication")}>
            <div className='inline-block h-6 w-56'>
            Customer Language Preference (TC/SC/EN) 
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("latestIssuedPolicy")}>
            <div className='inline-block h-6 w-44'>
            Reference Policy No
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("communicationChannel")}>
            <div className='inline-block h-6 w-56'>
            Customer communication (eDM/MMS) 
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("kDollar")}>
            <div className='inline-block h-6 w-44'>
            K Dollar 
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("kDollarMembership")}>
            <div className='inline-block h-6 w-64'>
            K Dollar membership number 
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("redemptionStatus")}>
            <div className='inline-block h-6 w-44'>
            Redemption Status 
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
          
           
                </tr>
            </thead>
            <tbody className='text-left '>
            {campaigns.map((campaign) => {
                return (
                  <tr className="border border-slate-300 h-16" key={campaign.campaignDetailId}>
                    <td className=''><div className='w-52 lineclamp2 pl-5 items-center'>{campaign.partyId}</div></td>
                    <td className=''><div className=''>{campaign.clientFullNameChi}</div></td>
                    <td className=''><div className='w-48 break-all  items-center align-middle' >{campaign.clientFullNameEng}</div></td>
                    <td className=''>{campaign.email}</td>
                    <td className=''>{campaign.mobile}</td>
                    <td className=''>{campaign.languageForCommunication}</td>
                    <td className=''>{campaign.latestIssuedPolicy}</td>
                    <td className=''>{campaign.communicationChannel}</td>
                    <td className=''>{campaign.kdollar}</td>
                    <td className=''>{campaign.kdollarMembership}</td>
                    <td className=''>{campaign.redemptionStatus}</td>


                    {/* <td className=''>
                      <a href='/EditCampaign' onClick={()=> EditCampaign(campaign)}>
                        <svg className='campaign h-8' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                        </svg>
                      </a>
                    </td> */}
                  </tr>
                );
              })}
              
              </tbody>
        </table>:<></>}
          {PermcampaignTemplate!=="PDD - CI Conversion Campaign"&&PermcampaignTemplate!=="CEE - K Dollar"? <table className='table-fixed overflow-scroll w-full block'>
            <thead>
                <tr className='border border-slate-300 '>
                <th className=' hover:text-ft-light cursor-pointer pl-5 h-8' onClick={()=> handleOrder("clientFullNameEng")}>
                <div className='inline-block h-6 w-56'>
                Client Name(Eng)
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
                </div>
              </th>
            <th className=' hover:text-ft-light cursor-pointer h-8 ' onClick={()=> handleOrder("clientFullNameChi")}>
            <div className='inline-block h-6 w-52'>Client Name(Chi)
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8 ' onClick={()=> handleOrder("dateOfBirth")}>
            <div className='inline-block h-6 w-48'>
            Date of Birth
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("firstPolicyIssueDate")}>
            <div className='inline-block h-6 w-56'>
            First Policy Issue Date
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("latestIssuedPolicy")}>
            <div className='inline-block h-6 w-56'>
            Latest Issued Policy
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("trCode")}>
            <div className='inline-block h-6 w-48'>
            Broker / Agent Code
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("servAgentName")}>
            <div className='inline-block h-6 w-44'>
              Company Name
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            <th className=' hover:text-ft-light cursor-pointer h-8' onClick={()=> handleOrder("trNameEng")}>
            <div className='inline-block h-6 w-44'>
            Agent Name
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="inline-block w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
              </svg>
              </div>
            </th>
            
            {/* <th className=' h-8'>
              <div className='inline-block h-6 w-16'>
                Edit
                 </div>
            </th> */}
           
                </tr>
            </thead>
            <tbody className='text-left '>
            {campaigns.map((campaign) => {
                const dateOfBirth = new Date(campaign.dateOfBirth);
                const firstPolicyIssueDate = new Date(campaign.firstPolicyIssueDate);
                const formattedDateOfBirth = dateOfBirth.toISOString().slice(0, 10);
                const formattedFirstPolicyIssueDate = firstPolicyIssueDate.toISOString().slice(0, 10);

                if(campaign.remark === "NULL"){
                  campaign.remark = '';
                }

                if(campaign.thumbnailDocID === 0){
                  campaign.thumbnailDocID = '';
                }

                return (
                  <tr className="border border-slate-300 h-16" key={campaign.campaignDetailId}>
                    <td className=''><div className='w-52 lineclamp2 pl-5 items-center'>{campaign.clientFullNameEng}</div></td>
                    <td className=''><div className='w-48 break-all  items-center align-middle' >{campaign.clientFullNameChi}</div></td>
                    <td className=''>{formattedDateOfBirth}</td>
                    <td className=''>{formattedFirstPolicyIssueDate}</td>
                    <td className=''>{campaign.latestIssuedPolicy}</td>
                    <td className=''>{campaign.trCode}</td>
                    <td className=''><div data-tooltip-target="tooltip-default" className='w-40 lineclamp2'>{campaign.servAgentName}</div></td>
                    <td className=''>{campaign.trNameEng}</td>
                    {/* <td className=''>
                      <a href='/EditCampaign' onClick={()=> EditCampaign(campaign)}>
                        <svg className='campaign h-8' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                        </svg>
                      </a>
                    </td> */}
                  </tr>
                );
              })}
              
              </tbody>
        </table>:<></>}
       
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

export default CampaignDetailList;