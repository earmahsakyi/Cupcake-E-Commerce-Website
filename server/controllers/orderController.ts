import { Request, Response } from "express";
import pool from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { CreateOrderBody, CartItem,OrderItemRow, Order,SubmitOtpBody } from "../types/order.types.js";
import { generateOrderReference } from "../utils/helper.js";

// Add this mapping at the top of the file
const mapToPaystackProvider = (network: string): string => {
    const providerMap: Record<string, string> = {
        'mtn': 'mtn',
        'telecel': 'vod',      // Telecel uses Vodafone's USSD (*110#)
        'vodafone': 'vod',     // Vodafone Cash
        'airteltigo': 'tgo'    // AirtelTigo Money
    };
    return providerMap[network] || 'mtn';
};

export const createOrder = asyncHandler(
    async (req: Request, res:Response) => {

        const {customer_name, customer_phone, delivery_address, momo_network, items, notes, delivery_date} = req.body as CreateOrderBody

        const cleanedNotes = notes?.trim() || null;
        const dateOfDelivery = delivery_date || null;
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
                `INSERT INTO orders(reference, customer_name, customer_phone, delivery_address, total_pesewas, status,notes,delivery_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [reference,customer_name,customer_phone,delivery_address,totalPesewas,'pending',cleanedNotes,dateOfDelivery]
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
            
            const paystackProvider = mapToPaystackProvider(momo_network);
            const url = 'https://api.paystack.co/charge';
            const content = {
                'amount': totalPesewas,
                'email' : `${customer_phone}@placeholder.com`,
                'currency': 'GHS',
                'mobile_money': {
                    'phone': customer_phone,
                    'provider': paystackProvider
                },
                'channels': ['mobile_money_ussd'],
                'reference': reference
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
            console.log('FULL PAYSTACK RESPONSE:', JSON.stringify(data, null, 2));

            if (!data.status){
                throw new AppError('Payment initialization failed',502)

            }

                        // Debug: Log the full response
            console.log('Paystack Response:', {
                status: data.status,
                message: data.message,
                data_status: data.data?.status,
                full_response: data
            });

          
            // Handle successful charge attempt (this is the key fix)
            if (data.message === 'Charge attempted') {
                console.log('✅ Payment charge attempted successfully');
                console.log(`📱 Customer should approve on phone: ${customer_phone}`);
                console.log(`📞 USSD code: ${paystackProvider === 'mtn' ? '*170#' : '*110#'}`);
                // This is success - continue to save payment
            } 
            else {
                // Check for other statuses
                const paymentStatus = data.data?.status;
                
                if (paymentStatus === 'pay_offline') {
                    console.log('Payment requires offline USSD approval - This is NORMAL');
                } 
                else if (paymentStatus === 'success') {
                    console.log('Payment completed immediately');
                }
                else if (paymentStatus === 'pending') {
                    console.log('Payment pending');
                }
                else if (paymentStatus === 'send_pin') {
                    console.log('PIN sent to customer');
                }
                else {
                    // If we don't recognize the response, throw error
                    throw new AppError(`Unexpected Paystack response: ${data.message || 'Unknown error'}`, 502);
                }
            }

            const paystackStatus = data.data?.status as string | undefined;
            const requiresOtp = paystackStatus === 'send_otp';

            await connection.execute(
                `INSERT INTO payments (order_id, paystack_reference, amount_pesewas, momo_network, phone, status)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId,reference,totalPesewas,paystackProvider,customer_phone,'pending']
            )


            await connection.commit();
            res.status(201).json({success: true, data: {orderId, reference, requiresOtp }})

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
        // Fetch slot flavors for each order item
        const [slotFlavors]: any = await pool.query(
            `SELECT bsf.order_item_id, bsf.slot_number, bsf.flavor
            FROM box_slot_flavors bsf
            INNER JOIN order_items oi ON bsf.order_item_id = oi.id
            WHERE oi.order_id = ?`,
            [id]
        );
        const slotFlavorsMap: Record<number, any[]> = slotFlavors.reduce((map: any, row: any) => {
            if (!map[row.order_item_id]) map[row.order_item_id] = [];
            map[row.order_item_id].push({ slot_number: row.slot_number, flavor: row.flavor });
            return map;
        }, {});
       

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
            notes: myOrder.notes,
            delivery_date: myOrder.delivery_date,
            items: orderItems.map((item: any) => ({
                id: item.id,
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                unit_price_pesewas: item.unit_price_pesewas,
                size: item.size,
                flavor_note: item.flavor_note,
                slot_flavors: slotFlavorsMap[item.id] || [],
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

export const submitOtp = asyncHandler(
    async (req:Request, res: Response) => {
        const {otp, reference} = req.body as SubmitOtpBody ;

        const response = await fetch('https://api.paystack.co/charge/submit_otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        },
        body: JSON.stringify({
            reference: reference,
            otp: otp
        })
    });
    
    const data = await response.json();

    if(!data.status){
        throw new AppError('Invalid OTP or OTP expired', 400)
    };
    const paystackStatus = data.data?.status;

    res.status(200).json({ success: true, data: { status: paystackStatus }  })

    }
)