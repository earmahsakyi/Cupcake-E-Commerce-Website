import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import AdminLayout from "@/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/index";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearMutateError,
} from "@/store/slices/productsSlice";
import { Product, ProductVariant } from "@/store/types";
import { formatPesewas } from "@/lib/utils";
import { toast } from "sonner";

// ─── Form shape 

type ProductType = 'cupcake' | 'box' | 'custom_cake' | 'other';
const SIZES = ['small', 'medium', 'large', 'signature'] as const;

interface FormState {
    id?: number;
    name: string;
    slug: string;
    short_desc: string;
    description: string;
    product_type: ProductType;
    imagesText: string;       // one URL per line
    flavorsText: string;      // one flavor per line
    // cupcake variants — one row per size
    variants: { size: 'small' | 'medium' | 'large' | 'signature', price_pesewas: string }[];
    // box
    box_slot_count: string;
    box_price_pesewas: string;
}

const emptyForm: FormState = {
    name: '',
    slug: '',
    short_desc: '',
    description: '',
    product_type: 'cupcake',
    imagesText: '',
    flavorsText: '',
    variants: SIZES.map(s => ({ size: s, price_pesewas: '' })),
    box_slot_count: '',
    box_price_pesewas: '',
};

// Auto-generate slug from name
const toSlug = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ─── Component 

const Products = () => {
    const dispatch = useAppDispatch();
    const { items: products, status, mutating, mutateError } = useAppSelector(s => s.products);
    const [form, setForm] = useState<FormState | null>(null);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchProducts());
    }, [dispatch, status]);

    // Show mutate errors as toasts
    useEffect(() => {
        if (mutateError) {
            toast.error(mutateError);
            dispatch(clearMutateError());
        }
    }, [mutateError, dispatch]);

    // ── Open modal 

    const openNew = () => setForm({ ...emptyForm });

    const openEdit = (p: Product) => {
        setForm({
            id: p.id,
            name: p.name,
            slug: p.slug,
            short_desc: p.short_desc,
            description: p.description,
            product_type: p.product_type,
            imagesText: p.images.join('\n'),
            flavorsText: p.flavors.join('\n'),
            variants: SIZES.map(s => {
                const found = p.variants.find(v => v.size === s);
                return { size: s, price_pesewas: found ? String(found.price_pesewas) : '' };
            }),
            box_slot_count: p.box_slot_count != null ? String(p.box_slot_count) : '',
            box_price_pesewas: p.box_price_pesewas != null ? String(p.box_price_pesewas) : '',
        });
    };

    // ── Save

    const save = async () => {
        if (!form) return;

        if (!form.name.trim() || !form.short_desc.trim() || !form.description.trim()) {
            toast.error('Name, short description, and description are required');
            return;
        }

        const slug = form.slug.trim() || toSlug(form.name);
        const images = form.imagesText.split('\n').map(s => s.trim()).filter(Boolean);
        const flavors = form.flavorsText.split('\n').map(s => s.trim()).filter(Boolean);

        // Build variants for cupcakes
        let variants: ProductVariant[] = [];
        if (form.product_type === 'cupcake') {
            variants = form.variants
                .filter(v => v.price_pesewas !== '')
                .map(v => ({ size: v.size, price_pesewas: Number(v.price_pesewas) }));
            if (variants.length === 0) {
                toast.error('Add at least one variant price for a cupcake');
                return;
            }
        }

        // Validate box
        if (form.product_type === 'box') {
            if (!form.box_slot_count || !form.box_price_pesewas) {
                toast.error('Box products need a slot count and price');
                return;
            }
        }

        const payload = {
            name: form.name.trim(),
            slug,
            short_desc: form.short_desc.trim(),
            description: form.description.trim(),
            product_type: form.product_type,
            images,
            flavors,
            variants,
            box_slot_count: form.box_slot_count ? Number(form.box_slot_count) : undefined,
            box_price_pesewas: form.box_price_pesewas ? Number(form.box_price_pesewas) : undefined,
        };

        if (form.id) {
            await dispatch(updateProduct({ id: form.id, data: payload })).unwrap();
            toast.success('Product updated');
        } else {
            await dispatch(createProduct(payload)).unwrap();
            toast.success('Product created');
        }

        // Re-fetch so the list reflects the latest state
        dispatch(fetchProducts());
        setForm(null);
    };

    // ── Delete 

    const remove = async (p: Product) => {
        if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
        await dispatch(deleteProduct(p.id)).unwrap();
        toast.success('Product deleted');
    };

    // ── Helpers

    const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
        setForm(f => f ? { ...f, [k]: v } : f);

    const setVariantPrice = (size: typeof SIZES[number], price: string) =>
        setForm(f => f ? {
            ...f,
            variants: f.variants.map(v => v.size === size ? { ...v, price_pesewas: price } : v)
        } : f);

    // 

    return (
        <AdminLayout>
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Products</h1>
                    <p className="text-sm text-muted-foreground">{products.length} products</p>
                </div>
                <button
                    onClick={openNew}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft"
                >
                    <Plus className="h-4 w-4" /> Add product
                </button>
            </div>

            {/* Loading state */}
            {status === 'loading' && (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {/* Product grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(p => (
                    <div key={p.id} className="overflow-hidden rounded-2xl bg-card border border-border shadow-sm">
                        <div className="relative aspect-[4/3] bg-secondary">
                            {p.images[0] && (
                                <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                            )}
                            <span className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                                {p.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                {p.product_type}
                            </span>
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-serif text-base text-foreground">{p.name}</h3>
                                {p.product_type === 'cupcake' && p.variants.length > 0 && (
                                    <p className="text-xs font-semibold text-primary whitespace-nowrap">
                                        from {formatPesewas(Math.min(...p.variants.map(v => v.price_pesewas)))}
                                    </p>
                                )}
                                {p.product_type === 'box' && p.box_price_pesewas != null && (
                                    <p className="text-xs font-semibold text-primary whitespace-nowrap">
                                        {formatPesewas(p.box_price_pesewas)}
                                    </p>
                                )}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.short_desc}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => openEdit(p)}
                                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                                >
                                    <Pencil className="h-3 w-3" /> Edit
                                </button>
                                <button
                                    onClick={() => remove(p)}
                                    className="ml-auto inline-flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-3 w-3" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {form && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4"
                    onClick={() => setForm(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-card max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif text-xl text-foreground">
                                {form.id ? 'Edit product' : 'New product'}
                            </h3>
                            <button onClick={() => setForm(null)} aria-label="Close">
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">

                            {/* Product type */}
                            <Field label="Product type">
                                <select
                                    className="input-base"
                                    value={form.product_type}
                                    onChange={e => setField('product_type', e.target.value as ProductType)}
                                >
                                    <option value="cupcake">Cupcake</option>
                                    <option value="box">Box</option>
                                    <option value="custom_cake">Custom Cake</option>
                                    <option value="other">Other</option>
                                </select>
                            </Field>

                            {/* Name + auto-slug */}
                            <Field label="Name">
                                <input
                                    className="input-base"
                                    value={form.name}
                                    onChange={e => {
                                        const name = e.target.value;
                                        setForm(f => f ? {
                                            ...f,
                                            name,
                                            slug: f.id ? f.slug : toSlug(name)
                                        } : f);
                                    }}
                                />
                            </Field>

                            <Field label="Slug">
                                <input
                                    className="input-base font-mono text-sm"
                                    value={form.slug}
                                    onChange={e => setField('slug', e.target.value)}
                                    placeholder="auto-generated from name"
                                />
                            </Field>

                            <Field label="Short description">
                                <input
                                    className="input-base"
                                    value={form.short_desc}
                                    maxLength={500}
                                    onChange={e => setField('short_desc', e.target.value)}
                                />
                            </Field>

                            <Field label="Description">
                                <textarea
                                    rows={3}
                                    className="input-base resize-none"
                                    value={form.description}
                                    onChange={e => setField('description', e.target.value)}
                                />
                            </Field>

                            <Field label="Image URLs (one per line)">
                                <textarea
                                    rows={3}
                                    className="input-base resize-none font-mono text-xs"
                                    value={form.imagesText}
                                    onChange={e => setField('imagesText', e.target.value)}
                                    placeholder="https://…"
                                />
                            </Field>

                            <Field label="Flavors (one per line)">
                                <textarea
                                    rows={3}
                                    className="input-base resize-none"
                                    value={form.flavorsText}
                                    onChange={e => setField('flavorsText', e.target.value)}
                                    placeholder="Chocolate&#10;Vanilla&#10;Red Velvet"
                                />
                            </Field>

                            {/* Cupcake variants */}
                            {form.product_type === 'cupcake' && (
                                <div>
                                    <p className="mb-2 text-sm font-semibold text-foreground">
                                        Variant prices (pesewas)
                                    </p>
                                    <div className="space-y-2">
                                        {form.variants.map(v => (
                                            <div key={v.size} className="flex items-center gap-3">
                                                <span className="w-16 capitalize text-sm text-muted-foreground">{v.size}</span>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="input-base flex-1"
                                                    placeholder="e.g. 1000"
                                                    value={v.price_pesewas}
                                                    onChange={e => setVariantPrice(v.size, e.target.value)}
                                                />
                                                {v.price_pesewas && (
                                                    <span className="text-xs text-muted-foreground w-16">
                                                        = {formatPesewas(Number(v.price_pesewas))}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Box config */}
                            {form.product_type === 'box' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Slot count">
                                        <input
                                            type="number"
                                            min={1}
                                            className="input-base"
                                            value={form.box_slot_count}
                                            onChange={e => setField('box_slot_count', e.target.value)}
                                            placeholder="e.g. 6"
                                        />
                                    </Field>
                                    <Field label="Price (pesewas)">
                                        <input
                                            type="number"
                                            min={0}
                                            className="input-base"
                                            value={form.box_price_pesewas}
                                            onChange={e => setField('box_price_pesewas', e.target.value)}
                                            placeholder="e.g. 5000"
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setForm(null)}
                                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={save}
                                disabled={mutating}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
                            >
                                {mutating && <Loader2 className="h-3 w-3 animate-spin" />}
                                {mutating ? 'Saving…' : 'Save'}
                            </button>
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