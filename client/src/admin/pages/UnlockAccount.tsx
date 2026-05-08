import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { ADMIN_SECRET_KEY, auth, otpStore, usersStore } from "@/admin/store";
import { toast } from "sonner";

const UnlockAccount = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (email && usersStore.byEmail(email) && !sent) {
      const code = otpStore.generate(email);
      toast.success(`OTP sent to ${email}`, { description: `Demo OTP: ${code}` });
      setSent(true);
    }
  }, [email, sent]);

  const sendOtp = () => {
    if (!usersStore.byEmail(email)) return setError("No account found with this email.");
    const code = otpStore.generate(email);
    toast.success(`OTP sent to ${email}`, { description: `Demo OTP: ${code}` });
    setSent(true);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      auth.unlockAccount(email.trim(), otp.trim(), secret.trim());
      toast.success("Account unlocked. Please sign in.");
      navigate("/admin/login");
    } catch (err: any) {
      setError(err.message || "Unlock failed");
    }
  };

  return (
    <AuthShell
      title="Unlock account"
      subtitle={`Verify with OTP and admin secret key. (Demo key: ${ADMIN_SECRET_KEY})`}
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
            <button type="button" onClick={sendOtp} className="rounded-2xl border border-border px-3 text-xs font-semibold text-foreground hover:bg-secondary">
              Send OTP
            </button>
          </div>
        </Field>
        <Field label="OTP code">
          <input required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="input-base tracking-widest" placeholder="6-digit code" />
        </Field>
        <Field label="Admin secret key">
          <input required value={secret} onChange={(e) => setSecret(e.target.value)} className="input-base" />
        </Field>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft"
        >
          Unlock
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
