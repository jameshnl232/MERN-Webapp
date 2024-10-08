import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../../types/type'

// Define the initial state using that type
export interface AuthState {
  user: User | null
  userId: string | null
  token: string | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  userId: null,
  token: null,
  loading: false
}

export const authSclice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    signIn(state, action: PayloadAction<{ user: User; userId: string; token: string }>) {
      state.user = action.payload.user
      state.userId = action.payload.userId
      state.token = action.payload.token
    },
    logoutProfile(state) {
      state.user = null
      state.userId = null
      state.token = null
    },
    updateProfile(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    deleteProfile(state) {
      state.user = null
      state.userId = null
      state.token = null
    }
  }
})

// Action creators are generated for each case reducer function
export const { signIn, setLoading, updateProfile, deleteProfile, logoutProfile } = authSclice.actions

export default authSclice.reducer
