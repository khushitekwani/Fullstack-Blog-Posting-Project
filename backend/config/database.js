const mysql = require("mysql2");

const connection = mysql.createPool({
    host: "blog-posting-sot-f7af.d.aivencloud.com",
    port: 13215,
    user: "avnadmin",
    password: "AVNS_-H6fKoCyP4f4KXZO29U",
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: false
    },
})

connection.getConnection((err, con) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`Connected to Database `)
    }
})


module.exports = connection.promise();
