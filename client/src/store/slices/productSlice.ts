import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import { Product } from '../types';
import { getErrorMessage } from '@/lib/utils';

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_,{ rejectWithValue } ) => {
        try { 
            const res = await axiosInstance.get('/api/products');
            return res.data.data as Product[];

        } catch(err) {
            return rejectWithValue(getErrorMessage(err))
        }
    }
);

interface ProductState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
};

const initialState: ProductState = {
    items: [],
    status: 'idle',
    error: null
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchProducts.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
        })
        .addCase(fetchProducts.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.payload as string
        })
    },
});

export default productsSlice.reducer;