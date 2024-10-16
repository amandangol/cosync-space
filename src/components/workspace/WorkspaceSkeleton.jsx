import React from 'react';
import { Loader } from 'lucide-react';

const WorkspaceSkeleton = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>

        {/* Document Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    </div>
  );
};

export default WorkspaceSkeleton;