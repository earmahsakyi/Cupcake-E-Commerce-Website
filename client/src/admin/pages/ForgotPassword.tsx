import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { forgotPassword, clearError } from "@/store/slices/adminAuthSlice";
import { toast } from "sonner";

const ForgotPassword = () => {
 
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isSendingReset, error} = useAppSelector((state) => state.adminAuth);

    useEffect(()=> {
    if(error) {
      dispatch(clearError())
    }
  },[error,dispatch])

  
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(forgotPassword(email)).unwrap()
      toast.success(result.message);
      setTimeout(()=> {
        navigate('/admin/reset', { state: { email } })
      },1500)
    } catch(err) {
      console.error('Failed to send Code!')
    }

  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we'll send you a one-time code."
      footer={
        <Link to="/admin/login" className="text-primary hover:underline">
          ← Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" placeholder="you@bakery.com" />
        </label>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <button
          disabled={isSendingReset}
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft"
        >
         {isSendingReset ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
