import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import { getErrorMessage } from '@/lib/utils';

//Types

export interface SmsLog {
    id: number;
    order_id: number;
    customer_name: string | null;
    phone: string;
    message: string;
    trigger_type: 'manual' | 'payment' | 'out_for_delivery';
    sent_at: string;
}

export interface SendSmsPayload {
    order_id: number;
    phone: string;
    message: string;
    trigger_type: 'manual' | 'payment' | 'out_for_delivery';
}

// ─── Thunks 

export const fetchSmsLogs = createAsyncThunk(
    'sms/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/api/sms');
            return res.data.data as SmsLog[];
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const sendSms = createAsyncThunk(
    'sms/send',
    async (payload: SendSmsPayload, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/api/sms/send', payload);
            return payload; // return payload so we can optimistically add to log
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// ─── State

interface SmsState {
    logs: SmsLog[];
    logsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    logsError: string | null;
    sending: boolean;
    sendError: string | null;
}

const initialState: SmsState = {
    logs: [],
    logsStatus: 'idle',
    logsError: null,
    sending: false,
    sendError: null,
};

// ─── Slice 

const smsSlice = createSlice({
    name: 'sms',
    initialState,
    reducers: {
        clearSendError(state) {
            state.sendError = null;
        }
    },
    extraReducers: (builder) => {

        // fetchSmsLogs
        builder
            .addCase(fetchSmsLogs.pending, (state) => {
                state.logsStatus = 'loading';
                state.logsError = null;
            })
            .addCase(fetchSmsLogs.fulfilled, (state, action) => {
                state.logsStatus = 'succeeded';
                state.logs = action.payload;
            })
            .addCase(fetchSmsLogs.rejected, (state, action) => {
                state.logsStatus = 'failed';
                state.logsError = action.payload as string;
            });

        // sendSms
        builder
            .addCase(sendSms.pending, (state) => {
                state.sending = true;
                state.sendError = null;
            })
            .addCase(sendSms.fulfilled, (state) => {
                state.sending = false;
                // We re-fetch logs after send so the new entry appears with full data
            })
            .addCase(sendSms.rejected, (state, action) => {
                state.sending = false;
                state.sendError = action.payload as string;
            });
    },
});

export const { clearSendError } = smsSlice.actions;
export default smsSlice.reducer;
