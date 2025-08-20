function mostrarNavBar() {
    return `
    <nav class="navbar navbar-expand-lg navbar-dark " id="navbar">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <div class="d-inline-flex justify-content-center align-items-center">
                    <img src="../public/img/navbarlogo.png" alt="Logo"
                        class="logo-navbar border border-4 border-white rounded-circle">
                    <div class="d-inline-flex flex-column justify-content-center align-items-center ms-2">
                        <p class="text-logo m-0 p-0">La Placita</p>
                        <p class="text-logo m-0 p-0">Colombiana</p>
                    </div>
                </div>
            </a>
            <div class="d-inline-flex">
                <div class="d-inline-flex d-lg-none">
                    <a class="nav-link me-0 me-md-3" href="#"><i class="bi bi-person-circle fs-3 text-white m-0"></i></a>
                    <a class="nav-link me-0 me-md-3" href="#"> <i class="bi bi-basket-fill fs-3 text-white m-0"></i></a>
                </div>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="quienessomos.html">QUIENES SOMOS</a></li>
                    <li class="nav-item"><a class="nav-link" href="contactanos.html">CONTACTANOS</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">TIENDA</a></li>
                </ul>
                <ul class="navbar-nav d-none d-lg-inline-flex">
                    <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-person-circle fs-3 text-white m-0"></i></a></li>
                    <li class="nav-item"><a class="nav-link" href="#"> <i class="bi bi-basket-fill fs-3 text-white m-0"></i></a></li>
                </ul>
            </div>
        </div>
    </nav>

    `
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("navbar").innerHTML = mostrarNavBar();
});

//tener en cuenta importar CSS y JS y los iconos de bootstrap en cada página

// iconos: <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">

//CSS: <link rel="stylesheet" href="../css/navbar.css">

//JS: <script src="../js/navbar.js"></script>

//HTML: <header id="navbar"></header>