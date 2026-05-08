import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session, sessionStore } from "./store";

type Ctx = { session: Session; refresh: () => void };
const AuthCtx = createContext<Ctx>({ session: null, refresh: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session>(sessionStore.get());
  useEffect(() => sessionStore.subscribe(() => setSession(sessionStore.get())), []);
  return <AuthCtx.Provider value={{ session, refresh: () => setSession(sessionStore.get()) }}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
