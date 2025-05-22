'use client';

const ChatWindow = () => {
  return (
    <div className="flex-1 p-6 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Chat messages would go here */}
        <p className="text-gray-600">Select a conversation to view messages.</p>
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default ChatWindow;
