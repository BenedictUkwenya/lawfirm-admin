'use client';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
};

const Header = ({ onMenuClick, isSidebarOpen }: HeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 md:hidden p-4 border-b border-slate-200">
      <button onClick={onMenuClick} className="text-slate-700">
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};

export default Header