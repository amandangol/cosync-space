import React from 'react';
import { motion } from 'framer-motion';

const WelcomeSection = ({ user, onCreateWorkspace, workspaceCount }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-black to-purple-700 py-16 py-16 relative overflow-hidden"
  >
    <div className="absolute inset-0 opacity-20">
      {/* Optional Background Animation or Illustration */}
      <div className="bg-pattern w-full h-full"></div>
    </div>
    <div className="relative w-full px-4 sm:px-6 lg:px-8 z-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="text-center sm:text-left">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Welcome, {user?.fullName}!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-indigo-100 max-w-2xl mb-4"
          >
        Streamline collaboration and boost productivity with our intuitive platform.
        </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-sm text-gray-200 mb-4"
          >
            You have <span className="font-semibold">{workspaceCount}</span> workspaces to manage.
          </motion.div>
          {/* <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onClick={onCreateWorkspace}
            className="mt-4 px-6 py-2 bg-white text-purple-700 rounded-full shadow-md hover:bg-gray-100"
          >
            Create New Workspace
          </motion.button> */}
        </div>
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 sm:mt-0"
        >
         
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700">Your Progress</h3>
            <p className="text-gray-500">Tasks Completed: <span className="font-bold">42</span></p>
            <p className="text-gray-500">Projects Active: <span className="font-bold">8</span></p>
          </div>
        </motion.div> */}
      </div>
    </div>
  </motion.div>
);

export default WelcomeSection;
