import pool from "./db.js";

const seed = async (): Promise<void> => {
    console.log('Seeding products...');

    const [classicCupcake]: any = await pool.query(
        `INSERT INTO products (name, slug, short_desc, description, product_type)
         VALUES (?, ?, ?, ?, ?)`,
        ['Classic Cupcake', 'classic-cupcake', 'Our signature cupcake', 'Soft and fluffy cupcake available in 3 sizes', 'cupcake']
    );

    const [fourPack]: any = await pool.query(
        `INSERT INTO products (name, slug, short_desc, description, product_type)
         VALUES (?, ?, ?, ?, ?)`,
         ['4-Pack Box', '4-pack-box', 'A box of 4 cupcakes', 'Pick your flavors for each slot', 'box']
    );

    const [sixPack]: any = await pool.query(
        `INSERT INTO products (name, slug, short_desc, description, product_type)
         VALUES (?, ?, ?, ?, ?)`,
         ['6-Pack Box', '6-pack-box', 'A box of 6 cupcakes', 'Pick your flavors for each slot', 'box']
    );

    const [customCake]: any = await pool.query(
        `INSERT INTO products (name, slug, short_desc, description, product_type)
         VALUES (?, ?, ?, ?, ?)`,
         ['Custom Cake', 'custom-cake', 'Your dream cake', 'Tell us what you want and we will make it', 'custom_cake']
    );

    const classicCupcakeId = classicCupcake.insertId;
    const fourPackId = fourPack.insertId;
    const sixPackId = sixPack.insertId;
    const customCakeId = customCake.insertId;

    console.log('Products inserted: ',{classicCupcakeId, fourPackId, sixPackId,customCakeId});

    // variants - only classic cupcake has sizes
    await pool.query(
        `INSERT INTO cupcake_variants (product_id, size, price_pesewas) VALUES
        (?, 'small', 1500),
        (?, 'medium', 2500),
        (?, 'large', 3500)`,
        [classicCupcakeId, classicCupcakeId, classicCupcakeId]
    );

    // flavors - all products support these 3 flavors
    const flavorProducts = [classicCupcakeId, fourPackId, sixPackId, customCakeId];
    for (const productId of flavorProducts) {
        await pool.query(
            `INSERT INTO product_flavors (product_id, flavor_name) VALUES
            (?, 'vanilla'), (?, 'chocolate'), (?, 'red velvet')`,
            [productId, productId, productId]
        );
    };

    // box configs - only 4-pack and 6-pack
    await pool.query(
        `INSERT INTO box_configs (product_id, slot_count, price_pesewas) VALUES (?, 4, 8000)`,
        [fourPackId]
    );

    await pool.query(
    `INSERT INTO box_configs (product_id, slot_count, price_pesewas) VALUES (?, 6, 11000)`,
    [sixPackId]
    );

    await pool.query(
    `INSERT INTO product_images (product_id, url, sort_order) VALUES
     (?, '/images/classic-cupcake1.png', 1),
     (?, '/images/classic-cupcake2.png', 1),
     (?, '/images/classic-cupcake3.png', 1),
     (?, '/images/classic-cupcake4.png', 1),
     (?, '/images/4-pack-box1.png', 1),
     (?, '/images/4-pack-box2.png', 1),
     (?, '/images/4-pack-box2.png', 1),
     (?, '/images/6-pack-box.jpg', 1),
     (?, '/images/custom-cake.jpg', 1)`,
    [classicCupcakeId,classicCupcakeId,classicCupcakeId,classicCupcakeId, fourPackId,fourPackId,fourPackId, sixPackId, customCakeId]
    );

    console.log('Seed complete!')
};

seed()
    .then(() => pool.end())
    .catch(err => {
        console.error(err);
        pool.end();
        process.exit(1)
    });