const fs = require('fs');
const mysql = require('mysql');

const serverCa = [fs.readFileSync("./cert.pem", "utf8")];
const conn = mysql.createConnection({
    host: process.env.host, user: process.env.user, // Do not use username as it will be collided with host username
    password: process.env.password, database: process.env.database, port: 3306, ssl: {
        rejectUnauthorized: true, ca: serverCa
    }
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("SQL Started!");
});

module.exports = {
    conn,
    executeQuery: async function ({ query, values }) {
        try {
            const results = await conn.query(query, values);
            await conn.end();
            return results;
        } catch (error) {
            let errMsg = error.message.toString();
            let friendlyMessage = 'There are problem talking to database.';

            if (errMsg.includes('Error: connect ECONNREFUSED')) {
                friendlyMessage += ' (ECONNREFUSED)';
            } else if (errMsg.includes('Error: connect ENOENT')) {
                friendlyMessage += ' (ENOENT)';
            } else if (errMsg.includes('ER_EMPTY_QUERY')) {
                return [];
            } else if (errMsg.includes('ER_DUP_ENTRY')) {
                friendlyMessage = 'Data already exists!';
            } else if (errMsg.includes('ER_PARSE_ERROR: You have an error in your SQL syntax;')) {
                friendlyMessage += ' (SQL Syntax Error ):)';
            } else if (errMsg.includes('ER_BAD_NULL_ERROR')) {
                friendlyMessage += ' (Data cannot be NULL!)';
            }

            error.userError = friendlyMessage;
            console.error(error);
            return { error };
        }
    }
}