import React from "react";

const ToggleSwitch = (props: {
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isEnabled, setIsEnabled } = props;
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="flex items-center justify-center">
      <label htmlFor="toggle" className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            id="toggle"
            type="checkbox"
            className="sr-only"
            onChange={toggleSwitch}
            checked={isEnabled}
          />
          <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div
            className={`dot absolute w-6 h-6  rounded-full shadow -left-1 -top-1 transition ${
              isEnabled ? "transform translate-x-full bg-primary" : "bg-melon"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
