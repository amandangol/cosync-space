import React from 'react';
import { Loader } from 'lucide-react';

const WorkspaceSkeleton = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <div className="h-8 w-3/4 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-700 rounded"></div>
            <div className="h-8 w-32 bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Last saved date skeleton */}
            <div className="h-6 w-32 bg-gray-700 rounded"></div>
            {/* Action buttons skeleton */}
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-8 bg-gray-700 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Document Content */}
        {/* <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto my-8 p-8 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
              <div className="h-8 w-3/4 bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
        {/* Loading Overlay */}
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>

      {/* Comment Section Skeleton */}
      <div className="w-80 bg-gray-800 p-4 border-l border-gray-700 hidden md:block">
        <div className="h-8 w-3/4 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default WorkspaceSkeleton;