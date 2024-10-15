import React, { useState, useEffect } from 'react';
import { useThreads, useUser } from '@liveblocks/react';
import { Composer, Thread } from '@liveblocks/react-ui';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { getCurrentUser, getMentionSuggestions } from '@/lib/userUtils';

const CommentSection = () => {
  const [openComment, setOpenComment] = useState(false);
  const { threads } = useThreads();
  const { user } = useUser();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered. User:', user);
    const fetchCurrentUser = async () => {
      if (user) {
        console.log('Fetching current user data for:', user.id);
        try {
          const userData = await getCurrentUser(user.id);
          console.log('Fetched user data:', userData);
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      } else {
        console.log('No user data available from useUser hook');
      }
    };

    fetchCurrentUser();
  }, [user]);

  const toggleComment = () => setOpenComment(prev => !prev);

  console.log('Render: Current user state:', currentUser);
  console.log('Render: Liveblocks user:', user);

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Button
        onClick={toggleComment}
        className="rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
      >
        {openComment ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      {openComment && (
        <div className="absolute bottom-16 right-0 h-[350px] w-[300px] overflow-auto rounded-lg bg-white p-4 shadow-xl">
          {threads?.map(thread => (
            <Thread key={thread.id} thread={thread} />
          ))}
          <Composer
            mentionSuggestions={getMentionSuggestions}
            currentUser={currentUser}
          >
            {({ canSubmit, submit, isSubmitting }) => {
              console.log('Composer render. CurrentUser:', currentUser, 'CanSubmit:', canSubmit, 'IsSubmitting:', isSubmitting);
              return (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Submitting comment. CurrentUser:', currentUser);
                  submit();
                }}>
                  <Composer.Content />
                  <Composer.Mention />
                  <Button 
                    type="submit" 
                    disabled={!canSubmit}
                    className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Reply
                  </Button>
                </form>
              );
            }}
          </Composer>
        </div>
      )}
    </div>
  );
};

export default CommentSection;