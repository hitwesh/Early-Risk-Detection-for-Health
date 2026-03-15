import { useEffect, useRef, useState } from "react";

const CustomDropdown = ({ value, onChange, options, placeholder, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        id={id}
        type="button"
        className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-100"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || placeholder}
      </button>
      <div
        className={`absolute z-50 mt-1 w-full origin-top rounded-lg border border-slate-200 bg-white shadow-lg transition duration-150 ease-out ${
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        {options.map((option) => {
          const isSelected = option === value;
          return (
            <div
              key={option}
              className={`cursor-pointer px-3 py-2 text-sm transition duration-150 ${
                isSelected
                  ? "bg-teal-100 text-teal-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-teal-700"
              }`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={isSelected}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomDropdown;
