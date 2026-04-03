import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from './store/interactionSlice';
import LogInteractionForm from './components/LogInteractionForm';
import ChatInterface from './components/ChatInterface';

const s = {
  app: { minHeight: '100vh', background: '#f5f7fa' },
  header: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' },
  logo: { fontSize: '20px', fontWeight: '700', color: '#4f46e5' },
  subtitle: { fontSize: '12px', color: '#9ca3af' },
  tab: (active) => ({ padding: '8px 20px', borderRadius: '8px', border: 'none', background: active ? '#4f46e5' : 'transparent', color: active ? '#fff' : '#6b7280', fontWeight: '500', cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif' }),
  main: { maxWidth: '720px', margin: '0 auto', padding: '40px 20px' },
};

function Inner() {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((s) => s.interactions);
  return (
    <div style={s.app}>
      <header style={s.header}>
        <div>
          <div style={s.logo}>HCP CRM</div>
          <div style={s.subtitle}>AI-First Life Sciences CRM</div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button style={s.tab(activeTab === 'form')} onClick={() => dispatch(setActiveTab('form'))}>Log Interaction</button>
          <button style={s.tab(activeTab === 'chat')} onClick={() => dispatch(setActiveTab('chat'))}>AI Chat</button>
        </div>
      </header>
      <main style={s.main}>
        {activeTab === 'form' ? <LogInteractionForm /> : <ChatInterface />}
      </main>
    </div>
  );
}

export default function App() {
  return <Provider store={store}><Inner /></Provider>;
}
