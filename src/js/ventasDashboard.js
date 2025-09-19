
function loadSectionVentas(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");
  if (section === "ventas") {
    breadcrumb.textContent = "Dashboards / Ver todas las ventas";

    const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");

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
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${ventas.map((v, index) =>
        `
              <tr>
                <td>${v.fecha}</td>
                <td>${v.num_productos}</td>
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

  } else {
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }
}

// const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
// if (current && current.rol === 'admin') {
  window.loadSectionVentas = loadSectionVentas;
// } else {
//   const content = document.getElementById("body-dashboard");
//   content.innerHTML = '';
//   content.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
//   content.innerHTML = `
//     <h3 class="mt-5">ACCESO NO AUTORIZADO</h3>
//     <p>Redirigiendo a La Placita Colombiana</p>
//     <div class="spinner-border" role="status">
//       <span class="visually-hidden">Cargando...</span>
//     </div>
//   `
//   setTimeout(() => {
//     window.location.href = '/src/pages/login.html';
//   }, 1000);
// }

// window.addEventListener("storage", () => {
//   const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
//   if (!current || current.rol !== 'admin') {
//     window.location.href = '/src/pages/login.html';
//   }
// });

// window.addEventListener("pagehide", () => {
//   localStorage.removeItem("currentUser");
// });






