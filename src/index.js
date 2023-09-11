import express from "express";
import {dirname,join} from "path";
import {fileURLToPath} from "url"

//utilizamos express para crear un servidor de manera mas rapida
const app = express();

//obtenemos la direccion de la carpeta actual
const __dirname = dirname(fileURLToPath(import.meta.url));

//utilizamos ejs como motor de plantilla
app.set("view engine","ejs");

//donde se van a encontrar nuestras archivos a renderizar
app.set("views",join(__dirname,"views"));

import router from "./views/routes/routers.js"

//convertimos las solicitudes json en un objeto
app.use(express.json());

//usamos nuestro router
app.use(router);

//decimos en donde se encontraran nuestros archivos estaticos
app.use(express.static(join(__dirname,"public")));

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO,()=>{
    console.log(`El servidor esta escuchando en el puerto ${PUERTO}`);
})
