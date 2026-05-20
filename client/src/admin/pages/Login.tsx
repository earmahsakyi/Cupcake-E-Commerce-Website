import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { loginAdmin, loadAdmin, clearError } from "@/store/slices/adminAuthSlice";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoggingIn, error} = useAppSelector((state) => state.adminAuth);
  
    useEffect(()=> {
    
    dispatch(clearError())
    
  },[dispatch])


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        loginAdmin({ email: email.trim(), password })
      ).unwrap();

      // await dispatch(loadAdmin());
      toast.success(`Welcome back, ${result.name.split(" ")[0]}!`);
      navigate("/admin");
    } catch (err) {
      if (err === 'LOCKED'){
        navigate(`/admin/locked?email=${encodeURIComponent(email)}`)
      }
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
            placeholder="admin@cupcake.gh"
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
        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
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
          disabled={isLoggingIn}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
        >
          {isLoggingIn ? "Signing in…" : "Sign in"}
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