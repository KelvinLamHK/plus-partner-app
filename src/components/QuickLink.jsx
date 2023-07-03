import { useState, useEffect } from 'react';
import '../css/campaignListcss.css';
import '../css/lineclamp2css.css';
import { API_BASE_URL } from '../api.config';
import Modal from 'react-modal';
import Swal from 'sweetalert2';


function QuickLink(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [urlName, setUrlName] = useState('');
  const [urlTraName, setUrlTraName] = useState('');
  const [urlSimpName, setUrlSimpName] = useState('');
  const [url, setUrl] = useState('');
  const [Link, setLink] = useState([]);
  const [linkId, setLinkId] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/cms/links`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setLink(data);
      })
      .catch(error => console.error(error));
  }, []);
  

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openEdit = (data) => {
    setUrlSimpName(data.linkSimName)
    setUrlTraName(data.linkChiName)
    setUrlName(data.linkEngName);
    setUrl(data.url);
    setLinkId(data.linkId)
    setEditIsOpen(true);
  };

  const closeEdit = () => {
    setEditIsOpen(false);
    setUrlSimpName('')
    setUrlTraName('')
    setUrlName('');
    setUrlName('');
    setUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/cms/link`, {
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
          role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
        },
          linkParameter: {
            url: url,
            linkEngName: urlName,
            linkChiName:urlTraName,
            linkSimName:urlSimpName,
            status:"new"
          }
      }),
    }

    );
  
    // Handle response
    if (response.ok) {
      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Created link',
        showConfirmButton: false,
        timer: 1700
      }).then(function() {
        window.location = "/QuickLinks";
      });
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/cms/link`, {
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
          role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
        },
          linkParameter: {
            linkId: linkId,
            url: url,
            linkEngName: urlName,
            linkChiName:urlTraName,
            linkSimName:urlSimpName,
            status:"edit"
          }
      }),
    }

    );
  
    // Handle response
    if (response.ok) {
      closeEdit();
      Swal.fire({
        icon: 'success',
        title: 'Edited link',
        showConfirmButton: false,
        timer: 1700
      }).then(function() {
        window.location = "/QuickLinks";
      });
    }
  }
  
  const customStyles = {
    content: {
      width: 'auto',
      maxWidth:'600px',
      height: '450px',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
  };

  const handleDelete = async (linkId) => {
    // Show a confirmation dialog before deleting the URL
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure to delete the URL?',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // set confirm button color to red
      confirmButtonText: 'Delete'
    });
  
    // Check if the user clicked the delete button
    if (result.isConfirmed) {
      const response = await fetch(`${API_BASE_URL}/cms/link`, {
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
            role: (props.userInformation.role==="pdd-admin"||props.userInformation.role==="cee-admin"?"internal-admin":props.userInformation.role) ?? ""
          },
          linkParameter: {
            linkId: linkId,
            status: "delete"
          }
        }),
      });
      // Handle response
      if (response.ok) {
        // Reload the page to show the updated list of links
        window.location.reload();
      } else {
        // Handle error
        console.error("Error deleting link");
      }
    }
  }

  return (
    <>

      <div className='w-deflaut px-2'>
        <div className='flex justify-content-between align-items-center my-3'>
          <div className=''>
            <h1>Quick Links</h1>
            <p className=''>*At most 15 links can be added</p>
          </div>
          <div onClick={Link.length<=14?openModal:closeModal}>
          <a href='#EnableJavascript' className={Link.length<=14?('text-white bg-ft-light rounded px-3 py-2'):('pointer-events-none text-white text-decoration-none bg-gray-500 rounded px-3 py-2')}>
            Create
          </a>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} ariaHideApp={false}>
        <form onSubmit={handleSubmit}>
          <div className='w-auto flex-col'>
            <div className=''>
              <label htmlFor='urlName'>URL name (Eng):</label>
              <input
                type='text'
                id='urlName'
                value={urlName}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setUrlName(e.target.value)}
              />
            </div>
            <div className='mt-3'>
              <label htmlFor='urlTraName'>URL name (Trad Chi):</label>
              <input
                type='text'
                id='urlTraName'
                value={urlTraName}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setUrlTraName(e.target.value)}
              />
            </div>
            <div className='mt-3'>
              <label htmlFor='urlSimpName'>URL name (Simp Chi):</label>
              <input
                type='text'
                id='urlSimpName'
                value={urlSimpName}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setUrlSimpName(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="url">URL:</label>
              <input
                type="text"
                id="url"
                value={url || "https://"}
                className="w-full ring-ft-light focus:border-0"
                required
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const combinedValue = inputValue.startsWith("https://")
                    ? inputValue
                    : `https://${inputValue}`;
                  setUrl(combinedValue);
                }}
              />
            </div>
          </div>
          <div className='w-auto max-w-96 flex mt-4'>
            <button type='submit' className='w-1/2 mr-5 px-3 py-2 ring-ft-light bg-ft-light text-white rounded ring-1 active:bg-ft active:ring-ft'>Create</button>
            <button type='button' className='w-1/2 rounded px-3 py-2 ring-1 ring-ft-light' onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={editIsOpen} onRequestClose={closeEdit} style={customStyles} ariaHideApp={false}>
        <form onSubmit={handleEdit}>
          <div className='w-auto flex-col'>
            <div className=''>
              <label htmlFor='urlName'>URL name (Eng):</label>
              <input
                type='text'
                id='urlName'
                value={urlName}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setUrlName(e.target.value)}
              />
            </div>
            <div className='mt-3'>
              <label htmlFor='urlTraName'>URL name (Trad Chi):</label>
              <input
                type='text'
                id='urlTraName'
                value={urlTraName}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setUrlTraName(e.target.value)}
              />
            </div>
            <div className='mt-3'>
              <label htmlFor='urlSimpName'>URL name (Simp Chi):</label>
              <input
                type='text'
                id='urlSimpName'
                value={urlSimpName}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setUrlSimpName(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="url">URL:</label>
              <input
                type="text"
                id="url"
                value={url || "https://"}
                className="w-full ring-ft-light focus:border-0"
                required
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const combinedValue = inputValue.startsWith("https://")
                    ? inputValue
                    : `https://${inputValue}`;
                  setUrl(combinedValue);
                }}
              />
            </div>
          </div>
          <div className='w-auto max-w-96 flex mt-4'>
            <button type='submit' className='w-1/2 mr-5 px-3 py-2 ring-ft-light bg-ft-light text-white rounded ring-1 active:bg-ft active:ring-ft'>Save</button>
            <button type='button' className='w-1/2 rounded px-3 py-2 ring-1 ring-ft-light' onClick={closeEdit}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
        </div>
        <div className='p-2 flex align-middle justify-center'>
          <div className=''>
        <table className='w-full block'>
            <thead>
                <tr className='border border-slate-300 '>
                <th className='  pl-5 h-8' >
                <div className='inline-block h-6 w-linkRes'>
                URL name(Eng)
                </div>
              </th>
              <th className='  pl-5 h-8' >
                <div className='inline-block h-6 w-linkRes'>
                URL name(Trad Chi)
                </div>
              </th>
              <th className='  pl-5 h-8' >
                <div className='inline-block h-6 w-linkRes'>
                URL name(Simp Chi)
                </div>
              </th>
            <th className='  h-8 '>
            <div className='inline-block h-6 w-url'>
            URL
  
              </div>
            </th>
            <th className=' h-8'>
              <div className='inline-block h-6 w-linkEdit'>
                Edit
                 </div>
            </th>
            <th className=' h-8'>
              <div className='inline-block h-6 w-linkEdit mr-3'>
                Delete
                 </div>
            </th>
                </tr>
            </thead>
            <tbody className='text-left'>
            
            {Link.map((campaign) => (
                <tr className="border border-slate-300 h-16" key={campaign.linkId}>
                  <td className=''><div className='w-linkRes truncate pl-5 items-center'>{campaign.linkEngName}</div></td>
                  <td className=''><div className='w-linkRes truncate pl-5 items-center'>{campaign.linkChiName}</div></td>
                  <td className=''><div className='w-linkRes truncate pl-5 items-center'>{campaign.linkSimName}</div></td>
                  <td className=''><div className='w-url truncate items-center align-middle' >{campaign.url}</div></td>
                  <td className=''>
                    <a href='#EnableJavascript' onClick={() => openEdit(campaign)}>
                      <svg className='campaign h-8' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                      </svg>
                    </a>
                    
                  </td>
                  <td className='relative'>
                <a href='#EnableJavascript' onClick={() => handleDelete(campaign.linkId)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#009188" className="w-6 h-6 absolute top-1/2 transform -translate-y-1/2 right-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </a>
              </td>
            </tr>
))}
              </tbody>
        </table>
        </div>
        </div>
  </div>
            </>
  )}

export default QuickLink;