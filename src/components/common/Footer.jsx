import React from 'react';

const Footer = ({ year = new Date().getFullYear() }) => (
  <footer className="bg-gradient-to-t from-gray-900 to-black text-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <p className="text-center text-gray-400">
          © {year} CoSyncSpace. All rights reserved.
        </p>
        <div className="mt-4 flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            Terms of Service
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;