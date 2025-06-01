import React from 'react';

const ScreenshotViewer = ({ src }) => {
  return <img src={src} alt="Screenshot" className="screenshot" />;
};

export default ScreenshotViewer;