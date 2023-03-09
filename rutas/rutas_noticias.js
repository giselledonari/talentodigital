const express = require("express");
const router = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
const {perfil,uploadImage}=require("./middleware.js");
const { agregarNoticia,dataNoticias,dataNoticiaId } = require("../controladores/noticias_controlador.js");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", async(req, res) => {
    let token=req.cookies.myToken
    let usuario=await perfil(token) 
    let data=await dataNoticias()
    res.render("index",{usuario:usuario,data:data});
})


router.post('/form/noticia', uploadImage.single("imagen"), async (req, res) => {
    let token=req.cookies.myToken
    let usuario=await perfil(token)

    const autor = usuario.email
    const titular = req.body.titular;
    const imagen =req.file.filename;
    const categoria =parseInt(req.body.categoria);
    const cuerpo =req.body.cuerpo;
  
    try {
        console.log(autor,titular,imagen,categoria)
      await agregarNoticia(titular,cuerpo,imagen,autor,categoria);
      res.redirect("/")
    } catch (error) {
      console.error(error);
      res.render("noticias",{usuario:usuario,mensaje:"Error al subir la noticia, reintente"})
    }

});

router.get("/noticia/:id", async(req, res) => {
    let token=req.cookies.myToken
    let usuario=await perfil(token)

    let id = req.params.id;

    try{
        let dataNoticia= await dataNoticiaId(id)
        res.render("noticia",{usuario:usuario, data: dataNoticia});
    }catch(err){
        console.log(err)
    }

});

module.exports = router