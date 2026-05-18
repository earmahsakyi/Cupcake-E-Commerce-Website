import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { requestOTP, unlockAccount,  clearError } from "@/store/slices/adminAuthSlice";
import { toast } from "sonner";

const UnlockAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState( "");
  const [otp, setOtp] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const dispatch = useAppDispatch();
  const { isSendingOTP,isUnlocking, error} = useAppSelector((state) => state.adminAuth);

    useEffect(()=> {
    if(error) {
      dispatch(clearError())
    }
  },[error,dispatch])

  const handleSendOTP = async () => {
    if(!email) {
      toast.error('Email is required!')
    }
    try { 
      const result = await dispatch(requestOTP(email)).unwrap();
      toast.success(result.message);

    } catch (err) {
      console.error('Failed to send OTP')
    }
  }


  const submit =async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(unlockAccount({email,OTP: otp, secretKey:secretKey})).unwrap();
      toast.success(result);

      setTimeout(() => {
        navigate('/admin/login')
      },1500);
    } catch (err) {
      console.error('Failed to unlock account')
    }
    
  };

  return (
    <AuthShell
      title="Unlock account"
      subtitle={`Verify with OTP and admin secret key.`}
      footer={
        <Link to="/admin/login" className="text-primary hover:underline">
          ← Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <div className="flex gap-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" />
            <button type="button" onClick={handleSendOTP} className="rounded-2xl border border-border px-3 text-xs font-semibold text-foreground hover:bg-secondary">
              {isSendingOTP ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Signing out…</> : 'Send OTP'}
            </button>
          </div>
        </Field>
        <Field label="OTP code">
          <input required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="input-base tracking-widest" placeholder="6-digit code" />
        </Field>
        <Field label="Admin secret key">
          <input required value={secretKey} onChange={(e) => setSecretKey(e.target.value)} className="input-base" />
        </Field>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <button
          disabled = {isUnlocking}
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft"
        >
          {isUnlocking ? 'Unlocking...' : 'Unlock Acoount'}
        </button>
      </form>
    </AuthShell>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
    {children}
  </label>
);

export default UnlockAccount;
