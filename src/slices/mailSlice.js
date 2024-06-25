import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../baseURL';

const getToken = () => {
  return localStorage.getItem('token');
};

export const sendEmail = createAsyncThunk('email/sendEmail', async (emailData) => {
  const token = getToken();
  const response = await axios.post(`${baseURL}/api/email/send`, emailData, {
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  return response.data;
});

export const fetchMails = createAsyncThunk('recipient/fetchMails', async ({ search = '', count = 10, page = 1 }) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseURL}/api/email/sent`, {
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

export const fetchMailById = createAsyncThunk('recipient/fetchMailById', async ({ id }) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseURL}/api/email/emails/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Mail Details:', error.message);
    throw error;
  }
});

const mailSlice = createSlice({
  name: 'mail',
  initialState: {
    status: 'idle',
    mailDetails: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendEmail.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.mail = action.payload;
      })
      .addCase(fetchMails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMailById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMailById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.mailDetails = action.payload;
      })
      .addCase(fetchMailById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default mailSlice.reducer;
