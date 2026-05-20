import { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import pool from "../config/db.js";
import { CreateProductBody } from "../types/product.types.js";


export const getAllProducts = asyncHandler(
   
    async (req: Request, res: Response) => {
        const [products]: any = await pool.query(
            `SELECT id, name, slug, short_desc, description, product_type, is_active
            FROM products
            WHERE is_active = 1
            ORDER BY id ASC`
        )

        if (!products.length){
            res.json({
                success: true,
                data: []
            })
            return;
        };

        const [variants]: any = await pool.query(
            `SELECT id, product_id, size, price_pesewas
            FROM cupcake_variants`
        );

        const [flavors]: any = await pool.query(
            `SELECT id, product_id, flavor_name
            FROM product_flavors`
        );

        const [boxConfigs]: any = await pool.query(
            `SELECT id, product_id, slot_count, price_pesewas
            FROM box_configs`
        );

        const [images]: any = await pool.query(
            `SELECT product_id, url
            FROM product_images
            ORDER BY sort_order ASC`
        );
        
        const variantMap: Record<number, any[]> = variants.reduce((map: any, row: any)=> {
            if(!map[row.product_id]) map[row.product_id] = [];
            map[row.product_id].push({size: row.size, price_pesewas:row.price_pesewas})
            return map;
        },{});

        const flavorMap: Record<number, string[]> = flavors.reduce((map: any, row: any)=> {
            if(!map[row.product_id]) map[row.product_id] = [];
            map[row.product_id].push(row.flavor_name);
            return map;
        },{});

        const boxConfigMap: Record<number, any> =boxConfigs.reduce((map: any, row: any) => {
            map[row.product_id] = {slot_count: row.slot_count, price_pesewas: row.price_pesewas}
            return map;
        },{});

        const imageMap: Record<number, string[]> = images.reduce((map: any, row: any) => {
            if (!map[row.product_id]) map[row.product_id] = [];
            map[row.product_id].push(row.url);
            return map;
        }, {});

        // getting all products with their match tables in data[]
        const data = products.map((product: any) =>  ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            short_desc: product.short_desc,
            description: product.description,
            product_type: product.product_type,
            is_active: product.is_active,
            images: imageMap[product.id] || [],
            variants: variantMap[product.id] || [],
            flavors: flavorMap[product.id] || [],
            box_slot_count: boxConfigMap[product.id]?.slot_count ?? null,
            box_price_pesewas: boxConfigMap[product.id]?.price_pesewas ?? null
        }));

        res.status(200).json({success: true, data})
    }   
);

export const getProductById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
    
        const [rows]: any = await pool.query(
            `SELECT id, name, slug, short_desc, description, product_type, is_active
             FROM products
             WHERE id = ? and is_active = 1`,
             [id]
        );

        if(!rows.length){
            throw new AppError('Product not found',404);
        }

        const product = rows[0];

        const [variants]: any = await pool.query(
            `SELECT size, price_pesewas
            FROM cupcake_variants
            WHERE product_id = ?`,
            [id]
        );

        const [flavors]: any = await pool.query(
            `SELECT flavor_name
            FROM product_flavors
            WHERE product_id = ?`,
            [id]
        );

        const [boxConfigs]: any = await pool.query(
            `SELECT slot_count, price_pesewas
            FROM box_configs
            WHERE product_id = ?`,
            [id]
        );

        const [images]: any = await pool.query(
            `SELECT url
            FROM product_images
            WHERE product_id = ?
            ORDER BY sort_order ASC`,
            [id]
        );

        const boxConfig = boxConfigs[0] || null;

        res.status(200).json({
            success: true,
            data : {
                id: product.id,
                name: product.name,
                slug: product.slug,
                short_desc: product.short_desc,
                description: product.description,
                product_type: product.product_type,
                is_active: product.is_active,
                images: images.map((i: any) => i.url),
                variants: variants,
                flavors: flavors.map((f: any) => f.flavor_name),
                box_slot_count: boxConfig?.slot_count ?? null,
                box_price_pesewas: boxConfig?.price_pesewas ?? null,       
            }
        })

    }
);


 
export const createProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const {
            name, slug, short_desc, description, product_type,
            images = [], flavors = [], variants = [],
            box_slot_count, box_price_pesewas
        } = req.body as CreateProductBody;
 
        // Basic validation
        // if (!name?.trim() || !slug?.trim() || !short_desc?.trim() || !description?.trim() || !product_type) {
        //     throw new AppError('name, slug, short_desc, description, and product_type are required', 400);
        // }
 
        if (product_type === 'cupcake' && variants.length === 0) {
            throw new AppError('Cupcake products must have at least one variant', 400);
        }
 
        if (product_type === 'box' && (box_slot_count == null || box_price_pesewas == null)) {
            throw new AppError('Box products must have slot_count and box_price_pesewas', 400);
        }

        if (flavors.length === 0) {
            throw new AppError('Product must have at least one flavor',400);
        };

        if( images.length === 0) {
            throw new AppError('Product must have at least one image',400);
        }
 
        const connection = await pool.getConnection();
        await connection.beginTransaction();
 
        try {
            // 1. Insert into products
            const [result]: any = await connection.execute(
                `INSERT INTO products (name, slug, short_desc, description, product_type)
                 VALUES (?, ?, ?, ?, ?)`,
                [name.trim(), slug.trim(), short_desc.trim(), description.trim(), product_type]
            );
            const productId = result.insertId;
 
            // 2. Insert images
            for (let i = 0; i < images.length; i++) {
                await connection.execute(
                    `INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)`,
                    [productId, images[i], i]
                );
            }
 
            // 3. Insert flavors
            for (const flavor of flavors) {
                await connection.execute(
                    `INSERT INTO product_flavors (product_id, flavor_name) VALUES (?, ?)`,
                    [productId, flavor]
                );
            }
 
            // 4. Insert cupcake variants
            if (product_type === 'cupcake') {
                for (const variant of variants) {
                    await connection.execute(
                        `INSERT INTO cupcake_variants (product_id, size, price_pesewas) VALUES (?, ?, ?)`,
                        [productId, variant.size, variant.price_pesewas]
                    );
                }
            }
 
            // 5. Insert box config
            if (product_type === 'box') {
                await connection.execute(
                    `INSERT INTO box_configs (product_id, slot_count, price_pesewas) VALUES (?, ?, ?)`,
                    [productId, box_slot_count, box_price_pesewas]
                );
            }
 
            await connection.commit();
            res.status(201).json({ success: true, data: { productId } });
 
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
);
 

 
export const updateProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const {
            name, slug, short_desc, description, product_type,
            images, flavors, variants,
            box_slot_count, box_price_pesewas
        } = req.body as Partial<CreateProductBody>;
 
        // Check product exists
        const [rows]: any = await pool.query(
            `SELECT id, product_type FROM products WHERE id = ?`,
            [id]
        );
        if (!rows.length) throw new AppError('Product not found', 404);
 
        const connection = await pool.getConnection();
        await connection.beginTransaction();
 
        try {
            // 1. Update core product fields (only what was sent)
            const fields: string[] = [];
            const values: any[] = [];
 
            if (name !== undefined)         { fields.push('name = ?');         values.push(name.trim()); }
            if (slug !== undefined)         { fields.push('slug = ?');         values.push(slug.trim()); }
            if (short_desc !== undefined)   { fields.push('short_desc = ?');   values.push(short_desc.trim()); }
            if (description !== undefined)  { fields.push('description = ?');  values.push(description.trim()); }
            if (product_type !== undefined) { fields.push('product_type = ?'); values.push(product_type); }
 
            if (fields.length > 0) {
                values.push(id);
                await connection.execute(
                    `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
                    values
                );
            }
 
            // 2. Replace images if sent
            if (images !== undefined) {
                await connection.execute(`DELETE FROM product_images WHERE product_id = ?`, [id]);
                for (let i = 0; i < images.length; i++) {
                    await connection.execute(
                        `INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)`,
                        [id, images[i], i]
                    );
                }
            }
 
            // 3. Replace flavors if sent
            if (flavors !== undefined) {
                await connection.execute(`DELETE FROM product_flavors WHERE product_id = ?`, [id]);
                for (const flavor of flavors) {
                    await connection.execute(
                        `INSERT INTO product_flavors (product_id, flavor_name) VALUES (?, ?)`,
                        [id, flavor]
                    );
                }
            }
 
            // 4. Replace variants if sent
            if (variants !== undefined) {
                await connection.execute(`DELETE FROM cupcake_variants WHERE product_id = ?`, [id]);
                for (const variant of variants) {
                    await connection.execute(
                        `INSERT INTO cupcake_variants (product_id, size, price_pesewas) VALUES (?, ?, ?)`,
                        [id, variant.size, variant.price_pesewas]
                    );
                }
            }
 
            // 5. Replace box config if sent
            if (box_slot_count !== undefined || box_price_pesewas !== undefined) {
                await connection.execute(`DELETE FROM box_configs WHERE product_id = ?`, [id]);
                if (box_slot_count != null && box_price_pesewas != null) {
                    await connection.execute(
                        `INSERT INTO box_configs (product_id, slot_count, price_pesewas) VALUES (?, ?, ?)`,
                        [id, box_slot_count, box_price_pesewas]
                    );
                }
            }
 
            await connection.commit();
            res.status(200).json({ success: true });
 
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
);
 

 
export const deleteProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
 
        const [rows]: any = await pool.query(
            `SELECT id FROM products WHERE id = ?`,
            [id]
        );
        if (!rows.length) throw new AppError('Product not found', 404);
 
        await pool.execute(
            `UPDATE products SET is_active = 0 WHERE id = ?`,
            [id]
        );
 
        res.status(200).json({ success: true });
    }
);
 