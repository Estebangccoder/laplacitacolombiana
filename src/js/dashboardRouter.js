// dashboardRouter.js
function loadSection(section) {
  // Home
  if (section === "home") {
    loadSectionHome(section);

  // Productos
  } else if (section === "agregar-producto" || section === "ver-productos") {
    loadSectionProducts(section);

  // Productores
  } else if (section === "agregar-productor" || section === "ver-productores") {
    loadSectionProductor(section);

  // Usuarios
  } else if (section === "ver-usuarios") {
    loadSectionUsuarios(section);

  // Ventas
  } else if (section === "ventas") {
    loadSectionVentas(section);

  // Si no coincide nada
  } else {
    const content = document.getElementById("main-content");
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }
}

// Exponer en window
window.loadSection = loadSection;
loadSection("home");
