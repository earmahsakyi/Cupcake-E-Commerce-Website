import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { productsStore } from "@/admin/store";
import { useStore } from "@/admin/useStore";
import { formatGHS } from "@/data/cakes";
import { AdminProduct } from "@/admin/types";
import { toast } from "sonner";

type FormState = { id?: string; name: string; price: string; description: string; imagesText: string; active: boolean };
const empty: FormState = { name: "", price: "", description: "", imagesText: "", active: true };

const Products = () => {
  const products = useStore(productsStore);
  const [editing, setEditing] = useState<FormState | null>(null);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (p: AdminProduct) =>
    setEditing({ id: p.id, name: p.name, price: String(p.price), description: p.description, imagesText: p.images.join("\n"), active: p.active });

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.price) return toast.error("Name and price are required");
    const price = Number(editing.price);
    if (!Number.isFinite(price) || price < 0) return toast.error("Invalid price");
    const images = editing.imagesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const data = { name: editing.name.trim(), price, description: editing.description.trim(), images, active: editing.active };
    if (editing.id) {
      productsStore.update(editing.id, data);
      toast.success("Product updated");
    } else {
      productsStore.add({ id: "P-" + Math.random().toString(36).slice(2, 8), ...data });
      toast.success("Product added");
    }
    setEditing(null);
  };

  const remove = (p: AdminProduct) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    productsStore.remove(p.id);
    toast.success("Product deleted");
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl bg-card border border-border shadow-sm">
            <div className="relative aspect-[4/3] bg-secondary">
              {p.images[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />}
              <span className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                {p.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-base text-foreground">{p.name}</h3>
                <p className="font-semibold text-primary">{formatGHS(p.price)}</p>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button onClick={() => openEdit(p)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => productsStore.update(p.id, { active: !p.active })}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  {p.active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => remove(p)} className="ml-auto inline-flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-card max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-foreground">{editing.id ? "Edit product" : "New product"}</h3>
              <button onClick={() => setEditing(null)} aria-label="Close"><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="mt-4 space-y-4">
              <Field label="Name">
                <input className="input-base" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Price (GHS)">
                <input type="number" min={0} className="input-base" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
              </Field>
              <Field label="Description">
                <textarea rows={3} className="input-base resize-none" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </Field>
              <Field label="Image URLs (one per line)">
                <textarea rows={3} className="input-base resize-none font-mono text-xs" value={editing.imagesText} onChange={(e) => setEditing({ ...editing, imagesText: e.target.value })} placeholder="/images/cake.jpg&#10;https://…" />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                Active (visible to customers)
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">Cancel</button>
              <button onClick={save} className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
    {children}
  </label>
);

export default Products;
