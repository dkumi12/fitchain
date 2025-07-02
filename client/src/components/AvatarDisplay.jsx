import { fitnessAvatars, getUserFrame } from '../data/avatars';

export default function AvatarDisplay({ 
  avatarId, 
  size = 'md', 
  userData = {}, 
  showFrame = true,
  isLocked = false,
  onClick,
  className = ''
}) {
  // Find the avatar
  const allAvatars = [...fitnessAvatars.default, ...fitnessAvatars.unlockable];
  const avatar = allAvatars.find(a => a.id === avatarId) || fitnessAvatars.default[0];
  
  // Get frame
  const frame = showFrame ? getUserFrame(userData) : null;
  
  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-32 h-32 text-6xl',
    xl: 'w-40 h-40 text-7xl'
  };
  
  return (
    <div
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          font-bold
          transition-all duration-300
          ${frame && showFrame ? frame.style : ''}
          ${avatar.special ? 'animate-pulse' : ''}
          ${isLocked ? 'grayscale opacity-50' : ''}
          ${onClick ? 'hover:scale-110' : ''}
        `}
        style={{
          background: isLocked 
            ? 'linear-gradient(135deg, #374151 0%, #1F2937 100%)'
            : `linear-gradient(135deg, ${avatar.colors[0]} 0%, ${avatar.colors[1]} 100%)`,
          boxShadow: avatar.special && !isLocked ? '0 0 20px rgba(255,255,255,0.3)' : undefined
        }}
      >
        <span className={isLocked ? 'blur-sm' : ''}>
          {avatar.emoji}
        </span>
      </div>
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
      )}
      
      {avatar.legendary && !isLocked && (
        <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">
          ✨
        </div>
      )}
    </div>
  );
}