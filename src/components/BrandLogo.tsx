import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const imgSize = size === 'sm' ? 'w-9 h-9' : size === 'md' ? 'w-12 h-12' : 'w-20 h-20';
  const titleSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${imgSize} rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-amber-300 shadow-sm shrink-0 overflow-hidden flex items-center justify-center`}>
        <img
          src="/src/assets/images/eagle_logo_crest_1793507620161.jpg"
          alt="Eagle Women's Ride Multan Golden Crest"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight ${titleSize} bg-gradient-to-r from-pink-700 via-rose-600 to-amber-700 bg-clip-text text-transparent`}>
            EAGLE WOMEN'S RIDE
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            MULTAN
          </span>
        </div>

        {showTagline && (
          <p className="text-xs font-medium text-pink-900/80 tracking-wide mt-0.5">
            "Her Journey, Her Freedom, Her Safety."
          </p>
        )}
      </div>
    </div>
  );
};
