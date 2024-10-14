import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomeSection = ({ user, onCreateWorkspace }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-black to-purple-700 py-16"
  >
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="text-center sm:text-left">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Welcome, {user?.fullName}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-indigo-100 max-w-2xl"
          >
            Manage your workspaces seamlessly. Keep everything organized and accessible in one place.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
        
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default WelcomeSection;
