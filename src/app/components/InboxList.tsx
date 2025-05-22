'use client';

const conversations = [
  { id: 1, name: 'Alice Johnson', message: 'Hi, I need help with my order.' },
  { id: 2, name: 'Bob Smith', message: 'Can you assist me with billing?' },
  // Add more dummy data as needed
];

const InboxList = () => {
  return (
    <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
      {conversations.map((conv) => (
        <div key={conv.id} className="p-4 hover:bg-gray-100 cursor-pointer">
          <h4 className="font-semibold">{conv.name}</h4>
          <p className="text-sm text-gray-600 truncate">{conv.message}</p>
        </div>
      ))}
    </div>
  );
};

export default InboxList;
