
function loadSectionVentas(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");
  if (section === "ventas") {
    breadcrumb.textContent = "Dashboards / Ver todas las ventas";

    // Verificar autenticación usando el API service
    if (!isAuthenticated()) {
      window.location.href = '/src/pages/login.html';
      return;
    }

    // Mostrar loading
    content.innerHTML = `
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    `;
    // Usar la función del API service
    obtenerVentas()
      .then(ventas => {
        if (ventas) {
          mostrarVentas(ventas);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        content.innerHTML = '<div class="alert alert-danger">Error al cargar ventas</div>';
      });

  } else {
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }

  function mostrarVentas(ventas) {
    const content = document.getElementById("main-content");

    if (ventas.length === 0) {
      content.innerHTML = `
        <h3>Lista de ventas</h3>
        <p>No hay ventas registradas.</p>
      `;

    } else {
      content.innerHTML = `
        <h3 class="mb-5">Lista de ventas</h3>
        <table id="tabla-ventas" class="table table-hover">
          <thead>
            <tr class="table-primary">
              <th>Fecha</th>
              <th>No. Productos</th>
              <th>Subtotal</th>
              <th>Inpuestos</th>
              <th>Descuento</th>
              <th>Domicilio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${ventas.map((v) =>
        `
              <tr>
                <td>${v.fecha}</td>
                <td>${v.cantidad}</td>
                <td>$${v.subtotal}</td>
                <td>$${v.impuestos}</td>
                <td>$${v.descuento}</td>
                <td>$${v.domicilio}</td>
                <td>$${v.total}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      new DataTable("#tabla-ventas", {
        responsive: true,
        autoWidth: false,
        language: {
          decimal: "",
          emptyTable: "No hay información",
          info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
          infoEmpty: "Mostrando 0 a 0 de 0 Entradas",
          infoFiltered: "(Filtrado de _MAX_ total entradas)",
          thousands: ",",
          lengthMenu: "Mostrar _MENU_ Entradas",
          loadingRecords: "Cargando...",
          processing: "Procesando...",
          search: "Buscar:",
          zeroRecords: "Sin resultados encontrados",
          paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
          }
        }
      });
    }
  }
}

window.loadSectionVentas = loadSectionVentas;







