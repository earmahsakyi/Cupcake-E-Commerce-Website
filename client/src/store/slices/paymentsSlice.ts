import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import { getErrorMessage } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Payment {
    id: number;
    order_id: number;
    customer_name: string | null;
    paystack_reference: string;
    amount_pesewas: number;
    momo_network: 'mtn' | 'vod' | 'tgo';
    phone: string;
    status: 'pending' | 'success' | 'failed';
    paid_at: string | null;
}

// ─── Thunk 

export const fetchPayments = createAsyncThunk(
    'payments/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/api/payments');
            return res.data.data as Payment[];
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// ─── State

interface PaymentsState {
    items: Payment[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PaymentsState = {
    items: [],
    status: 'idle',
    error: null,
};

// ─── Slice

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default paymentsSlice.reducer;