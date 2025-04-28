
import React from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="outline">Dashboard</Button>
            <div className="h-8 w-8 rounded-full bg-stellar-accent text-white flex items-center justify-center font-medium">
              T
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
