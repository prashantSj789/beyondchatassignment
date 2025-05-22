'use client';

import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <div className="flex items-center space-x-4">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="outline-none border-none text-sm"
        />
      </div>
      <div className="flex items-center space-x-4">
        <BellIcon className="h-6 w-6 text-gray-600" />
        <img
          src="/avatar.png"
          alt="User Avatar"
          className="h-8 w-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
