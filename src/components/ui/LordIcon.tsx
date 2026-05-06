import React from 'react';

interface LordIconProps {
  src: string;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'refresh' | 'boomerang';
  delay?: number;
  colors?: string;
  size?: number;
  className?: string;
}

export const LordIcon: React.FC<LordIconProps> = ({
  src,
  trigger = 'hover',
  delay,
  colors = 'primary:#f97316,secondary:#ffffff',
  size = 32,
  className
}) => {
  const LordIconElement = 'lord-icon' as any;
  return (
    <div className={className} style={{ width: size, height: size }}>
      <LordIconElement
        src={src}
        trigger={trigger}
        colors={colors}
        delay={delay}
        style={{ width: size, height: size }}
      />
    </div>
  );
};
