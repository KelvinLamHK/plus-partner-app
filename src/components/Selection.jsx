import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

function Selection() {
  const options = [
    { label: "Client Name(Eng)", value: "clientFullNameEng" },
    { label: "Client Name(Chi)", value: "clientFullNameChi" },
    { label: "Date of Birth", value: "dateOfBirth" },
    { label: "First Policy Issue Date", value: "firstPolicyIssueDate" },
    { label: "Latest Issued Policy", value: "latestIssuedPolicy" },
    { label: "Broker / Agent Code", value: "servAgentCode" },
    { label: "Company Name", value: "servAgentName" },
    { label: "Agent Name", value: "clientId" },
  ];

  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [inputs, setInputs] = useState(options.map((option) => ({ value: "" })));

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
    const newInputs = [...inputs];
    const index = options.findIndex((o) => o.value === option.value);
    newInputs[index].value = value;
    setInputs(newInputs);

    const inputValue = options.reduce((acc, cur) => {
      const inputIndex = options.findIndex((o) => o.value === cur.value);
      acc[cur.value] = newInputs[inputIndex].value.trim() === "" ? "" : newInputs[inputIndex].value || null;
      return acc;
    }, {});
    navigate("/CampaignDetail", { state: { inputValue } });
  }, 500);

  return (
    <div>
      <MultiSelect
        options={options}
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
              type="text"
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
  );
}

export default Selection;