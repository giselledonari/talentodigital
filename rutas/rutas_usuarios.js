const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt =require('bcryptjs')
const bodyParser = require("body-parser");
const jwt=require('jsonwebtoken')
const cookie=require('cookie')
require("dotenv").config();

const {perfil}=require("./middleware.js")
const {registroFormulario,buscarCorreo}=require("../controladores/usuarios_controlador.js")

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/form/registro', async (req, res) => {
    let token=req.cookies.myToken
    let usuario=await perfil(token)

    const email = req.body.email;
    const nombre = req.body.nombre;
    const contrasena = req.body.contrasena;
  
    const contrasena_encript = await bcrypt.hash(contrasena, 8); //para encriptar
  
    try {
      await registroFormulario(email, nombre, contrasena_encript);
      res.render("registro",{mensaje:"Usuario registrado correctamente. Logeate para empezar",usuario:usuario});
    } catch (error) {
      console.error(error);
      res.render("registro",{mensaje:`Error al realizar login. Error: ${err.message}`,usuario:usuario})
    }
});
  
router.post('/form/login', async(req,res)=>{
    let token=req.cookies.myToken
    let usuario=await perfil(token)

    const email = req.body.email;
    const contrasena = req.body.contrasena;
    try{
        let respuesta=await buscarCorreo(email)
        if (respuesta.length==0){
            res.render("login",{mensaje:"Correo no existe",usuario:usuario});
        }
        else{  
        let contrasenaCheck=await bcrypt.compare(contrasena,respuesta[0].password)
        if(contrasenaCheck){
            const token=jwt.sign({
            exp:Math.floor(Date.now()/1000)+60*60*1,//*1 1 hora
            email:email,
            nombre:respuesta[0].nombre
            },process.env.SECRETO)

            res.cookie('myToken', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000*60*60*1
            });

            res.render("login",{mensaje:"Login exitoso. Ahora podras agregar noticias, vuelve al index",usuario:usuario});
        }
        else{
            res.render("login",{mensaje:"Contraseña incorrecta",usuario:usuario});
        }

        }
    }
    catch(err){
        console.log("Error en el login")
        console.log(err)
        res.render("login",{mensaje:`Error al realizar login. Error: ${err.message}`});
    }
})



module.exports = router