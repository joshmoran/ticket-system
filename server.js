const express = require('express');
const mysql = require('mysql2');

require('dotenv').config();

const app = express();

const options = {
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: 'ticketuser',
    password: process.env.PASSWORD,
    connectionLimit: 10
};

console.log('options: ', options);

const pool = mysql.createPool(options);

app.get('/', (req, res) => {
    pool.query('SELECT * FROM ', (error, result) => {
        if (error){
            console.error(error);
            res.send(error);
            return;
        } 

        res.send(result);
    });
});

app.listen(3000, () => {
    console.log('server started on port 3000');
});