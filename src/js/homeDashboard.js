function loadSectionHome(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "home") {
    breadcrumb.textContent = "Dashboards / Home";

    if (window.chartVentas && typeof window.chartVentas.destroy === 'function') {
      window.chartVentas.destroy();
      window.chartVentas = null;
    }

    if (window.chartInventario && typeof window.chartInventario.destroy === 'function') {
      window.chartInventario.destroy();
      window.chartInventario = null;
    }

    content.innerHTML = `
        <h3>Bienvenido Administrador</h3>
        <div class="mt-5 d-flex flex-column flex-lg-row justify-content-center gap-5">
          <div class=" p-3 border rounded shadow bg-body-tertiary" style="height: 500px; width: 500px;">
            <canvas id="chartVentas"></canvas>
          </div>
          <div class=" p-3 border rounded shadow bg-body-tertiary" style="height: 500px; width: 500px;">
            <canvas id="chartInventario"></canvas>
          </div>
        </div>
      
    `
    setTimeout(() => {
      chartVentas();
      chartInventario();
    }, 0);
  } else {
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }
}

function toggleSubmenu(element) {
  const parent = element.parentElement;
  parent.classList.toggle("open");
}

/*-------------------------------------------------------------------------------------------------
// Chart Ventas
-------------------------------------------------------------------------------------------------*/

function chartVentas() {
  const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");
  const ventasPorMes = {};

  ventas.forEach(v => {
    const [dia, mes, anio] = v.fecha.split('/');
    const mesF = parseInt(mes);
    if (!ventasPorMes[mesF]) {
      ventasPorMes[mesF] = 0;
    }
    ventasPorMes[mesF] += 1;
  });

  const labels = Object.keys(ventasPorMes).map(m => {
    const mes = new Date(2025, m - 1).toLocaleString('es-ES', { month: 'long' });
    return mes.charAt(0).toUpperCase() + mes.slice(1);
  });
  const data = {
    labels: labels,
    datasets: [
      {
        label: "CANTIDAD DE VENTAS POR MES",
        data: Object.values(ventasPorMes),
        borderColor: "rgba(54, 162, 235, 1)",       // azul
        backgroundColor: "rgba(54, 162, 235, 0.5)", // azul transparente
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }
    ]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
        }
      }
    },
  }

  const ctx = document.getElementById("chartVentas");
  new Chart(ctx, config);
}

function chartInventario() {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");
  const ventasPorCategoria = { Cafe: 0, Cacao: 0, Cerveza: 0 };

  productos.forEach(p => {
    ventasPorCategoria[p.categoria] += p.cantidad;
  });

  const labels = Object.keys(ventasPorCategoria)
  const data = {
    labels: labels,
    datasets: [
      {
        label: "CANTIDAD DE PRODUCTOS POR CATEGORIA",
        data: Object.values(ventasPorCategoria),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }
    ]
  };
  const config = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
        }
      }
    },
  }

  const ctx = document.getElementById("chartInventario");
  new Chart(ctx, config);

}

// exit
function handleUserClick() {
  if (!current) return (window.location.href = '/src/pages/login.html'); // [5]
  localStorage.removeItem('currentUser');
  window.location.href = '/src/pages/login.html';
}

const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (current && current.rol === 'admin') {
  window.loadSectionHome = loadSectionHome;
  window.toggleSubmenu = toggleSubmenu;
} else {
  const content = document.getElementById("body-dashboard");
  content.innerHTML = '';
  content.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  content.innerHTML = `
    <h3 class="mt-5">ACCESO NO AUTORIZADO</h3>
    <p>Redirigiendo a La Placita Colombiana</p>
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  `
  setTimeout(() => {
    window.location.href = '/src/pages/login.html';
  }, 1000);
}

window.addEventListener("storage", () => {
  const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!current || current.rol !== 'admin') {
    window.location.href = '/src/pages/login.html';
  }
});