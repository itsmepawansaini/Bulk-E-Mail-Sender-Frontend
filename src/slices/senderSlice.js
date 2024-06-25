/* eslint-disable no-underscore-dangle */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../baseURL';

const getToken = () => {
  return localStorage.getItem('token');
};

export const fetchSenders = createAsyncThunk('recipient/fetchSenders', async ({ search = '', count = 10, page = 1 }) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseURL}/api/sender/all`, {
      headers: {
        'x-auth-token': token,
      },
      params: {
        search,
        count,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching senders:', error.message);
    throw error;
  }
});

export const addSender = createAsyncThunk('senders/addSender', async (sender) => {
  const token = getToken();
  const response = await axios.post(`${baseURL}/api/sender/add`, sender, {
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  return response.data;
});

export const deleteSender = createAsyncThunk('senders/deleteSender', async ({ id }) => {
  const token = getToken();
  const response = await axios.delete(`${baseURL}/api/sender/delete/${id}`, {
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  return response.data;
});

export const updateSender = createAsyncThunk('senders/updateSender', async ({ id, name, email }) => {
  const token = getToken();
  const response = await axios.put(
    `${baseURL}/api/sender/update/${id}`,
    { name, email },
    {
      headers: {
        'x-auth-token': token,
      },
    }
  );
  return response.data;
});

const senderSlice = createSlice({
  name: 'senders',
  initialState: {
    senders: [],
    asendersdelete: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSenders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSenders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.asenders = action.payload;
      })
      .addCase(fetchSenders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteSender.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSender.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.asendersdelete = action.payload;
      })
      .addCase(deleteSender.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addSender.fulfilled, (state, action) => {
        if (!Array.isArray(state.senders)) {
          state.senders = [];
        }
        state.senders.push(action.payload);
      })
      .addCase(updateSender.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSender.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedSender = action.payload;
        const existingSenderIndex = state.senders.findIndex((sender) => sender._id === updatedSender._id);
        if (existingSenderIndex !== -1) {
          state.senders[existingSenderIndex] = updatedSender;
        }
      })
      .addCase(updateSender.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default senderSlice.reducer;
