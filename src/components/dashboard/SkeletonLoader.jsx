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
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-10 bg-gray-700 rounded-md w-full pl-10 pr-4 animate-pulse"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-10 h-10 bg-gray-700 rounded-md animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>

      <div className={`grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
        {items.map((_, index) => (
          <SkeletonItem key={index} isListLayout={layout === 'list'} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;