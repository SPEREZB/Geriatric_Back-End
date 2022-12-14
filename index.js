const { Pool } = require('pg');
var cors = require('cors');
const express = require('express');
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '123',
    database: 'geriatric',
    port: '5432'
})
 
//Obtener datos de Cliente
async function verificar(req, res) {
    try {  
        res.json({ message: "BUENO" });
    } catch (error) {
        console.log('aa'); 
        console.log(error);  
        res.json({ message: " Valor ingresado no valido" });
    } 
} 
app.post("/verificar", verificar);
app.listen(3000); 