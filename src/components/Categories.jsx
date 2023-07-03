/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import '../css/campaignListcss.css';
import '../css/lineclamp2css.css';
import { API_BASE_URL } from '../api.config';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { useNavigate} from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';


function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryEnglish, setCategoryEnglish] = useState('');
  const [categoryZHTW, setCategoryZHTW] = useState('');
  const [categoryZHCN, setCategoryZHCN] = useState('');
  const [isMobileScreen, setIsMobileScreen] = useState(((window.innerWidth <= 1250)?true:false));
//   const [categoryId, setCategoryId] = useState('');
  const [upperCategoryId, setUpperCategoryId] = useState('');
  const [categoryId, setCategoryId] = useState('');

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
    fetch(`${API_BASE_URL}/document-center/category/list`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setCategories(data.firstLevelCategoryList);
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
    setCategoryEnglish(data.categoryEnglish);
    setCategoryZHCN(data.categoryZHCN);
    setCategoryZHTW(data.categoryZHTW);
    setUpperCategoryId(data.upperCategoryId);
    setCategoryId(data.categoryId);
    setEditIsOpen(true);
  };

  const closeEdit = () => {
    setEditIsOpen(false);
    setCategoryEnglish("");
    setCategoryZHCN("");
    setCategoryZHTW("");
    setUpperCategoryId("");
    setCategoryId("");
  };

  const showEditMobile = (data) => {
    setCategoryEnglish(data.categoryEnglish);
    setCategoryZHCN(data.categoryZHCN);
    setCategoryZHTW(data.categoryZHTW);
    setUpperCategoryId(data.upperCategoryId);
    setCategoryId(data.categoryId);
    setShowEditModal(true);
  };

  const closeEditMobile = () => {
    setShowEditModal(false);
    setCategoryEnglish("");
    setCategoryZHCN("");
    setCategoryZHTW("");
    setUpperCategoryId("");
    setCategoryId("");
  };

  
  const showCreateMobile = () =>{
    setShowModal(true)
  }

  const closeCreateMobile = () =>{
    setShowModal(false)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`${API_BASE_URL}/document-center/category`, {
      method: 'POST',
      body: JSON.stringify({

        documentCenterCategoryParameter: {
            upperCategoryId: 0,
            categoryEnglish: categoryEnglish,
            categoryZHTW:categoryZHTW,
            categoryZHCN:categoryZHCN,
          }
      }),
    }
    );
  
    // Handle response
    if (response.ok) {
      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Created Category',
        showConfirmButton: false,
        timer: 1700
      }).then(function() {
        window.location = "/Categories";
      });
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/document-center/category`, {
      method: 'POST',
      body: JSON.stringify({

        documentCenterCategoryParameter: {
            categoryId:categoryId,
            upperCategoryId: upperCategoryId,
            categoryEnglish: categoryEnglish,
            categoryZHTW:categoryZHTW,
            categoryZHCN:categoryZHCN,
          }
      }),
    }

    );
  
    // Handle response
    if (response.ok) {
      closeEdit();
      Swal.fire({
        icon: 'success',
        title: 'Edited Category',
        showConfirmButton: false,
        timer: 1700
      }).then(function() {
        window.location = "/Categories";
      });
    }
  }
  
  const customStyles = {
    content: {
      width: 'auto',
      maxWidth:'650px',
      height: '425px',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
  };

  const navigate = useNavigate();

  const ViewSub = (mainCategoryId,mainCategoryEnglish) => {
    navigate('/SubCategories',{state:{mainCategoryId,mainCategoryEnglish}});
  }



  return (
    <>
{isMobileScreen ?
(<>
<div className='w-full '>
  <div className=''>
    <h1>Main Categories</h1>
  </div>
             <div className='mt-4 flex'>
             <a onClick={()=> showCreateMobile()} className='bg-ft-light text-center w-full text-white py-3 rounded hover:bg-ft active:bg-white active:text-ft active:ring-1 active:ring-ft'>
              Create
             </a>
           </div>
        

{showModal ? (
        <>
         <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
              <div className="relative w-5/6 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-5">
               
              <form onSubmit={handleSubmit}>
          <div className='w-link'>
            <div className=''>
                <div className='mt-3'>
                <label htmlFor='categoryEnglish'>Category</label>
                <input
                    type='text'
                    id='categoryEnglish'
                    value={categoryEnglish}
                    className='w-full ring-ft-light focus:border-0 border-gray-500'
                    required
                    onChange={(e) => setCategoryEnglish(e.target.value)}
                />
                </div>
                <div className='mt-3'>
                <label htmlFor='categoryZHTW'>Category(Trad Chi)</label>
                <input
                    type='text'
                    id='categoryZHTW'
                    value={categoryZHTW}
                    className='w-full ring-ft-light focus:border-0 border-gray-500'
                    required
                    onChange={(e) => setCategoryZHTW(e.target.value)}
                />
                </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='categoryZHCN'>Category(Simp Chi)</label>
              <input
                type='text'
                id='categoryZHCN'
                value={categoryZHCN}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setCategoryZHCN(e.target.value)}
              />
            </div>
          </div>
          <div className='w-auto max-w-96 flex mt-4'>
            <button type='submit' className='w-1/2 mr-5 px-3 py-2 ring-ft-light bg-ft-light text-white rounded ring-1 active:bg-ft active:ring-ft'>Create</button>
            <button type='button' className='w-1/2 rounded px-3 py-2 ring-1 ring-ft-light' onClick={()=> closeCreateMobile()}>
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

{showEditModal ? (
        <>
         <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
              <div className="relative w-5/6 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-5">
               
              <form onSubmit={handleEdit}>
        <div className='w-link '>
            <div className=''>
            <div className='mt-3'>
                
                <label htmlFor='categoryEnglish'>Category</label>
                <input
                    type='text'
                    id='categoryEnglish'
                    value={categoryEnglish}
                    className='w-full ring-ft-light focus:border-0 border-gray-500'
                    required
                    onChange={(e) => setCategoryEnglish(e.target.value)}
                />
                </div>
                <div className='mt-3'>
                <label htmlFor='categoryZHTW'>Category(Trad Chi)</label>
                <input
                    type='text'
                    id='categoryZHTW'
                    value={categoryZHTW}
                    className='w-full ring-ft-light focus:border-0 border-gray-500'
                    required
                    onChange={(e) => setCategoryZHTW(e.target.value)}
                />
                </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='categoryZHCN'>Category(Simp Chi)</label>
              <input
                type='text'
                id='categoryZHCN'
                value={categoryZHCN}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setCategoryZHCN(e.target.value)}
              />
            </div>
          </div>
          <div className='w-auto max-w-96 flex mt-4'>
            <button type='submit' className='w-1/2 mr-5 px-3 py-2 ring-ft-light bg-ft-light text-white rounded ring-1 active:bg-ft active:ring-ft'>Save</button>
            <button type='button' className='w-1/2 rounded px-3 py-2 ring-1 ring-ft-light' onClick={()=> closeEditMobile()}>
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
<div className="flex">
  <table className=" flex w-full bg-white">
    <thead className="sm:w-1/5 w-2/5 text-white">
    {categories || categories.length !== 0 ?categories.map((campaignMobileHead) => {
        return (
      <tr className="pl-1 bg-ft-light flex flex-col mb-2 border border-slate-300" key={campaignMobileHead.categoryId}>

            <th className='h-12 font-normal'>Main Category</th>
            <th className='h-12 font-normal'>Main Category(Trad Chi)</th>
      
        <th className='h-12 font-normal'>Main Category(Simp Chi)</th>
        <th className='h-8 font-normal'>Edit</th>
      </tr>

        );}):""}
       
    
    
    </thead>
    <tbody className="sm:w-4/5 w-3/5 ">
    {categories.map((cat) => {
    
        return (
          <tr className="flex flex-col border border-slate-300 mb-2" key={cat.categoryId}>
          
                 
            <td className='pl-3 pr-3 h-12'><a onClick={()=> ViewSub(cat.categoryId,cat.categoryEnglish)} className='text-ft-light hover:text-ft '>{cat.categoryEnglish}</a></td>
            <td className='pl-3 pr-3 h-12'>{cat.categoryZHTW}</td>
            <td className='pl-3 pr-3 h-12'>{cat.categoryZHCN}</td>


<td className='pl-3 pr-3 h-8'>
            <a onClick={() => showEditMobile(cat)}>
                <svg className='campaign h-6' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                </svg>
            </a>
              
            </td>


            
           
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

<ScrollToTopButton />
</div>
</>):(
      <div className='w-deflaut px-2'>
        <div className='flex justify-content-between align-items-center my-3'>
          <div className=''>
            <h1>Main Categories</h1>
          </div>
          <div onClick={openModal}>
          <a href='#EnableJavascript' className={'text-white bg-ft-light rounded px-3 py-2'}>
            Create
          </a>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} ariaHideApp={false}>
        <form onSubmit={handleSubmit}>
          <div className='w-link'>
            <div className=''>
                <div className='mt-3'>
                <label htmlFor='categoryEnglish'>Category</label>
                <input
                    type='text'
                    id='categoryEnglish'
                    value={categoryEnglish}
                    className='w-full ring-ft-light focus:border-0 border-gray-500'
                    required
                    onChange={(e) => setCategoryEnglish(e.target.value)}
                />
                </div>
                <div className='mt-3'>
                <label htmlFor='categoryZHTW'>Category(Trad Chi)</label>
                <input
                    type='text'
                    id='categoryZHTW'
                    value={categoryZHTW}
                    className='w-full ring-ft-light focus:border-0 border-gray-500'
                    required
                    onChange={(e) => setCategoryZHTW(e.target.value)}
                />
                </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='categoryZHCN'>Category(Simp Chi)</label>
              <input
                type='text'
                id='categoryZHCN'
                value={categoryZHCN}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setCategoryZHCN(e.target.value)}
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
        <div className='w-link '>
            <div className=''>
            <div className='mt-3'>
                
                <label htmlFor='categoryEnglish'>Category</label>
                <input
                    type='text'
                    id='categoryEnglish'
                    value={categoryEnglish}
                    className='w-full ring-ft-light focus:border-0 border-gray-500'
                    required
                    onChange={(e) => setCategoryEnglish(e.target.value)}
                />
                </div>
                <div className='mt-3'>
                <label htmlFor='categoryZHTW'>Category(Trad Chi)</label>
                <input
                    type='text'
                    id='categoryZHTW'
                    value={categoryZHTW}
                    className='w-full ring-ft-light focus:border-0 border-gray-500'
                    required
                    onChange={(e) => setCategoryZHTW(e.target.value)}
                />
                </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='categoryZHCN'>Category(Simp Chi)</label>
              <input
                type='text'
                id='categoryZHCN'
                value={categoryZHCN}
                className='w-full ring-ft-light focus:border-0 border-gray-500'
                required
                onChange={(e) => setCategoryZHCN(e.target.value)}
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
                <div className='inline-block h-6 w-categories'>
                Main Category
                </div>
              </th>
              <th className='  h-8 '>
            <div className='inline-block h-6 w-categories'>
            Main Category(Trad Chi)
  
              </div>
            </th>
            <th className='  h-8 '>
            <div className='inline-block h-6 w-categories'>
            Main Category(Simp Chi)
  
              </div>
            </th>
          
            <th className=' h-8'>
              <div className='inline-block h-6 w-linkEdit'>
                Edit
                 </div>
            </th>
           
                </tr>
            </thead>
            <tbody className='text-left'>
            
            {categories.map((cat) =>(
                   
                    <tr className="border border-slate-300 h-16" key={cat.categoryId}>
                    <td className=''><div className='w-comAns truncate pl-5 items-center cursor-pointer'><a onClick={()=> ViewSub(cat.categoryId,cat.categoryEnglish)} className='text-ft-light hover:text-ft '>{cat.categoryEnglish}</a></div></td>
                    <td className=''><div className='w-comAns truncate items-center align-middle' >{cat.categoryZHTW}</div></td>
                    <td className=''><div className='w-linkres truncate items-center align-middle' >{cat.categoryZHCN}</div></td>
              

                    <td className=''>
                    <a href='#EnableJavascript' onClick={() => openEdit(cat)}>
                        <svg className='campaign h-8' fill="none"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                        </svg>
                    </a>
                    
                    </td>
                   
                </tr>)
                )}
              </tbody>
        </table>
        </div>
        </div>
  </div>)}
            </>
  )}

export default Categories;