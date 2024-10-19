import React, { useState, useEffect, useCallback } from 'react';
import { useThreads, useUser } from '@liveblocks/react';
import { Composer, Thread } from '@liveblocks/react-ui';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { getMentionSuggestions, getUsersFromFirestore } from '@/lib/firebaseUserUtils';
import { motion, AnimatePresence } from 'framer-motion';

const CommentSidebar = ({ currentUser }) => {
  const [openComment, setOpenComment] = useState(false);
  const { threads } = useThreads();
  const { user } = useUser();
  const [users, setUsers] = useState({});

  const fetchUsers = useCallback(async (userIds) => {
    if (userIds.length > 0) {
      try {
        console.log('Fetching users for IDs:', userIds);
        const fetchedUsers = await getUsersFromFirestore(userIds);
        console.log('Fetched users:', fetchedUsers);
        const newUsersObject = fetchedUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setUsers(prevUsers => {
          const updatedUsers = {...prevUsers, ...newUsersObject};
          console.log('Updated users state:', updatedUsers);
          return updatedUsers;
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (threads) {
      console.log('Threads updated:', threads);
      const userIds = threads.flatMap(thread => 
        thread.comments.map(comment => comment.userId)
      );
      console.log('User IDs from threads:', userIds);
      const uniqueUserIds = [...new Set(userIds)];
      const missingUserIds = uniqueUserIds.filter(id => !users[id]);
      if (missingUserIds.length > 0) {
        console.log('Fetching missing user IDs:', missingUserIds);
        fetchUsers(missingUserIds);
      }
    }
  }, [threads, users, fetchUsers]);

  const toggleComment = () => setOpenComment(prev => !prev);

  const renderUsername = (userId) => {
    console.log('Rendering username for userId:', userId);
    console.log('Current users state:', users);
    const user = users[userId];
    return user ? user.name : userId;
  };

  const renderUser = useCallback((userId) => {
    console.log('Rendering user for userId:', userId);
    const user = users[userId];
    return (
      <div className="flex items-center">
        <img 
          src={user?.avatar || '/default-avatar.png'} 
          alt={renderUsername(userId)} 
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="text-gray-300">{renderUsername(userId)}</span>
      </div>
    );
  }, [users]);

  return (
    <>
      <div className="fixed top-8 right-6 z-10">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={toggleComment}
            className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={openComment ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                {openComment ? <X size={24} /> : <MessageCircle size={24} />}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
      <AnimatePresence>
        {openComment && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[350px] bg-gray-900 shadow-xl flex flex-col overflow-hidden border-l border-gray-700"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-grow overflow-auto p-4"
            >
              {threads?.map(thread => (
                <Thread 
                  key={thread.id} 
                  thread={thread}
                  renderUser={renderUser}
                />
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gray-800 border-t border-gray-700"
            >
              <Composer
                mentionSuggestions={getMentionSuggestions}
                currentUser={currentUser}
              >
                {({ canSubmit, submit, isSubmitting }) => (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}>
                    <Composer.Content />
                    <Composer.Mention />
                    <Button 
                      type="submit" 
                      disabled={!canSubmit}
                      className="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400"
                    >
                      {isSubmitting ? 'Sending...' : 'Reply'}
                    </Button>
                  </form>
                )}
              </Composer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommentSidebar;