import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { auth } from "@/admin/store";
import { toast } from "sonner";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (pw !== confirm) return setError("Passwords do not match.");
    try {
      auth.resetPassword(email.trim(), otp.trim(), pw);
      toast.success("Password reset successfully. Please sign in.");
      navigate("/admin/login");
    } catch (err: any) {
      setError(err.message || "Reset failed");
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
          <input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} className="input-base" />
        </Field>
        <Field label="Confirm password">
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-base" />
        </Field>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft"
        >
          Reset password
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
