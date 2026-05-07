import React from 'react';

const ThreadsIcon = ({ className = "" }: { className?: string }) => {
  return (
    <img 
      width="50" 
      height="50" 
      src="https://img.icons8.com/ios-filled/50/threads.png" 
      alt="threads"
      className={className}
    />
  );
};

export default ThreadsIcon;
