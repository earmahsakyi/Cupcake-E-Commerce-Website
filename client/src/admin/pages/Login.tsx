import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { auth } from "@/admin/store";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      auth.login(email.trim(), password);
      toast.success("Welcome back!");
      navigate("/admin");
    } catch (err: any) {
      if (err.code === "LOCKED") {
        navigate(`/admin/locked?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to Admin"
      subtitle="Manage orders, products and deliveries."
      footer={
        <>
          New admin?{" "}
          <Link to="/admin/signup" className="font-semibold text-primary hover:underline">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
            placeholder="admin@sweetcrumbs.gh"
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <div className="flex items-center justify-between text-sm">
          <Link to="/admin/forgot" className="text-primary hover:underline">
            Forgot password?
          </Link>
          <Link to="/admin/unlock" className="text-muted-foreground hover:text-primary">
            Unlock account
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
        >
          {loading ? "Signing in…" : "Sign in"}
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

export default Login;
