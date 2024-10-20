import React, { useState, useEffect, useCallback } from 'react';
import { useThreads, useUser } from '@liveblocks/react';
import { Composer, Thread } from '@liveblocks/react-ui';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getMentionSuggestions, getUsersFromFirestore } from '@/lib/firebaseUserUtils';
import { motion } from 'framer-motion';

const CommentSidebar = ({ currentUser, toggleCommentSidebar }) => {
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
    <div className="h-full flex flex-col bg-gray-900 shadow-xl border-l border-gray-700">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Comments</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCommentSidebar}
          className="text-gray-300 hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-grow overflow-auto p-4">
        {threads?.map(thread => (
          <Thread 
            key={thread.id} 
            thread={thread}
            renderUser={renderUser}
          />
        ))}
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
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
      </div>
    </div>
  );
};

export default CommentSidebar;