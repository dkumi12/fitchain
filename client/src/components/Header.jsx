import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Logo, TextLogo } from './Logo';

export default function Header() {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Use Logo component - it will show SVG placeholder or your actual logo */}
          <Logo />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
