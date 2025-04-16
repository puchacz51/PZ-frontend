import React, { useEffect, useRef } from 'react';

interface NewBadgeProps {
  className?: string;
  pulseEffect?: boolean; 
}

const NewBadge: React.FC<NewBadgeProps> = ({ 
  className = "", 
  pulseEffect = true 
}) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (badgeRef.current) {
      const parent = badgeRef.current.parentElement;
      if (parent) {
        const computedStyle = window.getComputedStyle(parent);
        if (computedStyle.position === 'static') {
          parent.style.position = 'relative';
        }
      }
    }
  }, []);

  return (
    <div
      ref={badgeRef}
      className={`absolute -top-2 -right-2 z-10 flex items-center justify-center ${className}`}
    >
      <div className={`bg-gradient-to-r from-slate-700 to-slate-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg transform rotate-3 
        ${pulseEffect ? 'animate-pulse' : ''}`}
      >
        NEW
      </div>
    </div>
  );
};

export default NewBadge;
