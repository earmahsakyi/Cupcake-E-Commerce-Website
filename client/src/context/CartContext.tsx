import { createContext, useContext, useEffect, useMemo, useReducer, useState, ReactNode } from "react";

export type CartItem = {
  key: string; // unique per cake + options
  cakeId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  
  // Cupcake fields
  size?: 'small' | 'medium' | 'large';
  selected_flavors?: string[];
  flavor_note?: string;

  // Box fields
  slot_flavors?: { slot_number: number; flavor: string }[];
};

type State = { 
  items: CartItem[] 
};

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; key: string }
  | { type: "SET_QTY"; key: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: State };

const initial: State = {
   items: []
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.key === action.item.key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === action.item.key 
              ? { ...i, quantity: i.quantity + action.item.quantity } 
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.key !== action.key) };
    case "SET_QTY":
      return {
        items: state.items
          .map((i) => (i.key === action.key ? { ...i, quantity: Math.max(1, action.quantity) } : i))
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "key"> & { key?: string }) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initial);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const value = useMemo<Ctx>(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      items: state.items,
      count,
      subtotal,
      addItem: (itemInput) => {
        const item = { ...itemInput } as CartItem;

        // Improved key generation
        const keyParts: string[] = [item.cakeId];

        if (item.size) keyParts.push(`size:${item.size}`);
        if (item.selected_flavors && item.selected_flavors.length > 0) {
          keyParts.push(`flavors:${item.selected_flavors.sort().join(",")}`);
        }
        if (item.slot_flavors && item.slot_flavors.length > 0) {
          const slotsStr = item.slot_flavors
            .map(s => `${s.slot_number}:${s.flavor}`)
            .sort()
            .join("|");
          keyParts.push(`slots:${slotsStr}`);
        }
        if (item.flavor_note) {
          keyParts.push(`note:${item.flavor_note}`);
        }

        const key = item.key ?? keyParts.join("|");

        dispatch({ 
          type: "ADD", 
          item: { ...item, key } 
        });
      },
      removeItem: (key) => dispatch({ type: "REMOVE", key }),
      setQuantity: (key, qty) => dispatch({ type: "SET_QTY", key, quantity: qty }),
      clear: () => dispatch({ type: "CLEAR" }),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [state, isOpen]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};