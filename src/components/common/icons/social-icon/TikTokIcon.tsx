import React from 'react';

const TikTokIcon = ({ className = "" }: { className?: string }) => {
  return (
    <img 
      width="30" 
      height="30" 
      src="https://img.icons8.com/ios-glyphs/30/tiktok.png" 
      alt="tiktok"
      className={className}
    />
  );
};

export default TikTokIcon;
