const buscador = document.getElementById("buscador");
const botonBuscador = document.getElementById("boton_buscador");

//cuando apretemos enter en el buscador tomaremos el valor ingresado y le mostraremos los productos en comun
buscador.addEventListener("keydown",(e)=>{
    if(e.key == "Enter"){
        if(e.target.value.length > 0){
            window.location.href = `/ordenar/?producto=${e.target.value}`;
            buscador.value = "";
        }
    }
})

//cuando apretemos en la lupita tomaremos el valor del input y le mostraremos los productos en comun
botonBuscador.addEventListener("click",()=>{
    let value = buscador.value;
    if(value.length >0){
        window.location.href = `/ordenar/?producto=${value}`;
        buscador.value = "";
    }
})

const headerTitulo = document.querySelector(".header_titulo");

headerTitulo.addEventListener("click",()=>{
    window.location.href = "/"
})

const selectProductos = document.getElementById("select_productos");

const obtenerValorSelect = ()=>{
    //cada ves que el valor del select cambia el evento se va ejecutar
    selectProductos.addEventListener("change",(e)=>{
        //le mostramos los productos en concreto
        window.location.href = `/tipoProducto/?producto=${e.target.value}`
    })
}

obtenerValorSelect()

const contenedorCarrito = document.querySelector(".contenedor_carrito");

//modificamos el numero de productos agregados en el carrito, en caso de que sea 0, no lo mostramos
const modificarCantidadCarrito = ()=>{
    let contenedorCantidad = contenedorCarrito.lastElementChild.firstElementChild;
    contenedorCantidad.innerHTML = localStorage.length;
    contenedorCantidad.innerHTML == 0 ? contenedorCantidad.style.display = "none" : contenedorCantidad.style.display = "block"
}


const contenedorProductos = document.querySelector(".contenedor_productos");

//modificamos la cantidad del productos en el local storage en caso de que ya haya agregado el producto con anterioridad
const verificarProductoAgregado = (nombreProducto)=>{
    //recorremos el local storage
    for(let i = 0; i < localStorage.length ;i++){
        //obtenemos la key
        const key = localStorage.key(i);
        //obtenemos el valor de la key
        const data = localStorage.getItem(key);
        //lo convertimos a json
        const objectData = JSON.parse(data);
        //si el nombre del producto coincide con el del local storage modificamos su cantidad
        if(objectData.nombre == nombreProducto){
            objectData.cantidad += 1;
            localStorage.setItem(nombreProducto,JSON.stringify(objectData));
            return true
        }
    }
}

//funcion para quitar el signo precio
const quitarSignoPrecio = (precio)=>{
    if(precio.includes("$")){
        let nuevoPrecio = precio.replace("$","");
        return parseInt(nuevoPrecio)
    }
    return parseInt(precio)
}

//funcion para remover el punto en caso de que el precio lo contenga
const quitarPunto = (precio)=>{
    if(precio.includes(".")){
        let nuevoPrecio = precio.replace(".","");
        return quitarSignoPrecio(nuevoPrecio)
    }
    return quitarSignoPrecio(precio);
}


//agregamos el producto al local storage
const agregarAlLocalStorage = (nombreProducto,precioProducto,imagenProducto)=>{
    if(!verificarProductoAgregado(nombreProducto)){
        let infoProducto = {
            nombre: nombreProducto,
            cantidad : 1,
            precio : `$${quitarPunto(precioProducto)}`,
            imagen : imagenProducto
        }
        localStorage.setItem(nombreProducto,JSON.stringify(infoProducto));
    }
}

//notificacion de toastify para avisar al usuario que el producto ha sido agregado correctamente
const notificacionToastify = (data)=>{
    Toastify({
        text: data,
        duration: 1500,
        className: "info",
        position : "left",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
}

//agregamos el producto a el carro
const agregarAlCarrito = (nombreProducto,precioProducto,imagenProducto)=>{
        //agregamos el producto al local storage
        agregarAlLocalStorage(nombreProducto,precioProducto,imagenProducto);
        //notificamos que el producto fue agregado correctamente
        notificacionToastify("Producto añadido con exito");
        modificarCantidadCarrito();
}

const sumarAlCarro = ()=>{
    //recorremos cada hijo del contenedor de productos
    for(let i in contenedorProductos.childNodes){
        let hijos = contenedorProductos.childNodes[i].lastElementChild;
        //en caso de que el hijo sea un objeto le agregamos el evento click
        if(typeof hijos == "object"){
            hijos.addEventListener("click", (e)=>{
            let contenedorPadre = e.target.closest(".contenedor_productos__producto");
            let imagenProducto = contenedorPadre.firstElementChild.firstElementChild.getAttribute("src");
            let precioProducto = contenedorPadre.children[1].children[1].textContent;
            let nombreProducto = contenedorPadre.children[1].firstElementChild.textContent;
            agregarAlCarrito(nombreProducto,precioProducto,imagenProducto);
        })
        }
    }
}

//cuando window se recarge
window.addEventListener("load",()=>{
    //mostramos la cantidad de productos agregados en el carrito
    modificarCantidadCarrito();
})


sumarAlCarro();

//cuando el usuario le de click al carrito se le redireccionara a su carrito de compras
contenedorCarrito.addEventListener("click",()=>{
    window.location.href = "/miCarrito";
})

