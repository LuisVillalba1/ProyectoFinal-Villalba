//obtenemos todos lo productos que comercializamos
const obtenerProductos = (productos)=>{
    const productosEncontrados = Object.values(productos)
    .flatMap(tipoProducto=>tipoProducto)
    .map(elemento=>`
    <div class="contenedor_productos__producto" id=${elemento.nombre}>
    <div class="contenedor_foto_producto">
        <img src=${elemento.urlImagen}>
    </div>
    <div class="contenedor_descripcion_producto">
        <p class="nombre_producto">${elemento.nombre}</p>
        <p class="precio_producto">$${elemento.precio}</p>
        <div class="contenedor_comprar_producto">
        <div class="contenedor_sumar_al_carro">
            <p>Sumar al carrito</p>
        </div>
    </div>
        <div class="contenedor_carrito_producto">
            <i class="fa-solid fa-cart-shopping"></i>
        </div>
    </div>
</div>
    `)
    .join("");
    return productosEncontrados;
}

//obtenemos los objetos solicitamos por parte del usuario
const obtenerProductosSolicitados = (productos,valor)=>{
    //convertimos los valores de nuestro objeto en un array
    const productosEncontrados = Object.values(productos)
    //convina los array de todos los productos en un unico array
    .flatMap(tipoProducto => tipoProducto)
    //filtramos los productos que tengan el nombre ingresado
    .filter(producto => producto.nombre.toLowerCase().includes(valor))
    //recorremos el array
    .map(elemento=>`
    <div class="contenedor_productos__producto" id=${elemento.nombre}>
        <div class="contenedor_foto_producto">
            <img src=${elemento.urlImagen}>
        </div>
        <div class="contenedor_descripcion_producto">
            <p class="nombre_producto">${elemento.nombre}</p>
            <p class="precio_producto">$${elemento.precio}</p>
        </div>
        <div class="contenedor_comprar_producto">
            <div class="contenedor_sumar_al_carro">
                <p>Sumar al carrito</p>
            </div>
            <div class="contenedor_carrito_producto">
                <i class="fa-solid fa-cart-shopping"></i>
            </div>
        </div>
    </div>
    `)
    //convertimos el array en un string unico
    .join("");
    return productosEncontrados
}

export default {
    obtenerProductosSolicitados,
    obtenerProductos
}