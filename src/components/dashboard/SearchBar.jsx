import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, handleSearch, sortBy, setSortBy }) => (
  <div className="flex items-center space-x-4 w-full sm:w-auto">
    <input
      type="text"
      placeholder="Search workspaces..."
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="lastUpdated">Last Updated</option>
      <option value="name">Name</option>
      <option value="createdAt">Created At</option>
    </select>
  </div>
);

export default SearchBar;