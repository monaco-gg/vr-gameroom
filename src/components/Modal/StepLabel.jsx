import React from "react";

const StepLabel = ({ currentStep, totalSteps, text, Icon }) => {
    return (
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <Icon size={24} layout="fixed"/>
          <span className="text-gray-400">
            {typeof text === "string" ? text : React.cloneElement(text)}
          </span>
        </div>
        {totalSteps > 1 && (
        <div className="flex items-center mr-8">
          {[...Array(totalSteps).keys()].map((step) => (
            <span
              key={step}
              className={`h-2 w-2 rounded-full ${
                currentStep === step + 1 ? "bg-blue-500" : "bg-gray-600"
              } ml-1`}
            />
          ))}
        </div>
      )}
      </div>
    );
  };

  export default StepLabel;
  