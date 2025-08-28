const productos = JSON.parse(localStorage.getItem("productos") || "[]");
const productores = JSON.parse(localStorage.getItem("productores") || "[]");

const productosDB = [
  {
    codigo: 1001,
    nombre: "Bourbon Clásico",
    descripcion: "Café suave y balanceado con notas dulces de caramelo y frutas rojas. Ideal para quienes buscan una taza clásica y aromática.",
    presentacion: "1 kg",
    precio: 55000,
    categoria: "Cafe",
    productor: "Finca El Mirador - Familia Ramírez",
    img: "cafe-bourbon.webp",
    alt: "Café variedad Bourbon",
    cantidad_inventario: 2,
  },
  {
    codigo: 1002,
    nombre: "Catuai Dorado",
    descripcion: "Café de cuerpo medio y acidez brillante, con sabores que recuerdan a cítricos y chocolate. Perfecto para métodos filtrados.",
    presentacion: "1 kg",
    precio: 52000,
    categoria: "Cafe",
    productor: "Finca la Arboleda - Don Julián y su familia",
    img: "cafe-catui.webp",
    alt: "Cafe variedad catui",
    cantidad_inventario: 100,
  },
  {
    codigo: 1003,
    nombre: "Herencia Etíope Floral",
    descripcion: "Café exótico de perfil floral e intenso aroma, con notas a jazmín, frutos tropicales y un retrogusto prolongado. Una experiencia de origen ancestral.",
    presentacion: "1 kg",
    precio: 60000,
    categoria: "Cafe",
    productor: "Finca Los Andes - Cooperativa Mujeres Cafeteras",
    img: "etiope.webp",
    alt: "Cafe variedad herencia etiope",
    cantidad_inventario: 100,
  },
  {
    codigo: 1004,
    nombre: "Gesha Premium",
    descripcion: "Café exclusivo y reconocido mundialmente por su delicadeza. Notas florales, miel y frutas tropicales que lo convierten en una joya gourmet.",
    presentacion: "250 g",
    precio: 48000,
    categoria: "Cafe",
    productor: "Finca Santa Rosa – Familia Gutiérrez",
    img: "gesha.webp",
    alt: "Cafe variedad Gesha",
    cantidad_inventario: 100,
  },
  {
    codigo: 1005,
    nombre: "Aroma de Paz",
    descripcion: "Chocolate artesanal elaborado con cacao fino de aroma, símbolo de resiliencia y esperanza. Cada barra cuenta una historia de transformación.",
    presentacion: "500 g",
    precio: 10500,
    categoria: "Cacao",
    productor: "Mujeres víctimas del conflicto en Rionegro, Santander",
    img: "cacao-paz.webp",
    alt: "Chocolate aroma de paz",
    cantidad_inventario: 100,
  },
  {
    codigo: 1006,
    nombre: "Anori",
    descripcion: "Surge como un producto de sustitución voluntaria de cultivos ilícitos en Anorí, Antioquia, con altos estándares de calidad y sostenibilidad.",
    presentacion: "500 g",
    precio: 12000,
    categoria: "Cacao",
    productor: "ASOMUCAN",
    img: "Anori.png",
    alt: "Anori",
    cantidad_inventario: 100,
  },
  {
    codigo: 1007,
    nombre: "La Roja",
    descripcion: "Producida por excombatientes de las FARC-EP en Bogotá. Busca generar ingresos para los excombatientes y sus familias, así como promover la reconciliación.",
    presentacion: "330 ml",
    precio: 7500,
    categoria: "Cerveza",
    productor: "Ex-combatientes de las FARC",
    img: "laroja.png",
    alt: "La Roja",
    cantidad_inventario: 100,
  },
  {
    codigo: 1008,
    nombre: "La Trocha",
    descripcion: "Producida por excombatientes de las FARC-EP en Bogotá. Busca generar ingresos para los excombatientes y sus familias, así como promover la reconciliación.",
    presentacion: "330 ml",
    precio: 6000,
    categoria: "Cerveza",
    productor: "Ex-combatientes de las FARC",
    img: "latrocha.png",
    alt: "La Trocha",
    cantidad_inventario: 100,
  },
  {
    codigo: 1009,
    nombre: "Cordillera",
    descripcion: "Una marca de chocolate sostenible que apoya proyectos productivos de cacao en zonas de reincorporación, buscando fortalecer el desarrollo económico y social.",
    presentacion: "500 gr",
    precio: 15000,
    categoria: "Cacao",
    productor: "Cordillera Company",
    img: "Cordillera.png",
    alt: "Cordillera",
    cantidad_inventario: 100,
  },
  {
    codigo: 1010,
    nombre: "Late Choco",
    descripcion: "Una fábrica artesanal que utiliza cacao cultivado por familias víctimas del conflicto armado en el Chocó.",
    presentacion: "500 gr",
    precio: 14000,
    categoria: "Cacao",
    productor: "Late Chocó",
    img: "latechoco.png",
    alt: "Late Choco",
    cantidad_inventario: 100,
  }
];

const productoresDB = [
  {
    codigo: 1001,
    nombre: "Pepito Perez",
  },
  {
    codigo: 1002,
    nombre: "Pepita Perez",
  },
  {
    codigo: 1003,
    nombre: "Pepe Perez",
  },
  {
    codigo: 1004,
    nombre: "Pepa Perez",
  },
  {
    codigo: 1005,
    nombre: "Pablo Perez",
  },
  {
    codigo: 1006,
    nombre: "Maria Perez",
  },
  {
    codigo: 1007,
    nombre: "Juan Perez",
  },
  {
    codigo: 1008,
    nombre: "Juana Perez",
  },
  {
    codigo: 1009,
    nombre: "Pedro Perez",
  },
  {
    codigo: 1010,
    nombre: "Jose Perez",
  },
];


function cargarLocalStorage() {
  let maxCodigoProductos = productos.length > 0 ? Math.max(...productos.map(p => p.codigo)) : 1000;
  let maxCodigoProductores = productores.length > 0 ? Math.max(...productores.map(p => p.codigo)) : 1000;
  if (productos.length === 0) {
    productosDB.forEach(p => {
      const producto = {
        codigo: maxCodigoProductos + 1,
        nombre: p["nombre"],
        productor: p["productor"],
        descripcion: p["descripcion"],
        categoria: p["categoria"],
        cantidad: p["cantidad_inventario"],
        precio: p["precio"],
        imagen: p["img"],
        presentacion: p["presentacion"],
      };
      productos.push(producto);
      maxCodigoProductos++;
    });
  } 
  if (productores.length === 0) {
    productoresDB.forEach(p => {
      const productor = {
        codigo: maxCodigoProductores + 1,
        nombre: p["nombre"],
      };
      productores.push(productor);
      maxCodigoProductores++;
    });
  } 
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("productores", JSON.stringify(productores));
}

document.addEventListener("DOMContentLoaded", cargarLocalStorage);
