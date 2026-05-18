import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";
import { getErrorMessage } from "@/lib/utils";
import { AdminUser } from "../types";

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    secretKey: string;
}

interface ResetPasswordData {
    email: string;
    token: string;
    newPassword: string
}

interface UnlockData {
    email: string;
    OTP: string;
    secretKey: string;
}


interface LoginResponse {
    role: string;
    adminId: string;
    name: string;

}

interface MessageResponse {
    message: string;
    email: string;
}

//Thunks

export const loginAdmin = createAsyncThunk(
    'adminAuth/login',
    async(credential: LoginCredentials, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/auth/login', credential);
            return res.data as LoginResponse;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err))
        }
    }
);

export const registerAdmin = createAsyncThunk(
    'adminAuth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/auth/register', data);
            return res.data as LoginResponse
        } catch (err) {
            return rejectWithValue(getErrorMessage(err))
        }
    }
)

export const loadAdmin = createAsyncThunk(
    'adminAuth/loadAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/api/auth/me');
            return res.data.data as AdminUser;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err))
        }
    }
);

export const logoutAdmin = createAsyncThunk(
    'adminAuth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/api/auth/logout')
        } catch (err) {
            return rejectWithValue(getErrorMessage(err))
        }
    }
);

export const forgotPassword = createAsyncThunk(
  "adminAuth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/auth/forgot-password", { email });
      return res.data as MessageResponse;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "adminAuth/resetPassword",
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/auth/reset-password", data);
      return res.data.message as string;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const requestOTP = createAsyncThunk(
  "adminAuth/requestOTP",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/auth/request-otp", { email });
      return res.data as MessageResponse;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const unlockAccount = createAsyncThunk(
  "adminAuth/unlockAccount",
  async (data: UnlockData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/auth/unlock", data);
      return res.data.message as string;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

//state shape 
interface AdminAuthState {
    admin: AdminUser | null; 
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    isLoggingIn: boolean;
    isRegistering: boolean;
    isLoggingOut: boolean;
    isSendingOTP: boolean;
    isUnlocking: boolean;
    isSendingReset: boolean;
    isResettingPassword: boolean;
    message: string | null;
    error: string | null;
};

const initialState: AdminAuthState = {
    admin: null,
    isAuthenticated: false,
    isCheckingAuth: true, 
    isLoggingIn: false,
    isRegistering: false,
    isLoggingOut: false,
    isSendingOTP: false,
    isUnlocking: false,
    isSendingReset: false,
    isResettingPassword: false,
    message: null,
    error: null
};

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
        //login
        .addCase(loginAdmin.pending, (state) => {
            state.isLoggingIn= true;
            state.error = null;
        })
        .addCase(loginAdmin.fulfilled, (state, action) => {
            state.isLoggingIn= false;
            state.isAuthenticated = true;
            state.isCheckingAuth = false;
            state.admin = {
                name: action.payload.name,
                email: '',
                role: action.payload.role
            };
        })
        .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoggingIn= false;
        state.error = action.payload as string;
      })

      // register
      .addCase(registerAdmin.pending, (state) => {
        state.isRegistering = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.isAuthenticated = true;
        state.isCheckingAuth = false;
        state.admin = {
          name: action.payload.name,
          email: "",
          role: action.payload.role,
        };
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.isRegistering = false;
        state.error = action.payload as string;
      })

      // loadAdmin
      .addCase(loadAdmin.pending, (state) => {
        state.isCheckingAuth = true;
        state.error = null;
      })
      .addCase(loadAdmin.fulfilled, (state, action) => {

        state.isCheckingAuth = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
      })
      .addCase(loadAdmin.rejected, (state) => {
  
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.admin = null;
      })

      // logout
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.admin = null;
        state.isLoggingOut = false;
        state.error = null;
        state.message = null;
      })
      .addCase(logoutAdmin.rejected, (state) => {
      
      state.isAuthenticated = false;
      state.admin = null;
      state.isLoggingOut = false;
      state.isCheckingAuth = false;
    })

      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isSendingReset = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isSendingReset = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isSendingReset = false;
        state.error = action.payload as string;
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isResettingPassword = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isResettingPassword = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isResettingPassword = false;
        state.error = action.payload as string;
      })

      // requestOTP
      .addCase(requestOTP.pending, (state) => {
        state.isSendingOTP = true;
        state.error = null;
        state.message = null;
      })
      .addCase(requestOTP.fulfilled, (state, action) => {
        state.isSendingOTP = false;
        state.message = action.payload.message;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.isSendingOTP = false;
        state.error = action.payload as string;
      })

      // unlockAccount
      .addCase(unlockAccount.pending, (state) => {
        state.isUnlocking = true;
        state.error = null;
        state.message = null;
      })
      .addCase(unlockAccount.fulfilled, (state, action) => {
        state.isUnlocking = false;
        state.message = action.payload;
      })
      .addCase(unlockAccount.rejected, (state, action) => {
        state.isUnlocking = false;
        state.error = action.payload as string;
      });
    }
});

export const { clearError, clearMessage } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;