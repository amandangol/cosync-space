import React from 'react';

const extractTextFromBody = (body) => {
  if (body.content && Array.isArray(body.content)) {
    return body.content
      .map((node) => {
        if (node.type === 'paragraph' && Array.isArray(node.children)) {
          return node.children.map(child => child.text).join('');
        }
        return '';
      })
      .join('\n'); // Join paragraphs with a newline
  }
  return ''; // Fallback if the structure is unexpected
};

const CustomThread = ({ thread, users }) => {
  return (
    <div className="thread bg-white rounded-lg shadow-sm mb-4 p-4">
      {thread.comments.length === 0 ? (
        <p className="text-gray-500">No comments available</p>
      ) : (
        thread.comments.map((comment) => {
          const user = users[comment.userId] || { name: 'Unknown User', avatar: null };

          return (
            <div key={comment.id} className="comment mb-4 last:mb-0">
              <div className="user-info flex items-center mb-2">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="avatar w-8 h-8 rounded-full mr-2" />
                ) : (
                  <div className="avatar w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2">
                    {user.name[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="username font-semibold text-sm">{user.name}</span>
                </div>
              </div>
              <div className="comment-content mt-2 text-sm text-gray-700">
                {typeof comment.body === 'object' ? (
                  <p>{extractTextFromBody(comment.body)}</p>
                ) : (
                  <p>{comment.body}</p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CustomThread;
