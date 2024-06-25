/* eslint-disable no-underscore-dangle */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../baseURL';

const getToken = () => {
  return localStorage.getItem('token');
};

export const fetchRecipient = createAsyncThunk('recipient/fetchRecipient', async ({ search = '', count = 10, page = 1 }) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseURL}/api/recipient/all`, {
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
    console.error('Error fetching recipients:', error.message);
    throw error;
  }
});

export const fetchAllRecipients = createAsyncThunk('recipient/fetchAllRecipients', async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseURL}/api/recipient/all`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipients:', error.message);
    throw error;
  }
});

export const addRecipient = createAsyncThunk('recipient/addRecipient', async (recipient) => {
  try {
    const token = getToken();
    const response = await axios.post(`${baseURL}/api/recipient/add`, recipient, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding recipient:', error.message);
    throw error;
  }
});

export const addRecipientByGroup = createAsyncThunk('recipient/addRecipientByGroup', async (recipient) => {
  try {
    const token = getToken();
    const response = await axios.post(`${baseURL}/api/recipient/addRecipientToGroup`, recipient, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error Adding Recipient:', error.message);
    throw error;
  }
});

export const fetchRecipientGroup = createAsyncThunk('recipient/fetchRecipientGroup', async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseURL}/api/recipient/groups`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipients:', error.message);
    throw error;
  }
});

export const addRecipientGroup = createAsyncThunk('recipient/addRecipientGroup', async (recipient) => {
  try {
    const token = getToken();
    const response = await axios.post(`${baseURL}/api/recipient/group`, recipient, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding recipient:', error.message);
    throw error;
  }
});

export const uploadRecipients = createAsyncThunk('recipient/uploadRecipients', async (formData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${baseURL}/api/recipient/upload`, formData, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error Adding Recipients:', error.message);
    throw error;
  }
});

export const fetchRecipientByGroup = createAsyncThunk('recipient/fetchRecipientByGroup', async ({ id }) => {
  try {
    const token = getToken();
    const response = await axios.get(`${baseURL}/api/recipient/group/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Recipients:', error.message);
    throw error;
  }
});

export const deleteRecipient = createAsyncThunk('senders/deleteRecipient', async ({ id }) => {
  const token = getToken();
  const response = await axios.delete(`${baseURL}/api/recipient/delete/${id}`, {
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  return response.data;
});

export const deleteRecipientGroup = createAsyncThunk('senders/deleteRecipientGroup', async ({ id }) => {
  const token = getToken();
  const response = await axios.delete(`${baseURL}/api/recipient/groupdelete/${id}`, {
    headers: {
      'x-auth-token': `${token}`,
    },
  });
  return response.data;
});

export const updateRecipientGroup = createAsyncThunk('senders/updateRecipientGroup', async ({ id, name }) => {
  const token = getToken();
  const response = await axios.put(
    `${baseURL}/api/recipient/updategroup/${id}`,
    { name },
    {
      headers: {
        'x-auth-token': token,
      },
    }
  );
  return response.data;
});

export const updateRecipient = createAsyncThunk('senders/updateRecipient', async ({ id, name, email, groups }) => {
  const token = getToken();
  const response = await axios.put(
    `${baseURL}/api/recipient/update/${id}`,
    { name, email, groups },
    {
      headers: {
        'x-auth-token': token,
      },
    }
  );
  return response.data;
});

const recipientSlice = createSlice({
  name: 'recipients',
  initialState: {
    recipients: [],
    arecipientsgroupbyid: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipient.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecipient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.arecipients = action.payload;
      })
      .addCase(fetchRecipient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchAllRecipients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllRecipients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recipientsall = action.payload;
      })
      .addCase(fetchAllRecipients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addRecipient.fulfilled, (state, action) => {
        if (!Array.isArray(state.recipients)) {
          state.recipients = [];
        }
        state.recipients.push(action.payload);
      })

      .addCase(addRecipientByGroup.fulfilled, (state, action) => {
        if (!Array.isArray(state.recipients)) {
          state.recipients = [];
        }
        state.recipients.push(action.payload);
      })
      .addCase(fetchRecipientGroup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecipientGroup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.arecipientsgroup = action.payload;
      })
      .addCase(fetchRecipientGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchRecipientByGroup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecipientByGroup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.arecipientsgroupbyid = action.payload;
      })
      .addCase(fetchRecipientByGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addRecipientGroup.fulfilled, (state, action) => {
        if (!Array.isArray(state.recipientsgroup)) {
          state.recipientsgroup = [];
        }
        state.recipientsgroup.push(action.payload);
      })
      .addCase(uploadRecipients.fulfilled, (state, action) => {
        if (!Array.isArray(state.recipientcsv)) {
          state.recipientcsv = [];
        }
        state.recipientcsv.push(action.payload);
      })
      .addCase(deleteRecipient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteRecipient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.arecipientdelete = action.payload;
      })
      .addCase(deleteRecipient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteRecipientGroup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteRecipientGroup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.arecipientgroupdelete = action.payload;
      })
      .addCase(deleteRecipientGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateRecipientGroup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRecipientGroup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedRecipient = action.payload;
        console.log(updatedRecipient);
        const existingRecipientIndex = state.recipients.findIndex((recipient) => recipient._id === updatedRecipient._id);
        if (existingRecipientIndex !== -1) {
          state.recipients[existingRecipientIndex] = updatedRecipient;
        }
      })
      .addCase(updateRecipientGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateRecipient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRecipient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedRecipient = action.payload;
        console.log(updatedRecipient);
        const existingRecipientIndex = state.recipients.findIndex((recipient) => recipient._id === updatedRecipient._id);
        if (existingRecipientIndex !== -1) {
          state.recipients[existingRecipientIndex] = updatedRecipient;
        }
      })
      .addCase(updateRecipient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default recipientSlice.reducer;
