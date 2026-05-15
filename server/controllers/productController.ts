import { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import pool from "../config/db.js";


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