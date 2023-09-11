
//tomamo el titulo y cuando el usuario le de click ahi le redireccionara a la pagina principal
const headerTitulo = document.querySelector(".header_titulo");

headerTitulo.addEventListener("click",()=>{
    window.location.href = "/"
})

//tomamos todos el contenedor que contendra a todos nuestros productos agregados al carro
const contenedorProductosAgregados = document.querySelector(".contenedor_productos_carro");

//cramos un fragmento para luego poder almacenar nuestros productos ahi y posteriormente agregarlos al dom
const fragmento = document.createDocumentFragment();

//creamos una publicacion para cada producto del carro que fue añadido
const crearPublicacion = (nombre,imagen,precio,cantidad)=>{
    const contenedorProducto = document.createElement("div");
    contenedorProducto.classList.add("contenedor_producto");
    const publicacion = `
    <div class="borde_producto">
        <div class="producto">
            <i class="fa-solid fa-trash-can"></i>
            <div class="contenedor_imagen_producto">
                <img src=${imagen}></img>
            </div>
            <div class="contenedor_nombre">
                <p>${nombre}</p>
            </div>
            <div class="contenedor_sumar_restar">
                <i class="fa-solid fa-minus"></i>
                <p>${cantidad}</p>
                <i class="fa-solid fa-plus"></i>
            </div>
            <div class="contenedor_precio_producto">
                <p>${precio}</p>
            </div>
        </div>
    </div>
    `
    contenedorProducto.innerHTML = publicacion;
    fragmento.appendChild(contenedorProducto);
}

//recorremos el local storage y por cada elemento que fue añadido creamos una publicacion de ella
const mostrarProducto = ()=>{
    for(let i = 0; i < localStorage.length ; i++){
        const key = localStorage.key(i);
        const data = localStorage.getItem(key);
        const objectData = JSON.parse(data);
        crearPublicacion(objectData.nombre,objectData.imagen,objectData.precio,objectData.cantidad);
    }
    contenedorProductosAgregados.appendChild(fragmento);
}

mostrarProducto()

//tomamos todos nuestro contenedores de suma y resta de productos,nombre y precios
const contenedorSumarRestar = document.querySelectorAll(".contenedor_sumar_restar");
const contenedorNombreProducto = document.querySelectorAll(".contenedor_nombre");
const contenedorPrecios = document.querySelectorAll(".contenedor_precio_producto")

//modificamos la cantidad del local storage dependiendo de si el usuario quiere sumar o restar productos agregados al carro
const modificarCantidadStorage = (nombre,operacion,cantidad)=>{
    let objectData = JSON.parse(localStorage.getItem(nombre));
        if(operacion == "sumar"){
            objectData.cantidad += 1;
            cantidad.textContent = objectData.cantidad;
            localStorage.setItem(nombre,JSON.stringify(objectData));
        }
        else{
            objectData.cantidad -= 1;
            cantidad.textContent = objectData.cantidad;
            localStorage.setItem(nombre,JSON.stringify(objectData));
        }
}

//funcion que nos servira para poder quitar los signos de precios de los productos 
const quitarSignoPrecio = (precio)=>{
    if(precio.includes("$")){
        let nuevoPrecio = precio.replace("$","");
        return nuevoPrecio
    }
    return precio
}

//le mostramos al usuario dependiendo de la cantidad que haya agregado el precio actua de el producto
const mostrarPrecioActual = (nombreProducto,contenedorPrecio)=>{
    let objectData = JSON.parse(localStorage.getItem(nombreProducto));
    let precio = quitarSignoPrecio(objectData.precio);
    let nuevoPrecio = parseInt(precio) * objectData.cantidad;
    contenedorPrecio.innerHTML = `$${nuevoPrecio.toLocaleString()}`;
}

//impedimos que se siga restando productos en caso de que haya una unidad sola cargada
const impedirResta = (nombreProducto,icono)=>{
    let objectData = JSON.parse(localStorage.getItem(nombreProducto));
    objectData.cantidad == 1 ? icono.style.display = "none" : icono.style.display == "block"
}

//restamos una unidad cada ves que el usuario le de click en el icono correspondiente
const restarProducto = (icono,nombreProducto,contenedorPrecio,cantidad)=>{
    impedirResta(nombreProducto,icono);
    icono.addEventListener("click",()=>{
        modificarCantidadStorage(nombreProducto,"restar",cantidad);
        mostrarPrecioActual(nombreProducto,contenedorPrecio);
        impedirResta(nombreProducto,icono);
        mostarPrecioTotal();
    })
}

//sumamos una unidad cada ves que el usuario le de click en el icono correspondiente
const sumarProducto = (icono,nombreProducto,contenedorPrecio,cantidad)=>{
    icono.addEventListener("click",()=>{
        modificarCantidadStorage(nombreProducto,"sumar",cantidad);
        mostrarPrecioActual(nombreProducto,contenedorPrecio);
        let objectData = JSON.parse(localStorage.getItem(nombreProducto));
        //en caso de que la cantidad del producto sea mayor que uno hacemos que el icono de restar pueda utilizarse de nuevo
        if(objectData.cantidad > 1){
            icono.parentElement.firstElementChild.style.display = "block";
        }
        mostarPrecioTotal()
    })
}

const contenedorPrecioTotal = document.querySelector(".contenedor_total")

const mostarPrecioTotal = ()=>{
    let resultado = 0;
    for(let i = 0; i < localStorage.length ;i++){
        let key = localStorage.key(i);
        let data = localStorage.getItem(key);
        let objectData = JSON.parse(data);
        let precio = parseInt(quitarSignoPrecio(objectData.precio));
        let cantidad = objectData.cantidad;
        resultado += cantidad * precio
    }
    contenedorPrecioTotal.lastElementChild.textContent = `$${resultado.toLocaleString()}`
}


//sumamos y restamos las cantidad de productos que el usuario requiera
const sumarRestarCantidad = ()=>{
    //recorremos todos los contenedores de suma y resta
    for(let i = 0; i < contenedorSumarRestar.length;i++){
        //obtemeos el contenedor de cantidad
        let cantidad = contenedorSumarRestar[i].children[1];
        //el icono de suma y resta
        let restar = contenedorSumarRestar[i].firstElementChild;
        let sumar = contenedorSumarRestar[i].lastElementChild;
        //el nombre del producto y su precio
        let nombreProducto = contenedorNombreProducto[i].firstElementChild.textContent;
        let contenedorPrecio = contenedorPrecios[i];
        //restamos, sumamos y mostramos el precio actual del producto
        restarProducto(restar,nombreProducto,contenedorPrecio,cantidad);
        sumarProducto(sumar,nombreProducto,contenedorPrecio,cantidad);
        mostrarPrecioActual(nombreProducto,contenedorPrecio);
        mostarPrecioTotal();
    }
}

sumarRestarCantidad();

const botonEliminar = document.querySelectorAll(".fa-trash-can");

//notificacion de toastify en la cual avisa que el producto ha sido eliminado correctamente
const notificacionToastify = (data)=>{
    Toastify({
        text: data,
        duration: 1500,
        className: "info",
        position : "right",
        style: {
          background: "linear-gradient(to right, rgb(255, 30, 39), rgb(255, 165, 0))",
        }
      }).showToast();
}

//a cada producto agregado por le damo la opcion de poder removerlo por completo clickeando en icono del tacho
const elimnarProducto = ()=>{
    for(let i = 0; i < botonEliminar.length; i++){
        botonEliminar[i].addEventListener("click",()=>{
            let nombre = botonEliminar[i].parentElement.children[2].firstElementChild.textContent;
            let contenedorPadre = botonEliminar[i].parentElement.parentElement.parentElement;
            //hacemos una peticion fetch para elminar el producto
            fetch(`/eliminarProducto/${nombre}`,{
                method : "DELETE",
            })
            .then(respuesta => respuesta.json())
            .then(data=>{
                //notificamos al usuario que el producto ha sido elminado correctamente
                notificacionToastify(data.message);
                //removemos el producto del local storage
                localStorage.removeItem(nombre);
                //removemos el item del dom y mostramos el precio actual
                contenedorPadre.remove();
                mostarPrecioTotal();
            })
            //en caso de que exista un error se lo hacemos saber al usuario
            .catch(e=>{
                Swal.fire({
                    title: "Error",
                    icon : "error",
                    text : "Ha ocurrido un error",
                    confirmButtonText : "Aceptar",
                    allowEscapeKey : false
                })
            })
        })
    }
}

elimnarProducto();

const botonComprar = document.querySelector(".contenedor_comprar");

//mientra el contendor de cada producto agregado tenga un primer children, lo eliminamos
//con esto logramos que elimine todos los productos agregados al carro
const eliminarCarrito = ()=>{
    while(contenedorProductosAgregados.firstChild){
        contenedorProductosAgregados.removeChild(contenedorProductosAgregados.firstChild);
    }
}

//usamos nuestra api de geolocalizacion para obtener la ubicacion del usuario y el horario
const obtenerDatosUbi = async()=>{
    try{
        const respuesta = await fetch("https://api.ipregistry.co/2800:810:542:97b5:a500:75bd:7360:78df?key=7e2fo2592xzdku6n");
        const info = await respuesta.json();
        //obtenemos la fecha que nos da la api
        let fechaApi = info.time_zone.current_time;
        //creamos un nuevo date con la obtenida
        const date = new Date(fechaApi);
        //obtenemos el dia y horario
        const dia = date.toLocaleDateString();
        const horario = date.toLocaleTimeString();
        //y con la api obtenemos el barrio, ciudad y pais actual
        let barrio = info.location.city;
        let ciudad = info.location.country.capital;
        let pais = info.location.country.name;
        return `${barrio},${ciudad},${pais} el dia ${dia} a las ${horario}`
    }
    catch(e){
        return ""
    }
}

//alerta para mostrarle al usuario que la compra fue efectuada junto a el lugar y horario
const compraExitosa = async()=>{
    Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: 'La compra se ha efectuado con exito en '+ await obtenerDatosUbi(),
      })
}

//creamos una alerta para efectuar la compra con la opcion de aceptar o rechazar
const alertaComprar = ()=>{
    Swal.fire({
        title: "Realizar compra",
        icon : "question",
        showCancelButton: true,
        text : "¿Esta seguro de que quiere realizar la compra?",
        confirmButtonText : "Aceptar",
        confirmButtonColor : "rgb(8, 255, 68)",
        cancelButtonText: "Cancelar",
        cancelButtonColor : "rgb(255, 0, 7)",
        allowEscapeKey : false
    })
    .then((resultado)=>{
        //en caso de que acepte la compra se lo hacemos saber al usuario, limpiamos el storage asi como eliminamos los productos del carrito y el precio total anterior
        if(resultado.isConfirmed){
            compraExitosa();
            localStorage.clear();
            eliminarCarrito();
            mostarPrecioTotal();
        }
    })
}

//en caso de que haya elemento agregados a el carrito realizamos la compra, osino se lo hacemos saber al usuario
const realizarCompra = ()=>{
    botonComprar.addEventListener("click",()=>{
        localStorage.length > 0 ? alertaComprar() : Swal.fire({
            title : "Error",
            icon : "error",
            text : "Su carrito esta actualmente vacio",
        })
    })
}

realizarCompra();
