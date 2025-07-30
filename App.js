import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send_message', {
        text: message,
        time: new Date().toLocaleTimeString()
      });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off('receive_message');
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h2>Real-Time Chat App</h2>
      <div style={{
        border: '1px solid #ccc',
        padding: 10,
        minHeight: 300,
        marginBottom: 10,
        overflowY: 'auto'
      }}>
        {chat.map((msg, i) => (
          <div key={i}><strong>{msg.time}</strong>: {msg.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        placeholder="Type your message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 10 }}>Send</button>
    </div>
  );
}

export default App;
