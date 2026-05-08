import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Cake } from "lucide-react";

const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) => (
  <main className="min-h-screen bg-gradient-warm">
    <div className="container flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft">
            <Cake className="h-5 w-5" />
          </span>
          <span className="font-serif text-2xl font-semibold text-foreground">Sweet Crumbs</span>
        </Link>
        <div className="rounded-3xl bg-card p-7 shadow-card sm:p-9">
          <h1 className="font-serif text-2xl text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  </main>
);

export default AuthShell;
