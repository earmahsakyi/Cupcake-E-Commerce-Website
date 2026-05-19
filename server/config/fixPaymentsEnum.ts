import pool from "./db.js";

const fixPaymentsEnum = async () => {
    try {
        // First, check current ENUM values
        const [result]: any = await pool.query(`
            SELECT COLUMN_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'payments' 
            AND COLUMN_NAME = 'momo_network'
        `);

        console.log('Current ENUM:', result[0]?.COLUMN_TYPE);

        // Fix the ENUM to use correct Paystack values
        await pool.execute(`
            ALTER TABLE payments 
            MODIFY COLUMN momo_network ENUM('mtn', 'vod', 'tgo') NOT NULL
        `);

        console.log('✅ Fixed momo_network ENUM to: mtn, vod, tgo');

        // Update any existing records (if you have telecel values stored)
        await pool.execute(`
            UPDATE payments 
            SET momo_network = 'vod' 
            WHERE momo_network = 'telecel'
        `);

        console.log('✅ Updated existing telecel records to vod');

        await pool.end();
    } catch (error) {
        console.error('Error fixing ENUM:', error);
        await pool.end();
        process.exit(1);
    }
};

fixPaymentsEnum();