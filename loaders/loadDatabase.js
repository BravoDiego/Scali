import mysql from "mysql";

export default async () => {
    let db = await mysql.createConnection({
        host: "sql11.freesqldatabase.com",
        user: "sql11673543",
        password: "9fYn4nYwYB",
        database: "sql11673543"
    });

    return db;
}