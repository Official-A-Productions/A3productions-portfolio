import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import MetallicPaint from './MetallicPaint';

interface MetallicButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function MetallicButton({ to = '/contact', onClick, children, className = '' }: MetallicButtonProps) {
  // A simple black square SVG to fill the container. The rounded-full class will crop it.
  const solidBlackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iYmxhY2siLz48L3N2Zz4=';

  const innerContent = (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ scale: '1.2' }}>
        <MetallicPaint
          imageSrc={solidBlackImage}
          liquid={0.75}
          speed={0.4}
          brightness={1.5}
          contrast={0.8}
          lightColor="#ffffff"
          darkColor="#222222"
          tintColor="#ffffff"
          blur={0.01}
        />
      </div>
      <div className="relative z-10 flex items-center gap-2">
        <span>{children}</span>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
          <ArrowUpRight size={12} />
        </span>
      </div>
    </>
  );

  const baseClasses = `group relative inline-flex items-center justify-center bg-black text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 text-xs font-semibold tracking-wider uppercase overflow-hidden ${className}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        {innerContent}
      </button>
    );
  }

  return (
    <Link to={to} className={baseClasses}>
      {innerContent}
    </Link>
  );
}
