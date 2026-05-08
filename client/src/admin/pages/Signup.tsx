import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { ADMIN_SECRET_KEY, auth } from "@/admin/store";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", secret: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) return setError("All fields are required.");
    setLoading(true);
    try {
      auth.signup(form.name.trim(), form.email.trim(), form.password, form.secret.trim());
      toast.success("Account created! Welcome.");
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create admin account"
      subtitle={`Requires the admin secret key. (Demo key: ${ADMIN_SECRET_KEY})`}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/admin/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name">
          <input required value={form.name} onChange={set("name")} className="input-base" placeholder="Ama Mensah" />
        </Field>
        <Field label="Email">
          <input type="email" required value={form.email} onChange={set("email")} className="input-base" placeholder="you@bakery.com" />
        </Field>
        <Field label="Password">
          <input type="password" required value={form.password} onChange={set("password")} className="input-base" placeholder="At least 6 characters" />
        </Field>
        <Field label="Admin secret key">
          <input required value={form.secret} onChange={set("secret")} className="input-base" placeholder="Provided by company owner" />
        </Field>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
        >
          {loading ? "Creating…" : "Create account"}
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

export default Signup;
