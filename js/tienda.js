// =============================================================
// Ecoshop: el catalogo, los filtros, el buscador y el carrito
// Cada bloque tiene un comentario: QUE hace y PARA QUE.
// =============================================================

// --- CONSTANTES: valores que no cambian. Se declaran con const ---
const TARIFA = 950;            // lo que cuesta 1 kWh, en pesos (COP). Tarifa de ejemplo
const DIAS_MES = 30;           // dias de un mes: para pasar el ahorro de un dia al de un mes

// --- ARREGLO DE OBJETOS LITERALES: la lista de productos (9 productos, 3 categorias: cocina, climatizacion y oficina) ---
// wattsAntes   = potencia del equipo VIEJO que se reemplaza (vatios, W)
// wattsDespues = potencia del equipo NUEVO (0 si no gasta energia de la red)
// horasDia     = horas de uso al dia
const productos = [
    { id: 1, nombre: "Estufa de inducción 2 puestos", categoria: "cocina", precio: 450000,
      wattsAntes: 3000, wattsDespues: 1800, horasDia: 1.5 },
    { id: 2, nombre: "Hervidor eléctrico eficiente", categoria: "cocina", precio: 85000,
      wattsAntes: 2000, wattsDespues: 1200, horasDia: 0.5 },
    { id: 3, nombre: "Microondas inverter", categoria: "cocina", precio: 380000,
      wattsAntes: 1500, wattsDespues: 900, horasDia: 0.7 },
    { id: 4, nombre: "Ventilador de techo DC", categoria: "climatizacion", precio: 320000,
      wattsAntes: 75, wattsDespues: 30, horasDia: 8 },
    { id: 5, nombre: "Aire acondicionado inverter 12000 BTU", categoria: "climatizacion", precio: 1950000,
      wattsAntes: 1400, wattsDespues: 700, horasDia: 6 },
    { id: 6, nombre: "Ventilador de pedestal DC", categoria: "climatizacion", precio: 190000,
      wattsAntes: 60, wattsDespues: 25, horasDia: 6 },
    { id: 7, nombre: "Monitor LED 24 pulgadas", categoria: "oficina", precio: 420000,
      wattsAntes: 55, wattsDespues: 18, horasDia: 8 },
    { id: 8, nombre: "Portátil eficiente", categoria: "oficina", precio: 2300000,
      wattsAntes: 250, wattsDespues: 45, horasDia: 8 },
    { id: 9, nombre: "Enchufe inteligente con medidor Wi-Fi", categoria: "oficina", precio: 39000,
      wattsAntes: 8, wattsDespues: 0, horasDia: 24 }
];

// --- VARIABLES (let): cambian mientras se usa la pagina ---
let carrito = [];                  // los productos que el usuario agrego. Empieza vacio
let categoriaActual = "todas";     // el filtro elegido: "todas" o una categoria
let textoBusqueda = "";            // lo que se escribio en el buscador

// --- FUNCIONES PROPIAS ---

// ahorroKwhMes: cuantos kWh ahorra un producto en un mes.
// Ejemplo con el monitor: (55 - 18) x 8 x 30 / 1000 = 8.88 kWh
function ahorroKwhMes(producto) {
    return (producto.wattsAntes - producto.wattsDespues) * producto.horasDia * DIAS_MES / 1000;
}

// ahorroPesosMes: cuantos pesos ahorra un producto en un mes (los kWh por la tarifa)
function ahorroPesosMes(producto) {
    return ahorroKwhMes(producto) * TARIFA;
}

// pesos: escribe un numero como plata colombiana. pesos(8900) -> "$8.900"
function pesos(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

// nombreCategoria: el nombre para mostrar, con tilde y mayuscula (en los datos va sin tildes)
function nombreCategoria(categoria) {
    if (categoria === "cocina") {
        return "Cocina";
    } else if (categoria === "climatizacion") {
        return "Climatización";
    } else {
        return "Oficina";
    }
}

// --- DOM: escribir en la pagina las tarjetas de los productos ---
// mostrarProductos: escribe una tarjeta por cada producto que cumpla el filtro Y el buscador.
function mostrarProductos() {
    // Busca el <div id="productos"> (vacio en catalogo.html) y lo vacia
    const contenedor = document.querySelector("#productos");
    contenedor.innerHTML = "";
    // El texto del buscador en minusculas, para que "LED" y "led" den lo mismo
    const busqueda = textoBusqueda.toLowerCase();
    // Cuenta cuantas tarjetas se escriben
    let mostrados = 0;

    // BUCLE for...of: una vuelta por cada producto del arreglo
    for (const producto of productos) {
        // CONDICIONAL del filtro: si hay categoria elegida y el producto es de otra, se salta
        if (categoriaActual !== "todas" && producto.categoria !== categoriaActual) {
            continue;
        }
        // CONDICIONAL del buscador: si el nombre NO contiene lo escrito, se salta
        if (!producto.nombre.toLowerCase().includes(busqueda)) {
            continue;
        }
        mostrados++;
        // TEMPLATE STRING (comillas invertidas): una tarjeta con los datos del producto
        contenedor.innerHTML += `
            <article class="tarjeta">
                <span class="categoria">${nombreCategoria(producto.categoria)}</span>
                <h3>${producto.nombre}</h3>
                <p>Reemplaza un equipo de ${producto.wattsAntes} W por uno de ${producto.wattsDespues} W,
                   usado ${producto.horasDia} h al día.
                   Ahorra <span class="ahorro">${ahorroKwhMes(producto).toFixed(1)} kWh</span> al mes.</p>
                <p class="precio">${pesos(producto.precio)}</p>
                <p>Ahorro al mes: <span class="ahorro">${pesos(ahorroPesosMes(producto))}</span></p>
                <button class="btn btn-primary btn-sm" data-id="${producto.id}">Agregar al carrito</button>
            </article>`;
    }

    // Si ninguna tarjeta cumplio las condiciones, un mensaje
    if (mostrados === 0) {
        contenedor.innerHTML = "<p>No hay productos que coincidan.</p>";
    }
}

// --- El carrito ---

// agregarAlCarrito: busca el producto con ese id y lo agrega al arreglo carrito
function agregarAlCarrito(id) {
    for (const producto of productos) {
        if (producto.id === id) {
            carrito.push(producto);
        }
    }
    mostrarCarrito();
}

// mostrarCarrito: dibuja la lista, el total, el ahorro al mes y en cuantos meses se paga sola la compra
function mostrarCarrito() {
    const lista = document.querySelector("#lista-carrito");
    lista.innerHTML = "";
    // ACUMULADORES: empiezan en 0 y suman en el bucle
    let total = 0;
    let ahorroMes = 0;

    for (const producto of carrito) {
        lista.innerHTML += `<li>${producto.nombre}: ${pesos(producto.precio)}</li>`;
        total += producto.precio;
        ahorroMes += ahorroPesosMes(producto);
    }

    document.querySelector("#total").textContent = "Total: " + pesos(total);

    if (carrito.length === 0) {
        document.querySelector("#ahorro").textContent = "El carrito está vacío.";
    } else {
        // Meses para recuperar la compra: total / ahorro mensual, redondeado HACIA ARRIBA
        const meses = Math.ceil(total / ahorroMes);
        document.querySelector("#ahorro").textContent =
            `Ahorra ${pesos(ahorroMes)} al mes: la compra se paga sola en ${meses} meses.`;
    }
}

// --- EVENTOS: el programa reacciona a lo que hace el usuario ---

// FILTROS: clic en un boton de categoria (o "Todas")
const botonesFiltro = document.querySelectorAll(".filtro");
for (const boton of botonesFiltro) {
    boton.addEventListener("click", function () {
        // Quita la clase "activo" a todos y se la pone solo al boton elegido (se resalta)
        for (const otro of botonesFiltro) {
            otro.classList.remove("activo");
        }
        boton.classList.add("activo");
        // Guarda la categoria elegida (lee data-categoria) y vuelve a dibujar
        categoriaActual = boton.dataset.categoria;
        mostrarProductos();
    });
}

// BUSCADOR: el evento "input" se dispara con CADA letra que se escribe o se borra
document.querySelector("#buscador").addEventListener("input", function (evento) {
    textoBusqueda = evento.target.value;
    mostrarProductos();
});

// "Agregar al carrito": se escucha en el contenedor #productos porque los botones los crea JavaScript
document.querySelector("#productos").addEventListener("click", function (evento) {
    if (evento.target.dataset.id) {
        agregarAlCarrito(Number(evento.target.dataset.id));
    }
});

// "Vaciar carrito": el carrito vuelve a ser un arreglo vacio
document.querySelector("#vaciar").addEventListener("click", function () {
    carrito = [];
    mostrarCarrito();
});

// --- Al cargar la pagina: se muestran todos los productos y el carrito vacio ---
mostrarProductos();
mostrarCarrito();
