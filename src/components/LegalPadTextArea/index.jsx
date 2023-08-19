import { useState, useRef } from "react";

import Button from "../Button";

const LegalpadTextarea = () => {
  const [textValue, setTextValue] = useState("");
  const textareaRef = useRef(null);

  return (
    <div className="flex justify-around">
      <textarea
        className="p-3 bg-yellow-200 border border-gray-400 rounded-lg w-full h-48 resize-none"
        ref={textareaRef}
        value={textValue}
        onChange={e => setTextValue(e.target.value)}
        placeholder="Start typing here..."
      />
      <Button
        style={"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"}
      >
        Save as PNG
      </Button>
    </div>
  );
};

export default LegalpadTextarea;
