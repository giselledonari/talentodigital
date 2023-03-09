const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt =require('bcryptjs')
const bodyParser = require("body-parser");
const jwt=require('jsonwebtoken')
const cookie=require('cookie')
require("dotenv").config();

const {perfil}=require("./middleware.js")

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


//rutas pages


router.get("/registro",async (req, res) => {
    let token=req.cookies.myToken
    let usuario=await perfil(token)
    res.render("registro",{mensaje:"",usuario:usuario});
})

router.get("/login", async(req, res) => {
    let token=req.cookies.myToken
    let usuario=await perfil(token)
    res.render("login",{mensaje:"",usuario:usuario});
})

//rutas que traen informacion

router.get("/noticias", async(req, res) => {
    let token=req.cookies.myToken
    let usuario=await perfil(token)
    res.render("noticias",{usuario:usuario,mensaje:""});
})



module.exports = router