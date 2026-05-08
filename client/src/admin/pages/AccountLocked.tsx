import { Link, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import AuthShell from "@/admin/AuthShell";

const AccountLocked = () => {
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  return (
    <AuthShell
      title="Account locked"
      subtitle="Your account has been locked due to multiple failed login attempts."
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl bg-destructive/10 p-4 text-destructive">
          <Lock className="h-6 w-6" />
          <div className="text-sm">
            <p className="font-semibold">{email || "Your account"}</p>
            <p>5 failed sign-in attempts detected.</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          To restore access, you'll need an OTP and the admin secret key.
        </p>
        <Link
          to={`/admin/unlock?email=${encodeURIComponent(email)}`}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft"
        >
          Unlock account
        </Link>
        <Link to="/admin/login" className="block text-center text-sm text-muted-foreground hover:text-primary">
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
};

export default AccountLocked;
