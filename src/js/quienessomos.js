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

// document.addEventListener('DOMContentLoaded', () => {
//     const secciones = document.querySelectorAll('.seccion');
//     const botones = document.querySelectorAll('.link-box');

//     function mostrarContenido(seccionId) {
//       // Oculta todas las secciones y actualiza botones
//       secciones.forEach(div => {
//         div.classList.remove('visible');
//       });
//       botones.forEach(btn => {
//         btn.classList.remove('activo');
//         btn.setAttribute('aria-selected', 'false');
//       });

//       // Muestra la sección seleccionada
//       const objetivo = document.getElementById(seccionId);
//       if (objetivo) {
//         objetivo.classList.add('visible');
//       }

//       // Marca el botón correspondiente como activo
//       const boton = document.querySelector(`.link-box[data-target="${seccionId}"]`);
//       if (boton) {
//         boton.classList.add('activo');
//         boton.setAttribute('aria-selected', 'true');
//       }
//     }

//     // Asigna listeners a los botones
//     botones.forEach(btn => {
//       btn.addEventListener('click', () => {
//         const target = btn.getAttribute('data-target');
//         if (target) {
//           mostrarContenido(target);
//         }
//       });
//     });

//     // Inicializa: si ninguna sección tiene .visible, muestra la primera
//     const algunaVisible = Array.from(secciones).some(s => s.classList.contains('visible'));
//     if (!algunaVisible && secciones[0]) {
//       mostrarContenido(secciones[0].id);
//     } else {
//       // Asegura que el botón correspondiente esté activo al cargar
//       const visible = document.querySelector('.seccion.visible');
//       if (visible) {
//         mostrarContenido(visible.id);
//       }
//     }
//   });
document.addEventListener('DOMContentLoaded', () => {
  // === Valores / ODS ===
  const seccionesValores = document.querySelectorAll('.seccion');
  const botonesValores = document.querySelectorAll('.link-box');

  function mostrarContenidoValores(seccionId) {
    seccionesValores.forEach(div => {
      div.classList.remove('visible');
    });
    botonesValores.forEach(btn => {
      btn.classList.remove('activo');
      btn.setAttribute('aria-selected', 'false');
    });

    const objetivo = document.getElementById(seccionId);
    if (objetivo) objetivo.classList.add('visible');

    const boton = document.querySelector(`.link-box[data-target="${seccionId}"]`);
    if (boton) {
      boton.classList.add('activo');
      boton.setAttribute('aria-selected', 'true');
    }
  }

  botonesValores.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) mostrarContenidoValores(target);
    });
  });

  // Asegura estado inicial
  const algunaVisible = Array.from(seccionesValores).some(s => s.classList.contains('visible'));
  if (!algunaVisible && seccionesValores[0]) {
    mostrarContenidoValores(seccionesValores[0].id);
  } else {
    const visible = document.querySelector('.seccion.visible');
    if (visible) mostrarContenidoValores(visible.id);
  }

  // === Misión / Visión ===
  const contenido = document.getElementById('contenido');
  const tabBtns = document.querySelectorAll('.tab-btn');

  const textos = {
    mision: "Promover la comercialización justa y digna para apoyar el desarrollo rural a través de un comercio digital dedicado a agricultores y fabricantes de café, cacao y cerveza artesanal, nacidos de la sustitución de cultivos ilícitos; buscando el empoderamiento de estos productores, para generar un impacto social positivo ofreciendo a los consumidores alternativas conscientes, saludables y responsables.",
    vision: "Queremos consolidarnos como la primera plataforma líder en Colombia de comercialización de productos agrícolas derivados de la sustitución de cultivos ilícitos, promoviendo un modelo de economía legal, sostenible y solidaria.\n\nBuscamos un país en donde las comunidades rurales que decidieron dejar atrás los cultivos ilícitos encuentren no solo reconocimiento, sino también oportunidades reales de crecimiento económico y social por medio de sus productos. Aspiramos a ser un puente confiable entre los productores y las redes de consumidores que valoran el origen, esfuerzo y la historia detrás de cada producto.\n\nSoñamos con una Colombia en donde la producción y la vida agrícola sean una decisión rentable y segura, esto lo lograremos fortaleciendo la visibilidad, la calidad y el impacto de cada producto vendido en nuestra plataforma con el fin de crear una nueva historia en el campo Colombiano."
  };

  function mostrarTexto(opcion) {
    if (!contenido) return;

    // Actualiza pestañas
    tabBtns.forEach(btn => {
      const target = btn.getAttribute('data-target');
      if (target === opcion) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Transición
    contenido.classList.add('fade-out');
    setTimeout(() => {
      contenido.innerHTML = textos[opcion].replace(/\n/g, "<br>"); 
      contenido.classList.remove('fade-out');
    }, 400);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) mostrarTexto(target);
    });
  });

  // Estado inicial misión
  mostrarTexto('mision');
});