import React, { useState, useEffect } from 'react';
import { useThreads, useUser } from '@liveblocks/react';
import { Composer, Thread } from '@liveblocks/react-ui';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { getCurrentUser, getMentionSuggestions } from '@/lib/firebaseUserUtils';
import { motion, AnimatePresence } from 'framer-motion';

const CommentSection = () => {
  const [openComment, setOpenComment] = useState(false);
  const { threads } = useThreads();
  const { user } = useUser();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (user) {
        try {
          const userData = await getCurrentUser(user.id);
          if (userData) {
            setCurrentUser({
              ...userData,
              name: userData.name || userData.email.split('@')[0],
            });
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      }
    };

    fetchCurrentUser();
  }, [user]);

  const toggleComment = () => setOpenComment(prev => !prev);

  return (
    <>
      <div className="fixed top-8 right-6 z-10"> 
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={toggleComment}
            className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
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
            className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl flex flex-col overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-grow overflow-auto p-4"
            >
              {threads?.map(thread => (
                <Thread key={thread.id} thread={thread} />
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gray-50 border-t"
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
                      className="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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

export default CommentSection;
