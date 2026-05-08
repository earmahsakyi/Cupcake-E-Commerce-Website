import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { otpStore, usersStore } from "@/admin/store";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!usersStore.byEmail(email)) {
      setError("No account found with this email.");
      return;
    }
    const code = otpStore.generate(email);
    toast.success(`OTP sent to ${email}`, { description: `Demo OTP: ${code}` });
    navigate(`/admin/reset?email=${encodeURIComponent(email)}`);
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
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft"
        >
          Send OTP
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
