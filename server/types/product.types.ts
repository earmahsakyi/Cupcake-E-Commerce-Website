/**Things to capture 
 * 1 What comes out of the database concerning products
 * 2 What your API sends to the frontend
 * 3 What comes from the admin when creating a product */ 

// what comes from the database
export interface ProductRow {
    id: number;
    name: string;
    slug: string;
    short_desc: string;
    description: string;
    product_type: 'cupcake' | 'box' | 'custom_cake' | 'other';
    is_active: boolean;
    created_at: Date;
}

export interface CupcakeVariantRow {
    id: number;
    product_id: number;
    size: 'small' | 'medium' | 'large';
    price_pesewas: number;
}

export interface ProductFlavorRow {
    id: number;
    product_id: number;
    flavor_name: string; 
}

export interface ProductImageRow {
    id: number;
    product_id: number;
    url: string;
    sort_order: number
}

export interface BoxConfigRow {
    id: number;
    product_id: number;
    slot_count: number;
    price_pesewas: number;
}

//Api to the frontend
export interface ProductVariant {
    size: 'small' | 'medium' | 'large';
    price_pesewas: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    short_desc: string;
    description: string;
    product_type: 'cupcake' | 'box' | 'custom_cake' | 'other';
    images: string[];
    flavors: string[];
    variants: ProductVariant[];
    box_slot_count: number | null;
    box_price_pesewas: number | null;
    is_active: boolean;
}

//what comes in from the admin
export interface CreateProductBody {
    name: string;
    slug: string;
    short_desc:string;
    description: string;
    product_type: 'cupcake' | 'box' | 'custom_cake' | 'other';
    images: string[];
    flavors: string[];
    variants?: ProductVariant[];
    box_slot_count?: number;
    box_price_pesewas?: number;
}