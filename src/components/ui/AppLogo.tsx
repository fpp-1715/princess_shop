import React from 'react';
import AppIcon from './AppIcon';

export default function AppLogo({ size = 64, className = "" }: any) {
  return (
    <div className={`flex items-center ${className}`}>
      <AppIcon name="SparklesIcon" size={size} className="text-primary flex-shrink-0" />
    </div>
  );
}