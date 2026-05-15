//T actually being generic here just a placeholder for the actual data
export interface ApiResponse<T> {
    success: boolean;
    data? : T;
    error?: string;
    message?: string 
};

