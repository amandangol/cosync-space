import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Plus } from 'lucide-react';

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="mt-12 text-center"
  >
    <Briefcase className="mx-auto h-16 w-16 text-gray-400" />
    <h2 className="mt-4 text-2xl font-semibold text-gray-900">No workspaces found</h2>
    <p className="mt-2 text-gray-600">Get started by creating your first workspace</p>
    <Link href="/syncspace-create">
      <button className="mt-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
        <Plus className="mr-2 inline-block h-5 w-5" />
        Create Workspace
      </button>
    </Link>
  </motion.div>
);

export default EmptyState;