import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


//helper to extract error messages
export const getErrorMessage = (error :unknown): string => {
    if (axios.isAxiosError(error)){
        const axiosError = error 
        return (
            axiosError.response?.data?.msg ||
            axiosError.response?.data?.error ||
            axiosError.response?.data?.Error ||
            axiosError.response?.data?.message ||
            axiosError.response?.data?.errors?.[0]?.msg ||
            'An error occurred'
        )
    }
    return 'An unexpected error occurred';
};

export const passwordChecks = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "Contains an uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "Contains a lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "Contains a number",
    test: (password: string) => /\d/.test(password),
  },
  {
    label: "Contains a special character",
    test: (password: string) => /[\W_]/.test(password),
  },
];