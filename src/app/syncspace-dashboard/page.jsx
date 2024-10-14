import React from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import Footer from '@/components/common/Footer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen max-w-screen bg-gray-50">
      <Dashboard />
      <Footer  />
    </div>
  );
}