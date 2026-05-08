import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.MYSQLUSER);
console.log(process.env.MYSQLHOST);

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


export const testMySQLConnection = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection()
        console.log('MySQL connected successfully')
        connection.release()

    } catch(err){
        console.error('MySQL connection failed',err)
        process.exit(1)

    }

};


export default pool;