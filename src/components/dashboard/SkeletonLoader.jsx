import React from 'react';

const SkeletonLoader = ({ layout }) => {
  const items = Array(8).fill(null);
  return (
    <div className={layout === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'space-y-4'}>
      {items.map((_, index) => (
        <div key={index} className={`animate-pulse rounded-lg bg-white ${layout === 'grid' ? 'aspect-[4/3]' : 'h-24'}`}>
          <div className="h-full w-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;