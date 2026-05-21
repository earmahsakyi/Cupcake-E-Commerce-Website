import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";
import { getErrorMessage } from "@/lib/utils";
import {
    Transaction,
    CreateTransactionPayload,
    UpdateTransactionPayload,
} from "../types";

// ─── Thunks 

export const fetchTransactions = createAsyncThunk(
    "transactions/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/api/transactions");
            return res.data.data as Transaction[];
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const createTransaction = createAsyncThunk(
    "transactions/create",
    async (payload: CreateTransactionPayload, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/api/transactions", payload);
            return res.data.data as { id: number };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const updateTransaction = createAsyncThunk(
    "transactions/update",
    async (
        { id, data }: { id: number; data: UpdateTransactionPayload },
        { rejectWithValue }
    ) => {
        try {
            await axiosInstance.patch(`/api/transactions/${id}`, data);
            return { id, data };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const deleteTransaction = createAsyncThunk(
    "transactions/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/transactions/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

// ─── State 

interface TransactionState {
    items: Transaction[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    mutating: boolean;
    mutateError: string | null;
}

const initialState: TransactionState = {
    items: [],
    status: "idle",
    error: null,
    mutating: false,
    mutateError: null,
};

// ─── Slice 

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        clearMutateError(state) {
            state.mutateError = null;
        },
    },
    extraReducers: (builder) => {
        // fetchTransactions
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });

        // createTransaction — optimistically push after re-fetch; refetch in component
        builder
            .addCase(createTransaction.pending, (state) => {
                state.mutating = true;
                state.mutateError = null;
            })
            .addCase(createTransaction.fulfilled, (state) => {
                state.mutating = false;
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.mutating = false;
                state.mutateError = action.payload as string;
            });

        // updateTransaction — patch local state immediately
        builder
            .addCase(updateTransaction.pending, (state) => {
                state.mutating = true;
                state.mutateError = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.mutating = false;
                const { id, data } = action.payload;
                const item = state.items.find((t) => t.id === id);
                if (item) Object.assign(item, data);
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.mutating = false;
                state.mutateError = action.payload as string;
            });

        // deleteTransaction — remove from local state immediately
        builder
            .addCase(deleteTransaction.pending, (state) => {
                state.mutating = true;
                state.mutateError = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.mutating = false;
                state.items = state.items.filter((t) => t.id !== action.payload);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.mutating = false;
                state.mutateError = action.payload as string;
            });
    },
});

export const { clearMutateError } = transactionsSlice.actions;
export default transactionsSlice.reducer;