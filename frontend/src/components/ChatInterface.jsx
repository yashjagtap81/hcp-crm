import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, addChatMessage } from '../store/interactionSlice';

const s = {
  container: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '520px' },
  header: { padding: '18px 24px', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' },
  messages: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  bubble: (role) => ({ maxWidth: '80%', padding: '12px 16px', borderRadius: role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: role === 'user' ? '#4f46e5' : '#f3f4f6', color: role === 'user' ? '#fff' : '#1a1a2e', fontSize: '14px', alignSelf: role === 'user' ? 'flex-end' : 'flex-start', lineHeight: '1.5' }),
  inputRow: { display: 'flex', gap: '10px', padding: '16px 20px', borderTop: '1px solid #e5e7eb' },
  input: { flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '24px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif' },
  sendBtn: { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
};

const SUGGESTIONS = [
  "Log a visit with Dr. Sharma today",
  "Get profile of HCP 1",
  "Schedule a follow-up for next Monday",
  "Analyze the sentiment of interaction 1",
];

export default function ChatInterface() {
  const dispatch = useDispatch();
  const { chatMessages, loading } = useSelector((s) => s.interactions);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, loading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    dispatch(addChatMessage({ role: 'user', content: msg }));
    setInput('');
    dispatch(sendChatMessage(msg));
  };

  return (
    <div style={s.container}>
      <div style={s.header}><div style={s.dot} />AI Assistant — HCP CRM</div>
      <div style={s.messages}>
        {chatMessages.length === 0 && (
          <div>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>Try asking:</p>
            {SUGGESTIONS.map((sg, i) => (
              <div key={i} onClick={() => send(sg)} style={{ padding: '8px 14px', background: '#eef2ff', borderRadius: '8px', fontSize: '13px', color: '#4f46e5', cursor: 'pointer', marginBottom: '8px', display: 'inline-block', marginRight: '8px' }}>{sg}</div>
            ))}
          </div>
        )}
        {chatMessages.map((m, i) => <div key={i} style={s.bubble(m.role)}>{m.content}</div>)}
        {loading && <div style={s.bubble('assistant')}><span style={{ fontSize: '13px', color: '#9ca3af' }}>AI is thinking...</span></div>}
        <div ref={bottomRef} />
      </div>
      <div style={s.inputRow}>
        <input style={s.input} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask AI to log, edit, or find interactions..." />
        <button style={s.sendBtn} onClick={() => send()}>Send</button>
      </div>
    </div>
  );
}
