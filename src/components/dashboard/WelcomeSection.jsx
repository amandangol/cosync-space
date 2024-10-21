import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase } from 'lucide-react';

const WelcomeSection = ({ user, workspaceCount }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-gray-900 via-purple-900 to-violet-800 py-16 relative overflow-hidden"
  >
    <div className="relative w-full max-w mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:max-w-2xl w-full"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Welcome back,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              {user?.fullName}!
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-6 leading-relaxed">
          Elevate your team's collaboration and skyrocket productivity with this intuitive platform. 
          Your digital workspace awaits!
          </p>
          <div className="flex items-center space-x-4 text-base sm:text-lg text-indigo-200">
            <User size={24} />
            <span>Account: <strong>{user?.primaryEmailAddress?.emailAddress}</strong></span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-2xl w-full lg:w-auto"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Workspace Overview</h3>
          <div className="flex items-center space-x-4 text-lg sm:text-xl text-indigo-100">
            <Briefcase size={28} />
            <span>
            You have{' '}
            <span className="font-bold text-2xl text-cyan-400">{workspaceCount}</span>{' '}
            active workspace{workspaceCount !== 1 ? 's' : ''}
          </span>
          </div>
          {workspaceCount === 0 ? (
            <p className="mt-4 text-sm sm:text-base text-indigo-200">
              Create a new one to get started
            </p>
          ) : (
            <p className="mt-4 text-sm sm:text-base text-indigo-200">
              Each workspace is a hub for your projects, tasks, and team collaboration.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default WelcomeSection;