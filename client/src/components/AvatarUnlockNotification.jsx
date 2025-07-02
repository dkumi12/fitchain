import { useEffect, useState } from 'react';
import AvatarDisplay from './AvatarDisplay';

export default function AvatarUnlockNotification({ avatar, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!avatar) return null;

  return (
    <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-50 ${
      show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-purple-500 max-w-sm">
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold text-white mb-2">Avatar Unlocked!</h3>
          
          <div className="flex justify-center mb-4">
            <AvatarDisplay
              avatarId={avatar.id}
              size="lg"
              showFrame={false}
              className="animate-unlock"
            />
          </div>
          
          <p className="text-lg font-semibold text-purple-400 mb-1">{avatar.name}</p>
          <p className="text-sm text-gray-400">{avatar.description}</p>
          
          <button
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 300);
            }}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}