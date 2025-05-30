const mysql = require("mysql2");

const connection = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "2003",
    database: "nextjs_post"
})

connection.getConnection((err, con) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`Connected to Database `)
    }
})


module.exports = connection.promise();