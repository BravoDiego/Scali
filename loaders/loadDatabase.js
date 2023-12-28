import mysql from "mysql";

export default async () => {
    let db = await mysql.createConnection({
        host: "localhost",
        user: "id18671989_diego",
        password: "Cugy$1757",
        database: "id18671989_scali"
    });

    return db;
}