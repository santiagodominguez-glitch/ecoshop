// =============================================================
// Ecoshop: el formulario de contacto
// Al enviar, no se recarga la pagina: se muestra un aviso de gracias.
// =============================================================

// Busca el formulario y el espacio del aviso
const formulario = document.querySelector("#formulario-contacto");
const aviso = document.querySelector("#aviso");

// Evento "submit": se dispara al oprimir "Enviar" (solo si los campos obligatorios estan llenos)
formulario.addEventListener("submit", function (evento) {
    // preventDefault evita que el navegador recargue la pagina
    evento.preventDefault();
    // Lee el nombre escrito para saludar
    const nombre = document.querySelector("#nombre").value;
    // Escribe el aviso con un template string (clases de Bootstrap: alert alert-success)
    aviso.innerHTML = `<div class="alert alert-success" role="alert">¡Gracias, ${nombre}! Recibimos tu mensaje y te responderemos pronto.</div>`;
    // Deja el formulario vacio otra vez
    formulario.reset();
});
