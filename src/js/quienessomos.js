document.addEventListener('DOMContentLoaded', () => {

  const contenidoMisionVision = document.getElementById('contenido-mision-vision');
  const tabBtnsMisionVision = document.querySelectorAll('.tab-btn-mision-vision');
  const contenidoValoresOds = document.getElementById('contenido-valores-ods');
  const tabBtnsValoresOds = document.querySelectorAll('.tab-btn-valores-ods');

  const textos = {
    mision: `<p>Promover la comercialización justa y digna para apoyar el desarrollo rural a través de un comercio digital dedicado 
                a agricultores y fabricantes de café, cacao y cerveza artesanal, nacidos de la sustitución de cultivos ilícitos; buscando el empoderamiento de estos productores, para generar un impacto social positivo ofreciendo a los consumidores alternativas conscientes, saludables y responsables.</p>`,
    vision: `<p>Queremos consolidarnos como la primera plataforma líder en Colombia de comercialización de productos agrícolas derivados de la sustitución
             de cultivos ilícitos, promoviendo un modelo de economía legal, sostenible y solidaria.</p>
             <p>Aspiramos a ser un puente confiable entre los productores y las redes de consumidores que valoran el origen, esfuerzo y la historia 
             detrás de cada producto. Soñamos con una Colombia en donde la producción y la vida agrícola sean una decisión rentable y segura</p>`,
    valores: `<p class="titulo-pequeno">
                Más que productos, compartimos valores que marcan la diferencia
              </p>
              <ul class="valores-lista">
                <li>🌿 Innovación</li>
                <li>🌿 Compromiso</li>
                <li>🌿 Excelencia</li>
                <li>🌿 Responsabilidad</li>
                <li>🌿 Colaboración</li>
                <li>🌿 Calidad Académica</li>
              </ul>`,
    ods: `<p class="titulo-pequeno">
            Más allá del sabor, trabajamos por un futuro sostenible
          </p>
          <ul class="valores-lista">
            <li>🌍 Fin de la pobreza</li>
            <li>⚖️ Igualdad de género</li>
            <li>♻️ Producción y consumo responsables</li>
            <li>🤝 Alianzas para lograr los objetivos</li>
            <li>🛠️ Trabajo decente</li>
          </ul>`
  };

  tabBtnsMisionVision.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtnsMisionVision.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const target = btn.getAttribute('data-target');
      mostrarTexto(target);
    });
  });

  tabBtnsValoresOds.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtnsValoresOds.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const target = btn.getAttribute('data-target');
      mostrarTexto(target);
    });
  });

  function mostrarTexto(opcion) {

    if (opcion == 'mision' || opcion == 'vision') {
      if (!contenidoMisionVision) return;

      // Transición
      contenidoMisionVision.classList.add('fade-out');
      setTimeout(() => {
        contenidoMisionVision.innerHTML = textos[opcion];
        contenidoMisionVision.classList.remove('fade-out');
      }, 200);

    } else {
      if (!contenidoValoresOds) return;

      // Transición
      contenidoValoresOds.classList.add('fade-out');
      setTimeout(() => {
        contenidoValoresOds.innerHTML = textos[opcion];
        contenidoValoresOds.classList.remove('fade-out');
      }, 200);
    }
  }

  // Estado inicial misión
  mostrarTexto('mision')
  mostrarTexto('valores');

});