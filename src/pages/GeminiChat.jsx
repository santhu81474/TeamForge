import React, { useState } from 'react';
import api from '../services/api';

const GeminiChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'GEMINI_CORE', text: 'NEURAL_LINK_ESTABLISHED. I am the Gemini Advanced Intelligence Node. Protocol 7/7: Ready for query.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = { sender: 'OPERATOR', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    
    try {
      const res = await api.post('/gemini/chat', { prompt: input });
      setMessages((prev) => [...prev, { sender: 'GEMINI_CORE', text: res.data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'GEMINI_CORE', text: 'SIGNAL_DEGRADATION: Neural response failed. Check connectivity.' }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
      <div className="flex justify-between items-center mb-2">
        <h1 className="page-title">[GEMINI_CHAT_PORTAL]</h1>
        <div className="mono badge" style={{ color: 'var(--neon-green)', borderColor: 'var(--neon-green)' }}>ENCRYPTED_LINK: ACTIVE</div>
      </div>

      <div className="glass-panel scan-line" style={{ 
        height: '600px', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        border: '1.5px solid rgba(46, 204, 113, 0.15)'
      }}>
        {/* Chat Output Area */}
        <div style={{ 
          flex: 1, 
          padding: '24px', 
          overflowY: 'auto', 
          backgroundColor: 'rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((m, i) => (
            <div key={i} className="card glass-panel" style={{ 
              alignSelf: m.sender === 'OPERATOR' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '12px 18px',
              borderLeft: m.sender === 'GEMINI_CORE' ? '3px solid var(--neon-green)' : '1px solid rgba(88, 166, 255, 0.2)',
              borderRight: m.sender === 'OPERATOR' ? '3px solid var(--link-color)' : '1px solid rgba(255, 255, 255, 0.05)',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div className="mono" style={{ 
                fontSize: 10, 
                color: m.sender === 'GEMINI_CORE' ? 'var(--neon-green)' : 'var(--link-color)',
                marginBottom: 6,
                letterSpacing: 1
              }}>
                {m.sender} // {new Date().toLocaleTimeString()}
              </div>
              <div className="mono" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-main)' }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="mono" style={{ color: 'var(--neon-green)', fontSize: 11, animation: 'pulse 1s infinite' }}>
              {'>'} DECRYPTING_RESPONSE...
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} style={{ 
          padding: '20px', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          gap: '12px',
          backgroundColor: 'rgba(22, 27, 34, 0.8)'
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="TRANSMIT_COMMAND_TO_GEMINI..."
            className="form-input mono"
            style={{ flex: 1, fontSize: 14, background: 'rgba(0,0,0,0.3)' }}
            disabled={loading}
          />
          <button 
            className="btn btn-primary neon-hover mono" 
            type="submit" 
            disabled={loading || !input.trim()}
            style={{ padding: '0 32px' }}
          >
            EXECUTE
          </button>
        </form>
      </div>
      
      <div className="mono" style={{ marginTop: 12, fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', opacity: 0.6 }}>
        SYSTEM_ID: 154-GPT-ALPHA | NEURAL_BACKEND: FLASH-1.5
      </div>
    </div>
  );
};

export default GeminiChat;
