import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../baseURL';

const getToken = () => {
  return localStorage.getItem('token');
};

export const getStats = createAsyncThunk('dashboard/getStats', async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseURL}/api/dashboard/stats`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error Fetching Stats:', error.message);
    throw error;
  }
});

const dashboardSlice = createSlice({
  name: 'stats',
  initialState: {
    status: 'idle',
    stats: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
