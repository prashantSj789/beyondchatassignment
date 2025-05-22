'use client';
import { useState, useEffect, useRef } from 'react';

const CONTACTS = [
  { id: 'alice', name: 'Alice' },
  { id: 'bob', name: 'Bob' },
];

export default function Home() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [botPanelWidth, setBotPanelWidth] = useState(320); // initial width in px
  const isResizing = useRef(false);
  const [input, setInput] = useState('');
  const [contactChats, setContactChats] = useState({
    alice: [
      { role: 'contact', content: 'Hey there! Long time no chat 😊' },
      { role: 'user', content: 'Hey Alice! What’s up?' },
    ],
    bob: [
      { role: 'contact', content: 'Yo! Ready for the weekend plans?' },
      { role: 'user', content: 'Definitely, Bob! Let’s do it.' },
    ],
  });
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);

  const [botInput, setBotInput] = useState('');
  const [botChat, setBotChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const botChatRef = useRef(null);
  const contactChatRef = useRef(null);

  const updateContactChat = (id, msg) => {
    setContactChats((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), msg],
    }));
  };

  const sendContactMessage = () => {
    if (input.trim()) {
      updateContactChat(activeContact.id, {
        role: 'user',
        content: input.trim(),
      });
      setInput('');
    }
  };

  const sendBotMessage = async () => {
    if (botInput.trim() === '') return;

    const userMsg = { role: 'user', content: botInput.trim() };
    setBotChat((prev) => [...prev, userMsg]);
    setBotInput('');
    setLoading(true);

    // Typing indicator
    setBotChat((prev) => [...prev, { role: 'bot', content: '✍️ Bot is typing...' }]);

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHATBOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: userMsg.content,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7,
              top_p: 0.9,
              repetition_penalty: 1.1,
            },
          }),
        }
      );

      const result = await response.json();

      const rawText =
        result?.length > 0 && result[0]?.generated_text
          ? result[0].generated_text
          : '';

      const botReply = rawText
        .slice(userMsg.content.length)
        .replace(/^\n+/, '')
        .trim();

      setBotChat((prev) => {
        const withoutTyping = prev.slice(0, -1);
        return [
          ...withoutTyping,
          {
            role: 'bot',
            content: botReply || '🤖 I’m not sure how to respond to that.',
          },
        ];
      });
    } catch (err) {
      console.error(err);
      setBotChat((prev) => {
        const withoutTyping = prev.slice(0, -1);
        return [...withoutTyping, { role: 'bot', content: '❌ Failed to get response.' }];
      });
    } finally {
      setLoading(false);
    }
  };

  const onMouseMove = (e) => {
    if (!isResizing.current) return;
    // Calculate new width based on cursor position from right edge of window
    // main container padding 2px + contacts sidebar width (w-1/4 max-w-xs = ~320px)
    // We'll constrain min/max widths
    const newWidth = window.innerWidth - e.clientX - 16; // 16 for some margin
    if (newWidth > 200 && newWidth < 600) {
      setBotPanelWidth(newWidth);
    }
  };

  const onMouseUp = () => {
    if (isResizing.current) {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    }
  };



  useEffect(() => {
    if (botChatRef.current) {
      botChatRef.current.scrollTop = botChatRef.current.scrollHeight;
    }
  }, [botChat]);

  useEffect(() => {
    if (contactChatRef.current) {
      contactChatRef.current.scrollTop = contactChatRef.current.scrollHeight;
    }
  }, [contactChats, activeContact]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <main
      className="min-h-screen flex p-2"
      style={{ backgroundImage: "url('/chat-bg.jpeg')", backgroundSize: 'cover' }}
    >
      {/* Contacts Sidebar */}
      <aside className="w-1/4 max-w-xs shadow-md rounded-lg p-4 bg-white">
        <h2 className="text-lg font-bold mb-3 text-black">📇 Contacts</h2>
        {CONTACTS.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveContact(c)}
            className={`block w-full text-left text-black px-4 py-2 mb-1 rounded-md transition ${
              activeContact.id === c.id
                ? 'bg-blue-100 font-semibold text-black'
                : 'hover:bg-gray-100'
            }`}
          >
            {c.name}
          </button>
        ))}
      </aside>

      {/* Chat Window */}
      <section className="flex-1 mx-4 shadow-md rounded-lg p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-black">
          Chat with {activeContact.name}
        </h2>

        <div
          ref={contactChatRef}
          className="flex-1 overflow-y-auto p-2 mb-4 space-y-2 border rounded"
        >
          {(contactChats[activeContact.id] || []).map((msg, i) => {
  const isUser = msg.role === 'user';
  const isSelected = selectedMessage === i;

  return (
    <div key={i} className="relative group">
      <div
        onClick={() => setSelectedMessage(isSelected ? null : i)}
        className={`max-w-[70%] px-4 py-2 rounded-xl shadow text-sm sm:text-base cursor-pointer select-text ${
          isUser
            ? 'ml-auto bg-blue-100 text-blue-900'
            : 'mr-auto bg-gray-200 text-gray-800'
        }`}
        title="Click to ask AI about this"
      >
        {msg.content}
      </div>

      {isSelected && (
        <div
          className={`absolute mt-1 z-10 ${
            isUser ? 'right-0' : 'left-0'
          }`}
        >
          <button
            onClick={() => {
              setBotInput(msg.content); // ✅ This works for all messages
              setSelectedMessage(null);
            }}
            className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded shadow"
          >
            💬 Ask AI
          </button>
        </div>
      )}
    </div>
  );
})}



        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendContactMessage()}
            className="flex-grow px-4 py-2 border rounded-l-md text-black"
            placeholder="Type your message..."
          />
          <button
            onClick={sendContactMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
          >
            Send
          </button>
        </div>
      </section>

      {/* Resizer */}
      <div
        onMouseDown={() => {
          isResizing.current = true;
          document.body.style.cursor = 'ew-resize';
        }}
        style={{ width: '6px', cursor: 'ew-resize', backgroundColor: 'transparent' }}
        className="hover:bg-blue-400 transition-colors"
        title="Drag to resize bot panel"
      />

      {/* Bot Panel */}
      <aside
        className="max-w-xs shadow-md rounded-lg p-4 flex flex-col"
        style={{ width: botPanelWidth, minWidth: 200, maxWidth: 600 }}
      >
        <h2 className="text-lg font-bold mb-3 text-black">🤖 AI Assistant</h2>

        <div
          ref={botChatRef}
          className="flex-1 overflow-y-auto mb-3 space-y-2 p-2 border rounded bg-gray-50"
        >
          {botChat.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2 rounded-xl shadow text-sm ${
                msg.role === 'user'
                  ? 'ml-auto bg-green-100 text-green-900'
                  : 'mr-auto bg-gray-200 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={botInput}
            onChange={(e) => setBotInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendBotMessage()}
            placeholder="Ask the bot..."
            className="flex-grow px-3 py-2 border rounded-l-md text-black"
            disabled={loading}
          />
          <button
            onClick={sendBotMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </div>
      </aside>
    </main>
  );
}