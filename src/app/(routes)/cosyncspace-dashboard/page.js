import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';

export default function DashboardPage() {
  return (
    <div className="min-h-screen max-w-screen bg-gray-50">
      <Header />
      <Dashboard />
      <Footer  />
    </div>
  );
}