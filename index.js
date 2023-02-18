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
 
//Obtener datos de prueba
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



//Registrar usuario
async function regUsuario(req, res) {
    try {
        
        const { nombreusuario, clave,tipousuario } = req.body; 
            await pool.query("insert into usuarios(nombreusuario,clave, tipousuario) values ('" + nombreusuario + "','" + clave + "','"+ tipousuario + "')");
              res.json({ message: " agregado exitosamente" });
        
    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.post("/regUsuario", regUsuario);

//Obtener usuario
async function getUsuario(req, res) {
    try {
        
        const { nombreusuario, clave,tipousuario } = req.body; 
            await pool.query("select * from usuarios");
              res.json({ message: " agregado exitosamente" });
        
    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.get("/getUsuario", getUsuario);


//Obtener citas medicas
async function getCitas(req, res) {
    try {
        let datos = await pool.query("select * from citas"); 
        res.json(datos.rows); 
        console.log(datos.rows);
       

    } catch (error) {
        console.log(error);
        console.log("hola");
    }
}
app.get("/getCitas", getCitas);

// Registrar diagnosticos
async function regDiagnostico(req, res) {
    try {
        
        const { diagnostico,medicamentos, dietas} = req.body; 
            await pool.query("insert into diagnostico(diagnostico,medicamentos, dietas) values ('" + diagnostico + "','" + medicamentos + "','"+ dietas + "')");
              res.json({ message: " agregado exitosamente" });
              console.log("aaaa");
        
    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.post("/regDiagnostico", regDiagnostico);