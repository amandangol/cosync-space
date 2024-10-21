import React from 'react';
import { Grid, ListIcon, Search, ChevronDown } from 'lucide-react';

const SkeletonLoader = ({ layout }) => {
  const items = Array(8).fill(null);

  const SkeletonItem = ({ isListLayout }) => (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-4 ${isListLayout ? 'flex items-center' : ''}`}>
      <div className={`${isListLayout ? 'w-16 h-16' : 'w-full h-40'} bg-gray-600 rounded-md mb-4 animate-pulse`}></div>
      <div className={isListLayout ? 'ml-4 flex-grow' : ''}>
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
      </div>
      {isListLayout && (
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className={`grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {items.map((_, index) => (
          <SkeletonItem key={index} isListLayout={layout === 'list'} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;