
function loadSectionProductor(section) {
    const content = document.getElementById("main-content");
    const breadcrumb = document.getElementById("breadcrumb");

    if (section === "agregar-productor") {
        breadcrumb.textContent = "Dashboards / Gestión de proveedores / Agregar productor";
        fetch("/src/pages/agregar-productor.html")
            .then(res => res.text())
            .then(html => {
                content.innerHTML = html;
                // liveValidations(inputsProductores());
            })
            .catch(err => {
                content.innerHTML = "<p>Error al cargar la sección.</p>";
                console.error("Error al cargar agregar-productor.html:", err);
            });
    } else if (section === "ver-productores") {
        breadcrumb.textContent = "Dashboards / Gestión de productos / Ver todos los productores";

        const productores = JSON.parse(localStorage.getItem("productores") || "[]");

        if (productores.length === 0) {
            content.innerHTML = `
        <h3>Lista de productos</h3>
        <p>No hay productos registrados.</p>
      `;

        } else {
            content.innerHTML = `
        <h3 class="mb-5">Lista de productores</h3>
        <table id="tabla-productoress" class="table table-hover">
          <thead>
            <tr class="table-primary">
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${productores.map((p, index) =>
                `
              <tr>
                <td>${p.nombre}</td>
                <td>
                  <button type="button" class="btn btn-success" onclick="editarProductor(${index})">
                    <i class="bi bi-pen"></i>
                  </button>
                  <button type="button" class="btn btn-danger" onclick="eliminarProductor(${index})">
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
        }

        new DataTable("#tabla-productores", {
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

    } else {
        breadcrumb.textContent = `Dashboards / ${section}`;
        content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
    }
}

function guardarProductor(event) {
    event.preventDefault();

    if (!validateForm(inputsProductores())) {
        Swal.fire({
            icon: "error",
            title: "Hay campos incorrectos",
            showConfirmButton: false,
            timer: 1500
        });
        return
    }

    const input = document.getElementById("nombre-productor");
    const nombre = input.value.trim();

    validateName(input, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/)

    const productores = JSON.parse(localStorage.getItem("productores") || "[]");
    // Verificar si el nombre ya existe (ignorando mayúsculas/minúsculas y espacios extras)
    let existe = productores.some(p => p.nombre.trim().toLowerCase() === input.value.trim().toLowerCase());
    if (!existe) {
        let maxCodigoProductores = productores.length > 0 ? Math.max(...productores.map(p => p.codigo)) : 1000;
        const productor = {
            codigo: maxCodigoProductores + 1,
            nombre: nombre,
        };
        productores.push(productor);
        localStorage.setItem("productores", JSON.stringify(productores));
        input.value = "";
        mostrarProductoresRegistrados();
        Toastify({
            text: "Productor agregado correctamente", // Mensaje de éxito de la sesión
            duration: 2000, // Duración de la notificación (2 segundos)
            close: true, // Mostrar botón de cerrar
            gravity: "top", // Posición de la notificación (arriba)
            position: "right", // Posición a la derecha
            stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
            },
        }).showToast();
    } else {
        Swal.fire({
            icon: "error",
            title: "El productor ya se encuentra registrado",
            showConfirmButton: false,
            timer: 1500
        });
    }
}

function eliminarProductor(index) {
    const productores = JSON.parse(localStorage.getItem("productores") || "[]");
    Swal.fire({
        title: "¿Desea eliminar este proveedor?",
        text: "No puede revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            productores.splice(index, 1);
            localStorage.setItem("productores", JSON.stringify(productores));
            loadSection("agregar-productor");
            Toastify({
                text: "Proveedor eliminado correctamente", // Mensaje de éxito de la sesión
                duration: 2000, // Duración de la notificación (2 segundos)
                close: true, // Mostrar botón de cerrar
                gravity: "top", // Posición de la notificación (arriba)
                position: "right", // Posición a la derecha
                stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
                },
            }).showToast();
        }
    });
}

function editarProductor(index) {
    const productores = JSON.parse(localStorage.getItem("productores") || "[]");
    const productor = productores[index];

    fetch("/src/pages/agregar-productor.html")
        .then(res => res.text())
        .then(html => {
            const content = document.getElementById("main-content");
            const breadcrumb = document.getElementById("breadcrumb");
            breadcrumb.textContent = "Dashboards / Gestión de proveedores / Editar proveedor";
            content.innerHTML = html;

            setTimeout(() => {
                const form = document.getElementById("form-productor");
                if (form) {
                    form.querySelector("#nombre-productor").value = productor.nombre;

                    const divBtns = document.getElementById("btns");
                    // Cambiar texto del botón
                    const submitBtn = form.querySelector("button[type='submit']");
                    submitBtn.textContent = "Actualizar proveedor";
                    //Agregar boton cancelar
                    const cancelBtn = document.createElement("button");
                    cancelBtn.type = "button";
                    cancelBtn.classList.add('btn', 'btn-danger');
                    cancelBtn.textContent = "Cancelar";
                    cancelBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        loadSection("agregar-productor");
                    });
                    divBtns.appendChild(cancelBtn);

                    form.onsubmit = function (e) {
                        e.preventDefault();

                        const nombreProd = document.getElementById("nombre-productor");
                        validateName(nombreProd, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/)

                        productores[index] = {
                            nombre: nombreProd.value
                        }

                        localStorage.setItem("productores", JSON.stringify(productores));
                        Toastify({
                            text: "Productor actualizado correctamente", // Mensaje de éxito de la sesión
                            duration: 2000, // Duración de la notificación (2 segundos)
                            close: true, // Mostrar botón de cerrar
                            gravity: "top", // Posición de la notificación (arriba)
                            position: "right", // Posición a la derecha
                            stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
                            },
                        }).showToast();
                        loadSection("agregar-productor");
                    };
                }
            }, 100);
        })
        .catch(err => {
            console.error("Error al cargar el formulario de edición:", err);
        });
}

// const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
// if (current && current.rol === 'admin') {
    window.loadSectionProductor = loadSectionProductor;
    window.guardarProductor = guardarProductor;
// } else {
//     const content = document.getElementById("body-dashboard");
//     content.innerHTML = '';
//     content.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
//     content.innerHTML = `
//     <h3 class="mt-5">ACCESO NO AUTORIZADO</h3>
//     <p>Redirigiendo a La Placita Colombiana</p>
//     <div class="spinner-border" role="status">
//       <span class="visually-hidden">Cargando...</span>
//     </div>
//   `
//     setTimeout(() => {
//         window.location.href = '/src/pages/login.html';
//     }, 1000);
// }

// window.addEventListener("storage", () => {
//     const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
//     if (!current || current.rol !== 'admin') {
//         window.location.href = '/src/pages/login.html';
//     }
// });

// window.addEventListener("pagehide", () => {
//   localStorage.removeItem("currentUser");
// });






