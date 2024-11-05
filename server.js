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

app.use(express.json());

app.post("/ticket", (req, res) => {
    const ticket = req.body;
    pool.query('INSERT INTO ticket (summary, priority, status ) values ( ?, ?, ? )', [ticket.summary, ticket.priority, ticket.status], (error, result) => {
        if( error ) {
            console.error(error);
            res.send(error);
            return;
        }

        res.send({ id: result.insertId, ...ticket });
    });
});

app.put("/ticket", (req, res) => {
    const ticket = req.body;
    pool.query('UPDATE ticket SET ? where id = ? ', [ticket, ticket.id], (error, result) => {
        if( error ) {
            console.error(error);
            res.send(error);
            return;
        }

        res.send(ticket);
    });
})

app.delete('/ticket/:id', (req, res) => {
    const id = req.params.id;
    pool.query('delete FROM ticket where id = ?', [id], (error, result) => {
        if (error){
            console.error(error);
            res.send(error);
            return;
        } 

        res.send("success");
    });
});

app.get('/ticket/:id', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM ticket where id = ?', [id], (error, result) => {
        if (error){
            console.error(error);
            res.send(error);
            return;
        } 

        res.send(result);
    });
});

app.get("/all", (req, res) => {
    pool.query('SELECT * FROM ticket', (error, result) => {
        if (error){
            console.error(error);
            res.send(error);
            return;
        } 

        res.send(result);
    });
})

app.listen(3000, () => {
    console.log('server started on port 3000');
});