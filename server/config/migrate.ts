import pool from "./db.js";

const runMigrations = async (): Promise<void> => {
    //first table is product since it has no Fk on it and all other tables depends on it
    const createProducts =  `
            CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            short_desc VARCHAR(500) NOT NULL,
            description TEXT NOT NULL,
            product_type ENUM('cupcake', 'box', 'custom_cake', 'other') NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`;

    const createProductImages = `
        CREATE TABLE IF NOT EXISTS product_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            url VARCHAR(1000) NOT NULL,
            sort_order INT NOT NULL DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`;

    const createProductFlavors =  `
        CREATE TABLE IF NOT EXISTS product_flavors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        flavor_name VARCHAR(500) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`;
    
    const createCupcakeVariants =  `
        CREATE TABLE IF NOT EXISTS cupcake_variants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            size ENUM('small', 'medium', 'large') NOT NULL,
            price_pesewas INT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`;
    
    const createBoxConfigs = `
        CREATE TABLE IF NOT EXISTS box_configs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            slot_count INT NOT NULL,
            price_pesewas INT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE 
        )`;

        //added is_urgent so that the admin can toggle between urgent orders
    const createOrders = `
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            reference VARCHAR(100) NOT NULL UNIQUE,
            customer_name VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(20) NOT NULL,
            delivery_address TEXT NOT NULL,
            total_pesewas INT NOT NULL,
            status ENUM('pending', 'paid', 'processing', 'delivered', 'cancelled') NOT NULL,
            is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            delivery_date DATE NULL,
            notes TEXT NULL,
        )`;

    const createOrderItems = `
        CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            unit_price_pesewas INT NOT NULL,
            size ENUM('small', 'medium', 'large') NULL,
            flavor_note TEXT NULL,
            selected_flavors JSON NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
        )`;
    
    const createBoxSlotFlavors = `
        CREATE TABLE IF NOT EXISTS box_slot_flavors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_item_id INT NOT NULL,
            slot_number INT NOT NULL,
            flavor VARCHAR(100) NOT NULL,
            FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
        )`;

    const createCustomCakeRequest = `
        CREATE TABLE IF NOT EXISTS custom_cake_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_item_id INT NOT NULL,
            description TEXT NOT NULL,
            budget_pesewas INT NULL,
            status ENUM('pending_quote', 'quoted', 'accepted', 'rejected') NOT NULL DEFAULT 'pending_quote',
            quoted_price_pesewas INT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
        )`;

        
    const createPayments = `
        CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            paystack_reference VARCHAR(100) NOT NULL UNIQUE,
            amount_pesewas INT NOT NULL,
            momo_network ENUM('mtn', 'vod', 'tgo') NOT NULL,
            phone VARCHAR(20) NOT NULL,
            status ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
            paid_at DATETIME NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT
        )`;
    
    const createTransactions = `
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type ENUM('revenue', 'expense') NOT NULL,
            amount_pesewas INT NOT NULL,
            description VARCHAR(500) NOT NULL,
            source ENUM('order', 'manual') NOT NULL,
            order_id INT NULL,
            recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
        )`;

    const createSMSLogs = `
        CREATE TABLE IF NOT EXISTS sms_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            phone VARCHAR(20) NOT NULL,
            message TEXT NOT NULL,
            trigger_type ENUM('manual', 'payment', 'out_for_delivery') NOT NULL,
            sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )`;


        //put them in a list
    const migrations = [
        createProducts,
        createProductImages,
        createProductFlavors,
        createCupcakeVariants,
        createBoxConfigs,
        createOrders,
        createOrderItems,
        createBoxSlotFlavors,
        createCustomCakeRequest,
        createPayments,
        createTransactions
    ]
    
    //run all migrations here

    for (const migration of migrations){
       await pool.execute(migration)
    };

    console.log('Migrations ran successfully!')
} ;

runMigrations()
    .then(()=> pool.end())
    .catch(err => {
        console.error(err);
        pool.end();
        process.exit(1);
    })