/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable-next-line react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../api.config.js';
import { useNavigate } from "react-router-dom";

function Category({reloadCounter}) {
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const navigate  = useNavigate();
  const handleSubNavigate = (selectedSubCategory) => {
    navigate("/DocCenter", { state:{selectedSubCategory} });
  };
  const handleNavigate = (selectedCategory) => {
    navigate("/DocCenter", { state:{selectedCategory} });
  };

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
    handleNavigate(selectedMainCategoryId);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryChange = (event) => {
    const selectedSubCategoryId = event.target.value;
    setSelectedSubCategory(selectedSubCategoryId);
    handleSubNavigate(selectedSubCategoryId);
  };

  const subCategoryOptions = selectedMainCategory
    ? mainCategories.find(category => category.categoryId === selectedMainCategory)?.secondLevelCategoryList
    : null;

    useEffect(()=>{
      setSelectedMainCategory(null);
      handleNavigate(null);
      setSelectedSubCategory(null);
      handleSubNavigate(null);
    },[reloadCounter]);

  return (
    <>
      <div className="mt-2 w-1/2 mr-4">
        <label>Category:</label><br></br>
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
        <div className="mt-2 w-1/2">
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
    </>
  );
}

export default Category;