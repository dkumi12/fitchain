import { Link } from 'react-router-dom';

export function Logo({ variant = 'full', className = '' }) {
  // Check for PNG first, fallback to SVG
  const logoSrc = variant === 'icon' 
    ? '/images/logo-icon.png' 
    : '/images/logo.png';
  
  const svgSrc = variant === 'icon'
    ? '/images/logo-icon.svg'
    : '/images/logo.svg';
    
  const width = variant === 'icon' ? '50' : '200';
  const height = variant === 'icon' ? '50' : '60';
  
  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="FitChain Logo"
        width={width}
        height={height}
        className="h-auto"
        onError={(e) => {
          // Fallback to SVG if PNG doesn't exist
          e.target.src = svgSrc;
        }}
      />
    </Link>
  );
}

export function TextLogo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10">
        <img
          src="/images/logo-icon.png"
          alt="FitChain Icon"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-2xl font-bold">
        <span className="text-[#22a6b3]">Fit</span>
        <span className="text-[#f97316]">Chain</span>
      </span>
    </Link>
  );
}
