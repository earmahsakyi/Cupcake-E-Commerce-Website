import { configureStore } from "@reduxjs/toolkit";
import productsReducer from '@/store/slices/productsSlice';
import ordersReducer from "@/store/slices/ordersSlice";
import adminAuthReducer from "@/store/slices/adminAuthSlice";
import smsReducer from '@/store/slices/smsSlice';
import paymentsReducer from '@/store/slices/paymentsSlice';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
    adminAuth: adminAuthReducer,
    sms: smsReducer,
    payments: paymentsReducer,
    
  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;