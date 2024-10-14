import React, { useState } from 'react';

const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full mb-2 w-32 rounded bg-gray-800 text-white text-sm p-2 text-center shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export  {Tooltip};
