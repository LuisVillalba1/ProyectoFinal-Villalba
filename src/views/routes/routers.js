import {Router} from "express";
import productos from "../../productos.js";
import productosFunciones from "../functions/obtenerProductos.js";

const router = Router();

router.get("/",(req,res)=>{
    const productosAComercializar = productosFunciones.obtenerProductos(productos);
    res.render("index",{content : `${productosAComercializar}`});
})

router.get("/listaProductos",(req,res)=>{
    res.send(productos);
})


router.get("/ordenar/",(req,res)=>{
    let valor = req.query.producto.toLocaleLowerCase();
    const productosEncontrados = productosFunciones.obtenerProductosSolicitados(productos,valor);
    res.render("productoObtenido",{content : `${productosEncontrados}`});
})

router.get("/tipoProducto/",(req,res)=>{
    let valor = req.query.producto.toLocaleLowerCase();
    const productosEncontrados = productosFunciones.obtenerProductosSolicitados(productos,valor);
    res.render("productoObtenido",{content : `${productosEncontrados}`})
})

router.get("/miCarrito",(req,res)=>{
    res.render("productosCarrito");
})


router.delete("/eliminarProducto/:producto",(req,res)=>{
    const producto = req.params.producto;

    res.json({ success: true, message: 'Producto eliminado del carrito' })
})


export default router