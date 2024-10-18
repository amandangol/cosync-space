import React from 'react';


const SkeletonLoader = ({ layout }) => {
  const items = Array(8).fill(null);
  return (
    <div className={`grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
      {items.map((_, index) => (
        <div key={index} className={`bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-4 ${layout === 'list' ? 'flex items-center' : ''}`}>
          <div className={`${layout === 'list' ? 'w-16 h-16' : 'w-full h-40'} bg-gray-600 rounded-md mb-4 animate-pulse`}></div>
          <div className={layout === 'list' ? 'ml-4 flex-grow' : ''}>
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
          </div>
          {layout === 'list' && (
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      ))}
      
  
    </div>
  );
};

export default SkeletonLoader;