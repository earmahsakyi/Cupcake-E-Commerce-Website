import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/admin/AuthShell";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { registerAdmin, loadAdmin, clearError } from "@/store/slices/adminAuthSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { passwordChecks } from "@/lib/utils";


const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.adminAuth);
  const [form, setForm] = useState({ name: "", email: "", password: "",password2:"", secretKey: "" });
  const [showPassword, setShowPassword] = useState(false);
  


  useEffect(()=> {
    if(error) {
      dispatch(clearError())
    }
  },[error,dispatch])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit =async  (e: FormEvent) => {
    e.preventDefault();
    
    if(form.password !== form.password2){
      toast.error('Password do not match!');
      return;
    };
    const {password2, ...registerData} = form; 
    try {
      const result = await dispatch(registerAdmin(registerData)).unwrap();

      await dispatch(loadAdmin());
      toast.success(`Welcome back, ${result.name.split(" ")[0]}!`);
      navigate("/admin");
    } catch (err) {
        console.error('Failed to register Admin',err)
    }




  };

  return (
    <AuthShell
      title="Create admin account"
      subtitle={`Requires the admin secret key`}
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
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={set("password")} className="input-base" placeholder="At least 8 characters" min={8} />
            <button type='button' className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={()=> setShowPassword(!showPassword)}
            >
                {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </button>
         </div>
         <ul className="mt-3 space-y-1 text-sm">
              {
                passwordChecks.map((check, index) => {
                  const passed = check.test(form.password);
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
        <Field label="Confirm Password">
            <input type={showPassword ? 'text' : 'password'} required value={form.password2} onChange={set("password2")} className="input-base" placeholder="At least 8 characters" min={8} />
        </Field>
        <Field label="Admin secret key">
          <input required value={form.secretKey} onChange={set("secretKey")} className="input-base" placeholder="Provided by company owner" />
        </Field>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
        >
          {status === 'loading' ? "Creating…" : "Create account"}
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
