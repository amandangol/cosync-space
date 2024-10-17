import React from 'react';

const SkeletonLoader = ({ layout }) => {
  const items = Array(8).fill(null);
  return (
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          : 'space-y-4'
      }
    >
      {items.map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-lg bg-gray-200 ${
            layout === 'grid' ? 'aspect-video' : 'h-24'
          }`}
        >
          <div className="h-full w-full bg-gray-300 rounded-lg" />
          {layout === 'list' && (
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
