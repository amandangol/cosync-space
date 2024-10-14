import React from 'react';

// Simple Footer component
const Footer = ({ year = new Date().getFullYear() }) => (
  <footer className="bg-gray-900 py-12">
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm text-gray-400">&copy; {year} SyncSpace. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
