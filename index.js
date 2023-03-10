const { Pool } = require('pg');
var cors = require('cors');
const express = require('express');
const app = express();
const PORT=process.env.PORT || 3977;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());



const pool = new Pool({
    user: 'postgres',
    host: 'containers-us-west-120.railway.app',
    password: 'MyJ2IDjI6LBJIQIimUpT',
    database: 'railway',
    port: '7625'
})

let id_us;
 
//Obtener datos de prueba
async function verificar(req, res) {
    try {  
        //sebas 
        const { nombreusuario, clave } = req.body; 
        let datos,cont=1;  
        let size= await pool.query("select * from usuarios"); 
       for (let i = 1; cont <= size.rows.length; i++) {  
        datos = await pool.query("select nombreusuario,tipousuario from usuarios where id_usuario="+i);
   
        console.log(cont); 
        if(datos.rows.length!=0)
        { 
            cont++;
            console.log(datos.rows[0].nombreusuario);  
        if(datos.rows[0].nombreusuario==nombreusuario)    
        {
            cont=size+1;
            id_us=i;
            res.json({ valor: datos.rows[0].tipousuario}); 
        }
          else{ 
            if(cont>size.rows.length)
            res.json({ message: "CREDENCIALES INCORRECTAS" });
          } 
       }  
    }
 
    } catch (error) { 
        console.log("error");  
        res.json({ message: " Valor ingresado no valido" + error});
    } 
} 
app.post("/verificar", verificar);


app.get("/w", (req,res)=>
{ 
    res.status(200).send({msg:'bienn'});
    res.json({ message: " Valor ingresado no valido" });
});

app.listen(PORT,()=>
{
    console.log('BIENN');
}); 

 
//Registrar usuario
async function regUsuario(req, res) {
    try {
       let i= await pool.query("select * from usuarios");
        const { nombreusuario, clave,tipousuario } = req.body; 
            await pool.query("insert into usuarios(id_usuario,nombreusuario,clave, tipousuario) values ("+i.rows.length+1+",'" + nombreusuario + "','" + clave + "','"+ tipousuario + "')");
              res.json({ message: " agregado exitosamente" });
        
    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.post("/regUsuario", regUsuario);

//Obtener usuario
async function getUsuario(res) {
    try {
            await pool.query("select * from usuarios");
    } catch (error) { 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.get("/getUsuario", getUsuario);


//Obtener doctor
async function getDoc(req,res) {
    try {
        let datos = await pool.query("select * from doctor");
            res.json(datos.rows);  

    } catch (error) { 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.get("/getDoc", getDoc);


//Obtener citas medicas
async function getCitas(req, res) {
    try {
        let datos = await pool.query("select * from citas"); 
        res.json(datos.rows);   
    } catch (error) {
        console.log(error); 
    }
}
app.get("/getCitas", getCitas);

//Obtener dietas
async function getDietas(req, res) {
    try {
        let datos = await pool.query("select * from dietas"); 
        res.json(datos.rows);   
    } catch (error) {
        console.log(error); 
    }
}
app.get("/getDietas", getDietas);


// Registrar citas
async function regCitas(req, res) {
    try {
        
        const { fecha,motivo,doc} = req.body;  

            let datos = await pool.query("select id_doctor from doctor where nombre='"+doc+"'"); 
             
            await pool.query("insert into citas(id_paciente,id_doctor,fecha,estado,motivo) values (" + 
            id_us+","+ datos.rows[0].id_doctor+",'"+fecha + "','Pendiente'"+ ",'"+ motivo + "')");
              res.json({ message: " agregado exitosamente" }); 
        
    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.post("/regCitas", regCitas);


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


//Obtener medicamentos
async function getMedi(req, res) {
    try {
        let datos = await pool.query("select * from medicamentos"); 
        res.json(datos.rows);   
    } catch (error) {
        console.log(error); 
    }
}
app.get("/getMedi", getMedi);