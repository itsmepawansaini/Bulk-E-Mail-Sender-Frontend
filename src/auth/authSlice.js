import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DEFAULT_USER, IS_DEMO } from 'config.js';
import baseURL from '../baseURL';

const initialState = {
  isLogin: IS_DEMO,
  currentUser: IS_DEMO ? DEFAULT_USER : {},
};

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, thunkAPI) => {
  const response = await fetch(`${baseURL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return thunkAPI.rejectWithValue('Login Failed');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.isLogin = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.currentUser = user;
        state.isLogin = true;
        localStorage.setItem('token', token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLogin = false;
      });
  },
});

export const { setCurrentUser } = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
