// === API / Backend origin ===
const BACKEND_ORIGIN = "http://localhost:8080";         // <-- backend
const API_BASE = `${BACKEND_ORIGIN}/api`;                // /api base

// Formato COP (convierte a número si viene como string/BigDecimal)
function precioCOP(valor) {
  return Number(valor).toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Pide productos al catálogo público (DTO) con filtro opcional por categoría y paginación
async function obtenerProductos({ categoria = "todos", page = 0, size = 50 } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);
  if (categoria && categoria !== "todos") params.set("categoria", categoria);

  const res = await fetch(`${API_BASE}/productos/catalogo?${params.toString()}`);
  if (!res.ok) throw new Error("No se pudo cargar el catálogo");
  return res.json(); // Page<ProductoDTO>
}

// Renderización de tarjetas
function renderProductos(lista, idContenedor) {
  const contenedor = document.getElementById(idContenedor);
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = `
      <h3>Lista de productos</h3>
      <p>No hay productos registrados.</p>
    `;
    return;
  }

  lista.forEach(prod => {
    if ((prod.stock ?? 0) > 0) {
      // prod.imagen viene como "/img/productos/archivo.ext" -> forzamos host del backend
      const imgSrc = `${BACKEND_ORIGIN}${prod.imagen}`;

      contenedor.innerHTML += `
        <div class="col">
          <div class="card mb-3 product-h" data-category="${prod.categoria ?? ''}">
            <div class="row g-0 align-items-center my-auto">
              <div class="col-4">
                <img src="${imgSrc}" class="rounded-start product-h-img" alt="${prod.nombre}" />
              </div>
              <div class="col-8">
                <div class="card-body d-flex flex-column justify-content-between h-100">
                  <h5 class="card-title mb-2">${prod.nombre}</h5>
                  <p class="card-text mb-3">${prod.descripcion ?? ""}</p>
                  <ul class="list-unstyled small mb-3">
                    <li>Productor: <a href="#" class="producer-link">${prod.proveedor ?? "—"}</a></li>
                    <li>Presentación: ${prod.presentacion} <span>${prod.unidadMedida}</span></li>
                  </ul>
                  <div class="mt-auto d-flex flex-wrap gap-2 align-items-center">
                    <span class="price mb-0">Precio: $ ${precioCOP(prod.precio)}</span>
                    <button class="btn btn-primary ms-auto agregar-btn val-agregar-btn"
                      data-id="${prod.id}">
                      Agregar a la canasta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }
  });
}

// Filtro por categoría consultando a la API
async function filtrarYCargar(categoriaSeleccionada) {
  const productosPage = await obtenerProductos({ categoria: categoriaSeleccionada });
  renderProductos(productosPage.content, "productosContainer");
}

document.addEventListener("DOMContentLoaded", async () => {
  // Carga inicial (todos)
  try {
    const page = await obtenerProductos({ categoria: "todos" });
    renderProductos(page.content, "productosContainer");
  } catch (e) {
    document.getElementById("productosContainer").innerHTML =
      `<p class="text-danger">Error: ${e.message}</p>`;
  }

  // Manejo de inputs/labels de categoría
  const inputsCategoria = document.querySelectorAll('input[name="categoria"]');
  const labelsCategoria = document.querySelectorAll('.container-category label');

  const labelTodos = document.querySelector('label[for="todos"]');
  if (labelTodos) labelTodos.classList.add('activo');

  inputsCategoria.forEach(input => {
    input.addEventListener("change", async () => {
      await filtrarYCargar(input.value);

      labelsCategoria.forEach(label => label.classList.remove('activo'));
      const labelSeleccionado = document.querySelector(`label[for="${input.id}"]`);
      if (labelSeleccionado) labelSeleccionado.classList.add('activo');
    });
  });

  // Leer ?categoria= del URL (ej. .../catalogo.html?categoria=Cacao)
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  if (categoria) {
    const input = document.getElementById(categoria);
    if (input) {
      input.checked = true;
      input.dispatchEvent(new Event("change"));
      document.querySelector(".filtros")?.scrollIntoView({ behavior: "smooth" });
    }
  }
});

// (Opcional) Refrescar catálogo si cambia el carrito desde otra pestaña
window.addEventListener("storage", async (e) => {
  if (e.key === "carrito") {
    const seleccion = document.querySelector('input[name="categoria"]:checked')?.value || "todos";
    try {
      const page = await obtenerProductos({ categoria: seleccion });
      renderProductos(page.content, "productosContainer");
    } catch (err) {
      console.error(err);
    }
  }
});
