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
let id_cita;
 
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
       let ii = i.rows.length+1;
        const { nombreusuario, clave,tipousuario } = req.body; 
        
            await pool.query("insert into usuarios(id_usuario,nombreusuario,clave, tipousuario) values ("+ii+",'" + nombreusuario + "','" + clave + "','"+ tipousuario + "')");
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

async function getDocEspecifico(req,res) {
    try {
        let datos = await pool.query("select * from doctor where id_doctor="+id_us);
            res.json(datos.rows);  

    } catch (error) { 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.get("/getDocEspecifico", getDocEspecifico);


//Obtener citas medicas
async function getCitas(req, res) {
    try {
        let datos = await pool.query("select * from citas"); 
        id_cita=datos.rows[0].id_citas;
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

//Obtener diagnostico
async function getDiag(req, res) {
    try {
        let datos = await pool.query("select * from diagnosticos"); 
        res.json(datos.rows);   
    } catch (error) {
        console.log(error); 
    }
}
app.get("/getDiag", getDiag);


// Registrar citas
async function regCitas(req, res) {
    try {
        
        const { fecha,motivo,doc} = req.body;  

            let datos = await pool.query("select id_doctor from doctor where nombre='"+doc+"'"); 
            let i= await pool.query("select * from citas");
            let ii = i.rows.length+1; 

            await pool.query("insert into citas(id_citas,id_paciente,id_doctor,fecha,estado,motivo) values (" +  
            ii+","+id_us+","+ datos.rows[0].id_doctor+",'"+fecha + "','Pendiente'"+ ",'"+ motivo + "')");
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
        
        const { diagnostico,medi, dieta,costo,doctor,id_cita} = req.body;

        let i= await pool.query("select * from diagnosticos");
        let ii = i.rows.length+1;


            await pool.query("insert into diagnosticos(id_diagnostico,diagnostico,medicamento, dieta,costo,doctor) values (" +
            ii+",'"+diagnostico + "','" + medi + "','"+ dieta +"',"+costo+",'Sebastian')");

            await pool.query("UPDATE citas SET estado = 'Atendida'  WHERE id_citas = "+1);
              res.json({ message: " agregado exitosamente" });
     
       

    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.post("/regDiagnostico", regDiagnostico);


//Registrar medicamentos
async function regMedi(req, res) {
    try {
        
        const { nombre,laboratorio,cantidad,costo,uso,efectos_secundarios} = req.body;  

        
            let i= await pool.query("select * from medicamentos");
            let ii = i.rows.length+1;

            await pool.query("insert into medicamentos(id_medicamento,nombre,laboratorio,cantidad,costo,uso,efectos_secundarios) values (" + 
            ii+",'"+nombre+"','"+laboratorio+"',"+cantidad+","+costo+",'"+uso+"','"+efectos_secundarios+"')");
              res.json({ message: " agregado exitosamente" }); 
        
    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.post("/regMedi", regMedi);

//Agregar medicamentos
async function aggMedi(req, res) {
    try {
        
        const { id_medicamento,cant} = req.body;   

            await pool.query("UPDATE medicamentos SET cantidad = "+cant+" WHERE id_medicamento = "+id_medicamento);
              res.json({ message: " agregado exitosamente" }); 
        
    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.post("/aggMedi", aggMedi);

//Registrar dietas
async function regDietas(req, res) {
    try {
        const { nombre,lunes,martes,miercoles,jueves,viernes,sabado,domingo,costo} = req.body;  

        
        let i= await pool.query("select * from dietas");
        let ii = i.rows.length+1;

        await pool.query("insert into dietas(id_dietas,nombre,lunes,martes,miercoles,jueves,viernes,sabado,domingo,costo) values (" + 
        ii+",'"+nombre+"','"+lunes+"','"+martes+"','"+miercoles+"','"+jueves+"','"+viernes+"','"+sabado+"','"+domingo+"',"+costo+")");
          res.json({ message: " agregado exitosamente" }); 
        
        
    } catch (error) {
        console.log(error); 
        res.json({ message: " Valor ingresado no valido" });
    }
} 
app.post("/regDietas", regDietas);
