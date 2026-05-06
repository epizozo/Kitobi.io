import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ title, description, icon: Icon, color, children }) => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl bg-app-fg/5 flex items-center justify-center", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-app-fg uppercase font-display tracking-tight">{title}</h2>
          <p className="text-sm text-app-muted font-medium">{description}</p>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};
