// function mostrarTexto(opcion) {
//     let contenido = document.getElementById("contenido");
//     let texto = "";

//     if (opcion === "mision") {
//         texto = "Promover la comercialización justa y digna para apoyar el desarrollo rural a través de un comercio digital dedicado a agricultores y fabricantes de café, cacao y cerveza artesanal, nacidos de la sustitución de cultivos ilícitos; buscando el empoderamiento de estos productores, para generar un impacto social positivo ofreciendo a los consumidores alternativas conscientes, saludables y responsables.";
//         document.getElementById("btnMision").classList.add("active");
//         document.getElementById("btnVision").classList.remove("active");
//     } else {
//         texto = "Queremos consolidarnos como la primera plataforma líder en Colombia de comercialización de productos agrícolas derivados de la sustitución de cultivos ilícitos, promoviendo un modelo de economía legal, sostenible y solidaria.\n\nBuscamos un país en donde las comunidades rurales que decidieron dejar atrás los cultivos ilícitos encuentren no solo reconocimiento, sino también oportunidades reales de crecimiento económico y social por medio de sus productos. Aspiramos a ser un puente confiable entre los productores y las redes de consumidores que valoran el origen, esfuerzo y la historia detrás de cada producto.\n\nSoñamos con una Colombia en donde la producción y la vida agrícola sean una decisión rentable y segura, esto lo lograremos fortaleciendo la visibilidad, la calidad y el impacto de cada producto vendido en nuestra plataforma con el fin de crear una nueva historia en el campo Colombiano.";
//         document.getElementById("btnVision").classList.add("active");
//         document.getElementById("btnMision").classList.remove("active");
//     }

//     contenido.classList.add("fade-out");
//     setTimeout(() => {
//         contenido.innerHTML = texto.replace(/\n/g, "<br>");
//         contenido.classList.remove("fade-out");
//     }, 400);
// }

function mostrarTexto(opcion) {
    const contenido = document.getElementById("contenido");
    let texto = "";

    if (opcion === "mision") {
        texto = "Promover la comercialización justa y digna para apoyar el desarrollo rural a través de un comercio digital dedicado a agricultores y fabricantes de café, cacao y cerveza artesanal, nacidos de la sustitución de cultivos ilícitos; buscando el empoderamiento de estos productores, para generar un impacto social positivo ofreciendo a los consumidores alternativas conscientes, saludables y responsables.";
        document.getElementById("btnMision").classList.add("active");
        document.getElementById("btnVision").classList.remove("active");
    } else {
        texto = `Queremos consolidarnos como la primera plataforma líder en Colombia de comercialización de productos agrícolas derivados de la sustitución de cultivos ilícitos, promoviendo un modelo de economía legal, sostenible y solidaria.

Buscamos un país en donde las comunidades rurales que decidieron dejar atrás los cultivos ilícitos encuentren no solo reconocimiento, sino también oportunidades reales de crecimiento económico y social por medio de sus productos. Aspiramos a ser un puente confiable entre los productores y las redes de consumidores que valoran el origen, esfuerzo y la historia detrás de cada producto.

Soñamos con una Colombia en donde la producción y la vida agrícola sean una decisión rentable y segura, esto lo lograremos fortaleciendo la visibilidad, la calidad y el impacto de cada producto vendido en nuestra plataforma con el fin de crear una nueva historia en el campo Colombiano.`;
        document.getElementById("btnVision").classList.add("active");
        document.getElementById("btnMision").classList.remove("active");
    }

    contenido.classList.add("fade-out");

    setTimeout(() => {
        contenido.innerHTML = texto.replace(/\n/g, "<br>");
        contenido.classList.remove("fade-out");
    }, 400);
}

// Inicializa mostrando la misión al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    mostrarTexto("mision");
});

function mostrarContenido(seccion) {
                    // Oculta todas las secciones
                    document.querySelectorAll('.seccion').forEach(div => {
                        div.classList.remove('visible');
                    });

                    // Muestra la sección seleccionada
                    document.getElementById(seccion).classList.add('visible');

                    // Quita la clase 'activo' de todos los botones
                    document.querySelectorAll('.link-box').forEach(btn => {
                        btn.classList.remove('activo');
                    });

                    // Agrega la clase 'activo' al botón clicado
                    const botonActivo = document.querySelector(`.link-box[onclick="mostrarContenido('${seccion}')"]`);
                    if (botonActivo) {
                        botonActivo.classList.add('activo');
                    }
                }