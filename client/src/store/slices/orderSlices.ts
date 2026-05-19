import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";
import { Order, CreateOrderPayload } from "../types";
import { getErrorMessage } from "@/lib/utils";

export const createOrder = createAsyncThunk(
    'orders/create',
    async (payload: CreateOrderPayload, {rejectWithValue} ) => {
        try {
            const res = await axiosInstance.post('/api/orders', payload);
            return res.data.data as { orderId: number, reference: string}

        } catch (err) {
            return rejectWithValue(getErrorMessage(err))
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (id: number, {rejectWithValue}) => {
        try {
            const res = await axiosInstance.get(`/api/orders/${id}`);
            return res.data.data as Order;
        } catch (err) {
           return rejectWithValue(getErrorMessage(err))
        }
    }
);

export const fetchAllOrders = createAsyncThunk(
    'orders/fetch',
    async(_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/api/orders');
            return res.data.orders as Order[];
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
)

interface OrderState {
    currentOrder: Order | null;
    createdReference: string | null;
    createdOrderId: number | null;
    submitStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    allOrders: Order [];
    fetchAllStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: OrderState = {
    currentOrder: null,
    createdReference: null,
    createdOrderId: null,
    submitStatus: 'idle',
    fetchStatus: 'idle',
    error: null,
    allOrders: [],
    fetchAllStatus: 'idle'

}


const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderState : (state) => {
            state.submitStatus = 'idle';
            state.createdReference = null;
            state.createdOrderId =  null;
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createOrder.pending, (state) => {
            state.submitStatus = 'loading';
            state.error = null;
        })
        .addCase(createOrder.fulfilled, (state, action)=> {
            state.submitStatus = 'succeeded';
            state.createdOrderId = action.payload.orderId;
            state.createdReference = action.payload.reference 
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.submitStatus = 'failed';
            state.error = action.payload as string
        })
        .addCase(fetchAllOrders.pending, (state) => {
            state.fetchAllStatus = 'loading';
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.fetchAllStatus = 'succeeded';
            state.allOrders = action.payload;
        })
        .addCase(fetchAllOrders.rejected, (state, action)=> {
            state.fetchAllStatus = 'failed';
            state.error = action.payload as string;
        })
        .addCase(fetchOrderById.pending, (state) => {
            state.fetchStatus = 'loading';
            state.error = null;
        })
        .addCase(fetchOrderById.fulfilled, (state, action) => {
            state.fetchStatus = 'succeeded';
            state.currentOrder = action.payload;
        })
        .addCase(fetchOrderById.rejected, (state, action) => {
            state.fetchStatus = 'failed';
            state.error = action.payload as string
        });
        
    }
});

export const { resetOrderState } = ordersSlice.actions;
export default ordersSlice.reducer;
