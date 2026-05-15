import { Request, Response } from "express";
import pool from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { CreateOrderBody, CartItem,OrderItemRow, Order } from "../types/order.types.js";
import { generateOrderReference } from "../utils/helper.js";


export const createOrder = asyncHandler(
    async (req: Request, res:Response) => {

        const {customer_name, customer_phone, delivery_address, momo_network, items} = req.body as CreateOrderBody

        //validate items 
        if(!items || items.length === 0){
            throw new AppError('Order must have at least one item',400)
        };

        //creating validatedItem array to add each price
        const validatedItems = [];
        let totalPesewas = 0; 

        for (const item of items){
            let unit_price_pesewas;

            const [row]: any = await pool.query(
                `SELECT id, product_type 
                FROM products 
                WHERE id = ? and is_active = 1`,
                [item.product_id]
            )

            if(!row.length){
                throw new AppError('Product not found!',404)
            }

            const product = row[0];
            
            //check if item.size is missing
            if(product.product_type === 'cupcake'){
                if(item.size === null || item.size === undefined){
                    throw new AppError('Size is required for cupcakes',400)
                }

                const [variants]: any = await pool.query(
                `SELECT price_pesewas 
                FROM cupcake_variants
                WHERE product_id = ? and size = ?`,
                [item.product_id, item.size]
                 );

                if(!variants.length){
                    throw new AppError('Invalid size for this product',400)
                }

                const cupcakeVariant = variants[0];

                unit_price_pesewas = cupcakeVariant.price_pesewas 
            };

            if(product.product_type === 'box'){
                const[box_rows]: any = await pool.query(
                    `SELECT price_pesewas 
                    FROM box_configs
                    WHERE product_id = ?`,
                    [item.product_id]
                );

                if(!box_rows.length){
                    throw new AppError('Box config not found',404)
                };

                const box_config = box_rows[0];

                unit_price_pesewas = box_config.price_pesewas;
            };

            if(product.product_type === 'custom_cake'){
                unit_price_pesewas = 0;
            }

            totalPesewas+= unit_price_pesewas * item.quantity;
            validatedItems.push({...item, unit_price_pesewas});    
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            const reference = generateOrderReference();
            const[result]: any = await connection.execute(
                `INSERT INTO orders(reference, customer_name, customer_phone, delivery_address, total_pesewas, status)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [reference,customer_name,customer_phone,delivery_address,totalPesewas,'pending']
            );
            
            const orderId = result.insertId;
            

            for( const item of validatedItems){
                const size = item?.size ?? null;
                const flavor_note = item?.flavor_note ?? null;
                const selected_flavors = item.selected_flavors ? JSON.stringify(item.selected_flavors) : null;

                const [row]: any = await connection.execute(
                    `INSERT INTO order_items (order_id, product_id, quantity, unit_price_pesewas, size, flavor_note, selected_flavors)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [orderId,item.product_id,item.quantity,item.unit_price_pesewas,size,flavor_note,selected_flavors]
                );

                const orderItemId = row.insertId;

                if (item.slot_flavors && item.slot_flavors.length > 0){
                    for (const slot of item.slot_flavors){
                        const [flavors]: any = await connection.execute(
                        `INSERT INTO box_slot_flavors (order_item_id, slot_number, flavor)
                        VALUES (?, ?, ?)`,
                        [orderItemId,slot.slot_number,slot.flavor]
                    );
                    };
                };
            };
            const url = 'https://api.paystack.co/charge';
            const content = {
                'amount': totalPesewas,
                'email' : `${customer_phone}@placeholder.com`,
                'currency': 'GHS',
                'mobile_money': {
                    'phone': customer_phone,
                    'provider': momo_network
                },
                reference: reference
            }

            const response = await fetch(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                    },
                    body: JSON.stringify(content)
                }
            );

            const data: any = await response.json();

            if (!data.status){
                throw new AppError('Payment initialization failed',502)

            }

            await connection.execute(
                `INSERT INTO payments (order_id, paystack_reference, amount_pesewas, momo_network, phone, status)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId,reference,totalPesewas,momo_network,customer_phone,'pending']
            )


            await connection.commit();
            res.status(201).json({success: true, data: {orderId, reference}})

        } catch(err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release()
        }
    
    }
);

export const getOrderById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const [order]: any = await pool.query(
            `SELECT * FROM orders
            WHERE id = ?`,
            [id]
        );

        if(!order.length){
            throw new AppError('Order not found',404)
        }

        const myOrder = order[0];

        const [orderItems]: any = await pool.query(
            `SELECT oi.id, oi.product_id, p.name as product_name, oi.quantity,
            oi.unit_price_pesewas, oi.size, oi.flavor_note, oi.selected_flavors
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?`,
            [id]
        );

       

        const orderData: Order = {
            id: myOrder.id,
            reference: myOrder.reference,
            customer_name: myOrder.customer_name,
            customer_phone: myOrder.customer_phone,
            delivery_address: myOrder.delivery_address,
            total_pesewas: myOrder.total_pesewas,
            status: myOrder.status,
            is_urgent: myOrder.is_urgent,
            created_at: myOrder.created_at,
            items: orderItems.map((item: any) => ({
                id: item.id,
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price_pesewas: item.unit_price_pesewas,
                size: item.size,
                flavor_note: item.flavor_note,
                selected_flavors: item.selected_flavors ? JSON.parse(item.selected_flavors) : null
            }))
        }

        res.status(200).json({success: true, data: orderData})


    }
);

export const getAllOrders = asyncHandler(
    async (req: Request, res: Response) => {

        const [orders]:any = await pool.query(
            `SELECT * FROM orders
            ORDER BY created_at DESC`
        );

           const [orderItems]: any = await pool.query(
            `SELECT oi.id,oi.order_id, oi.product_id, p.name as product_name, oi.quantity,
            oi.unit_price_pesewas, oi.size, oi.flavor_note, oi.selected_flavors
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            `,
            
        );

        const itemsMap: Record<number, any[]> = orderItems.reduce((map: any, row: any) => {
            if(!map[row.order_id]) map[row.order_id] = [];
            map[row.order_id].push(
                {
                    id: row.id,
                    product_id: row.product_id,
                    product_name: row.product_name,
                    quantity: row.quantity,
                    unit_price_pesewas: row.unit_price_pesewas,
                    size: row.size,
                    flavor_note: row.flavor_note,
                    selected_flavors: row.selected_flavors ? JSON.parse(row.selected_flavors) : null
                }
            )
            return map
        }, {} );


        const data: Order[] = orders.map((order: any) => ({
            ...order,
            items: itemsMap[order.id] || []
        }));

        res.status(200).json({success: true, orders: data})


    }
);