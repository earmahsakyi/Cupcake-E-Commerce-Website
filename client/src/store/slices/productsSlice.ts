import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import { Product } from '../types';
import { getErrorMessage } from '@/lib/utils';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/api/products');
            return res.data.data as Product[];
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/create',
    async (payload: Omit<Product, 'id' | 'is_active'>, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/api/products', payload);
            return res.data.data as { productId: number };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, data }: { id: number; data: Partial<Omit<Product, 'id'>> }, { rejectWithValue }) => {
        try {
            await axiosInstance.patch(`/api/products/${id}`, data);
            return id;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/products/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);



interface ProductState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    mutating: boolean;   // true when create/update/delete is in flight
    mutateError: string | null;
}

const initialState: ProductState = {
    items: [],
    status: 'idle',
    error: null,
    mutating: false,
    mutateError: null,
};



const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearMutateError(state) {
            state.mutateError = null;
        }
    },
    extraReducers: (builder) => {
        // fetchProducts
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // createProduct — re-fetch list after create so we get the full product back
        builder
            .addCase(createProduct.pending, (state) => {
                state.mutating = true;
                state.mutateError = null;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.mutating = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.mutating = false;
                state.mutateError = action.payload as string;
            });

        // updateProduct — re-fetch list after update
        builder
            .addCase(updateProduct.pending, (state) => {
                state.mutating = true;
                state.mutateError = null;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.mutating = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.mutating = false;
                state.mutateError = action.payload as string;
            });

        // deleteProduct — remove from local state immediately (optimistic)
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.mutating = true;
                state.mutateError = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.mutating = false;
                state.items = state.items.filter(p => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.mutating = false;
                state.mutateError = action.payload as string;
            });
    },
});

export const { clearMutateError } = productsSlice.actions;
export default productsSlice.reducer;