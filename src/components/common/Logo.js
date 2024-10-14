import React from 'react';

const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="url(#logo-gradient)" />
      <path d="M12 20L20 12L28 20L20 28L12 20Z" stroke="white" strokeWidth="2" />
      <circle cx="20" cy="20" r="4" fill="white" />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333EA" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );

export default Logo;
