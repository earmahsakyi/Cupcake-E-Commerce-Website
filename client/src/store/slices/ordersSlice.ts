import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import { Order, OrderStatus, SubmitOtpPayload, CreateOrderPayload } from '../types';
import { getErrorMessage } from '@/lib/utils';



export const createOrder = createAsyncThunk(
    'orders/create',
    async (payload: CreateOrderPayload, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/orders', payload);
            return res.data.data as { orderId: number; reference: string; requiresOtp: boolean };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/api/orders/${id}`);
            return res.data.data as Order;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/api/orders');
            return res.data.orders as Order[];
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const submitOtp = createAsyncThunk(
    'orders/submitOtp',
    async (payload: SubmitOtpPayload, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/orders/submit-otp', payload);
            return res.data.data as { status: string };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, status }: { id: number; status: OrderStatus }, { rejectWithValue }) => {
        try {
            await axiosInstance.patch(`/api/orders/${id}/status`, { status });
            // Return both so the reducer can update local state without a re-fetch
            return { id, status };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const toggleUrgent = createAsyncThunk(
    'orders/toggleUrgent',
    async (id: number, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/api/orders/${id}/urgent`);
            return res.data.data as { id: number; is_urgent: boolean };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);



interface OrdersState {
    // Customer checkout
    submitStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    createdOrderId: number | null;
    createdReference: string | null;
    requiresOtp: boolean;
    otpStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    otpError: string | null;

    // Admin list
    list: Order[];
    listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    listError: string | null;

    // Admin detail
    currentOrder: Order | null;
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchError: string | null;

    // Admin mutations (status + urgent)
    mutating: boolean;
    mutateError: string | null;
}

const initialState: OrdersState = {
    submitStatus: 'idle',
    error: null,
    createdOrderId: null,
    createdReference: null,
    requiresOtp: false,
    otpStatus: 'idle',
    otpError: null,

    list: [],
    listStatus: 'idle',
    listError: null,

    currentOrder: null,
    fetchStatus: 'idle',
    fetchError: null,

    mutating: false,
    mutateError: null,
};

// ─── Slice

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderState(state) {
            state.submitStatus = 'idle';
            state.error = null;
            state.createdOrderId = null;
            state.createdReference = null;
            state.requiresOtp = false;
            state.otpStatus = 'idle';
            state.otpError = null;
        },
        clearMutateError(state) {
            state.mutateError = null;
        }
    },
    extraReducers: (builder) => {

        // createOrder
        builder
            .addCase(createOrder.pending, (state) => {
                state.submitStatus = 'loading';
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.submitStatus = 'succeeded';
                state.createdOrderId = action.payload.orderId;
                state.createdReference = action.payload.reference;
                state.requiresOtp = action.payload.requiresOtp;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.submitStatus = 'failed';
                state.error = action.payload as string;
            });

        // submitOtp
        builder
            .addCase(submitOtp.pending, (state) => {
                state.otpStatus = 'loading';
                state.otpError = null;
            })
            .addCase(submitOtp.fulfilled, (state) => {
                state.otpStatus = 'succeeded';
            })
            .addCase(submitOtp.rejected, (state, action) => {
                state.otpStatus = 'failed';
                state.otpError = action.payload as string;
            });

        // fetchOrderById
        builder
            .addCase(fetchOrderById.pending, (state) => {
                state.fetchStatus = 'loading';
                state.fetchError = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.fetchError = action.payload as string;
            });

        // fetchAllOrders
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.listStatus = 'loading';
                state.listError = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.listStatus = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.listStatus = 'failed';
                state.listError = action.payload as string;
            });

        // updateOrderStatus — update both currentOrder and the list item optimistically
        builder
            .addCase(updateOrderStatus.pending, (state) => {
                state.mutating = true;
                state.mutateError = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.mutating = false;
                const { id, status } = action.payload;
                // Update detail view
                if (state.currentOrder?.id === id) {
                    state.currentOrder.status = status;
                }
                // Update list view
                const listItem = state.list.find(o => o.id === id);
                if (listItem) listItem.status = status;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.mutating = false;
                state.mutateError = action.payload as string;
            });

        // toggleUrgent — update both currentOrder and the list item
        builder
            .addCase(toggleUrgent.pending, (state) => {
                state.mutating = true;
                state.mutateError = null;
            })
            .addCase(toggleUrgent.fulfilled, (state, action) => {
                state.mutating = false;
                const { id, is_urgent } = action.payload;
                if (state.currentOrder?.id === id) {
                    state.currentOrder.is_urgent = is_urgent;
                }
                const listItem = state.list.find(o => o.id === id);
                if (listItem) listItem.is_urgent = is_urgent;
            })
            .addCase(toggleUrgent.rejected, (state, action) => {
                state.mutating = false;
                state.mutateError = action.payload as string;
            });
    },
});

export const { resetOrderState, clearMutateError } = ordersSlice.actions;
export default ordersSlice.reducer;