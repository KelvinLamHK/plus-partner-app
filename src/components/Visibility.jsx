/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import {API_BASE_URL} from '../api.config.js';
import { useNavigate } from "react-router-dom";

function Visibility({reloadCounter}) {
const navigate  = useNavigate();
const [options, setOptions] = useState([]);

useEffect(() => {
  fetch(`${API_BASE_URL}/broker/list`, {
    method: 'POST',
    body: JSON.stringify()
  })
    .then(response => response.json())
    .then(data => {
      const formattedOptions = data.map(broker => ({
        label: `${broker.brokerName}(${broker.brokerCode})`,
        value: broker.brokerCode
      }));
      setOptions(formattedOptions);
    });
}, []);

  const handleNavigate = (selectedOption) => {
    navigate("/DocCenter", { state:{selectedOption} });
  };

  const [selected, setSelected] = useState([]);

  const handleSelect = (selected) => {
    setSelected(selected);
    handleNavigate(selected);
  };

  useEffect(()=>{
    handleSelect([]);
  },[reloadCounter]);

  return (
    <div className="mt-3">
        <label>Visibility:</label>
      <MultiSelect
        options={options}
        value={selected}
        onChange={handleSelect}
        labelledBy={"Select"}
        isCreatable={true}
      />
     
    </div>
  );
}

export default Visibility;
