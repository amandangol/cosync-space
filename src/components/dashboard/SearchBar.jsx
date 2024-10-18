import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, handleSearch, sortBy, setSortBy }) => (
  <div className="flex items-center space-x-4 w-full sm:w-auto">
    <input
      type="text"
      placeholder="Search workspaces..."
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full sm:w-64 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
    />
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="name">Name</option>
      <option value="createdAt">Created At</option>
    </select>
  </div>
);

export default SearchBar;