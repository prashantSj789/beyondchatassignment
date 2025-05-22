'use client';

import { HomeIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const menuItems = [
    { icon: <HomeIcon className="h-6 w-6" />, label: 'Home' },
    { icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />, label: 'Inbox' },
    { icon: <Cog6ToothIcon className="h-6 w-6" />, label: 'Settings' },
  ];

  return (
    <aside className="w-20 bg-gray-800 text-white flex flex-col items-center py-4 space-y-6">
      {menuItems.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center cursor-pointer hover:text-indigo-400">
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
