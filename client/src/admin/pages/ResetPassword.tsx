import { FormEvent, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { resetPassword, clearError } from "@/store/slices/adminAuthSlice";
import { passwordChecks } from "@/lib/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email ?? "");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
   const dispatch = useAppDispatch();
   const [showPassword, setShowPassword] = useState(false);
  const { isResettingPassword, error} = useAppSelector((state) => state.adminAuth);

    useEffect(()=> {
    
    dispatch(clearError())
    
  },[dispatch])


  const submit =async(e: FormEvent) => {
    e.preventDefault();
    if(pw !== confirm) {
      toast.error('Password do not match!');
      return;
    }
    try {
      const result = await dispatch(resetPassword({email, token:otp, newPassword:pw})).unwrap();
       toast.success(result);
      setTimeout(()=> {
        navigate('/admin/login')
      },1500)
    } catch (err) {
        console.error('failed to reset passowrd!')
    }

  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter the OTP and choose a new password."
      footer={
        <Link to="/admin/login" className="text-primary hover:underline">
          ← Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" />
        </Field>
        <Field label="OTP code">
          <input required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="input-base tracking-widest" placeholder="6-digit code" />
        </Field>
        <Field label="New password">
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} required value={pw} onChange={(e) => setPw(e.target.value)} className="input-base" />
            <button type='button' className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={()=> setShowPassword(!showPassword)}>
               {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </button>
          </div>
          <ul className="mt-3 space-y-1 text-sm">
              {
                passwordChecks.map((check, index) => {
                  const passed = check.test(pw);
                  return (
                    <li key={index} className={` flex items-center gap-2
                      ${passed ? 'text-green-600' : 'text-red-500'}
                    `}>
                      <span>{passed ? '✓' : '✗'}</span>
                      <span>{check.label}</span>
                    </li>
                  )
                })
              }
            </ul>
        </Field>
        <Field label="Confirm password">
          <input type={showPassword ? 'text' : 'password'} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-base" />
        </Field>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <button
        disabled={isResettingPassword}
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft"
        >
          {isResettingPassword ? 'Resetting...' : 'Reset password'}
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

export default ResetPassword;
