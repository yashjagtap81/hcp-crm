import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const fetchInteractions = createAsyncThunk('interactions/fetchAll', async (hcp_id) => {
  const res = await api.get(`/interactions/${hcp_id}`);
  return res.data;
});

export const logInteraction = createAsyncThunk('interactions/log', async (data) => {
  const res = await api.post('/interactions', data);
  return res.data;
});

export const sendChatMessage = createAsyncThunk('interactions/chat', async (message) => {
  const res = await api.post('/chat', { message });
  return res.data.response;
});

export const fetchHCPs = createAsyncThunk('interactions/fetchHCPs', async () => {
  const res = await api.get('/hcps');
  return res.data;
});

const interactionSlice = createSlice({
  name: 'interactions',
  initialState: {
    list: [],
    hcps: [],
    chatMessages: [],
    loading: false,
    error: null,
    activeTab: 'form',
  },
  reducers: {
    setActiveTab: (state, action) => { state.activeTab = action.payload; },
    addChatMessage: (state, action) => { state.chatMessages.push(action.payload); },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(logInteraction.fulfilled, (state, action) => { state.list.unshift(action.payload); state.loading = false; })
      .addCase(sendChatMessage.pending, (state) => { state.loading = true; })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.chatMessages.push({ role: 'assistant', content: action.payload });
      })
      .addCase(fetchHCPs.fulfilled, (state, action) => { state.hcps = action.payload; })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.loading = true; })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setActiveTab, addChatMessage, clearError } = interactionSlice.actions;
export default interactionSlice.reducer;
