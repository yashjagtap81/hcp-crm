import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logInteraction, fetchHCPs } from '../store/interactionSlice';

const s = {
  container: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' },
  title: { fontSize: '20px', fontWeight: '600', color: '#1a1a2e', marginBottom: '24px' },
  group: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', minHeight: '120px', resize: 'vertical', fontFamily: 'Inter, sans-serif', outline: 'none' },
  btn: { width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  success: { padding: '10px 14px', background: '#d1fae5', color: '#065f46', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' },
};

export default function LogInteractionForm() {
  const dispatch = useDispatch();
  const { hcps, loading } = useSelector((s) => s.interactions);
  const [form, setForm] = useState({ hcp_id: '', interaction_type: 'visit', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { dispatch(fetchHCPs()); }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(logInteraction({ ...form, hcp_id: parseInt(form.hcp_id) }));
    setSubmitted(true);
    setForm({ hcp_id: '', interaction_type: 'visit', notes: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={s.container}>
      <p style={s.title}>Log HCP Interaction</p>
      {submitted && <div style={s.success}>Interaction logged successfully!</div>}
      <form onSubmit={handleSubmit}>
        <div style={s.group}>
          <label style={s.label}>Healthcare Professional</label>
          <select name="hcp_id" value={form.hcp_id} onChange={handleChange} style={s.input} required>
            <option value="">Select HCP...</option>
            {hcps.map((h) => <option key={h.id} value={h.id}>{h.name} — {h.specialization}</option>)}
          </select>
        </div>
        <div style={s.group}>
          <label style={s.label}>Interaction Type</label>
          <select name="interaction_type" value={form.interaction_type} onChange={handleChange} style={s.input}>
            <option value="visit">Field Visit</option>
            <option value="call">Phone Call</option>
            <option value="email">Email</option>
            <option value="conference">Conference</option>
          </select>
        </div>
        <div style={s.group}>
          <label style={s.label}>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Describe the interaction..." style={s.textarea} required />
        </div>
        <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Logging...' : 'Log Interaction'}</button>
      </form>
    </div>
  );
}
