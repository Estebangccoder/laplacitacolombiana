const productos = JSON.parse(localStorage.getItem("productos") || "[]");
const productores = JSON.parse(localStorage.getItem("productores") || "[]");
const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");

const productosDB = [
  {
    codigo: 1001,
    nombre: "Bourbon Clásico",
    descripcion: "Café suave y balanceado con notas dulces de caramelo y frutas rojas. Ideal para quienes buscan una taza clásica y aromática.",
    presentacion: "1",
    medida: "kg",
    precio: 55000,
    categoria: "Cafe",
    productor: 1001,
    img: "cafe-bourbon.webp",
    alt: "Café variedad Bourbon",
    cantidad_inventario: 2,
  },
  {
    codigo: 1002,
    nombre: "Catuai Dorado",
    descripcion: "Café de cuerpo medio y acidez brillante, con sabores que recuerdan a cítricos y chocolate. Perfecto para métodos filtrados.",
    presentacion: "1",
    medida: "kg",
    precio: 52000,
    categoria: "Cafe",
    productor: 1002,
    img: "cafe-catui.webp",
    alt: "Cafe variedad catui",
    cantidad_inventario: 100,
  },
  {
    codigo: 1003,
    nombre: "Herencia Etíope Floral",
    descripcion: "Café exótico de perfil floral e intenso aroma, con notas a jazmín, frutos tropicales y un retrogusto prolongado. Una experiencia de origen ancestral.",
    presentacion: "1",
    medida: "kg",
    precio: 60000,
    categoria: "Cafe",
    productor: 1003,
    img: "etiope.webp",
    alt: "Cafe variedad herencia etiope",
    cantidad_inventario: 100,
  },
  {
    codigo: 1004,
    nombre: "Gesha Premium",
    descripcion: "Café exclusivo y reconocido mundialmente por su delicadeza. Notas florales, miel y frutas tropicales que lo convierten en una joya gourmet.",
    presentacion: "250",
    medida: "gr",
    precio: 48000,
    categoria: "Cafe",
    productor: 1004,
    img: "gesha.webp",
    alt: "Cafe variedad Gesha",
    cantidad_inventario: 100,
  },
  {
    codigo: 1005,
    nombre: "Aroma de Paz",
    descripcion: "Chocolate artesanal elaborado con cacao fino de aroma, símbolo de resiliencia y esperanza. Cada barra cuenta una historia de transformación.",
    presentacion: "500",
    medida: "gr",
    precio: 10500,
    categoria: "Cacao",
    productor: 1005,
    img: "cacao-paz.webp",
    alt: "Chocolate aroma de paz",
    cantidad_inventario: 100,
  },
  {
    codigo: 1006,
    nombre: "Anori",
    descripcion: "Surge como un producto de sustitución voluntaria de cultivos ilícitos en Anorí, Antioquia, con altos estándares de calidad y sostenibilidad.",
    presentacion: "500",
    medida: "gr",
    precio: 12000,
    categoria: "Cacao",
    productor: 1006,
    img: "Anori.png",
    alt: "Anori",
    cantidad_inventario: 100,
  },
  {
    codigo: 1007,
    nombre: "La Roja",
    descripcion: "Producida por excombatientes de las FARC-EP en Bogotá. Busca generar ingresos para los excombatientes y sus familias, así como promover la reconciliación.",
    presentacion: "330",
    medida: "ml",
    precio: 7500,
    categoria: "Cerveza",
    productor: 1007,
    img: "laroja.png",
    alt: "La Roja",
    cantidad_inventario: 100,
  },
  {
    codigo: 1008,
    nombre: "La Trocha",
    descripcion: "Producida por excombatientes de las FARC-EP en Bogotá. Busca generar ingresos para los excombatientes y sus familias, así como promover la reconciliación.",
    presentacion: "330",
    medida: "ml",
    precio: 6000,
    categoria: "Cerveza",
    productor: 1008,
    img: "latrocha.png",
    alt: "La Trocha",
    cantidad_inventario: 100,
  },
  {
    codigo: 1009,
    nombre: "Cordillera",
    descripcion: "Una marca de chocolate sostenible que apoya proyectos productivos de cacao en zonas de reincorporación, buscando fortalecer el desarrollo económico y social.",
    presentacion: "500",
    medida: "gr",
    precio: 15000,
    categoria: "Cacao",
    productor: 1009,
    img: "Cordillera.png",
    alt: "Cordillera",
    cantidad_inventario: 100,
  },
  {
    codigo: 1010,
    nombre: "Late Choco",
    descripcion: "Una fábrica artesanal que utiliza cacao cultivado por familias víctimas del conflicto armado en el Chocó.",
    presentacion: "500",
    medida: "gr",
    precio: 14000,
    categoria: "Cacao",
    productor: 1010,
    img: "latechoco.png",
    alt: "Late Choco",
    cantidad_inventario: 100,
  }
];

const productoresDB = [
  {
    codigo: 1001,
    nombre: "Finca El Mirador - Familia Ramírez",
  },
  {
    codigo: 1002,
    nombre: "Finca la Arboleda - Don Julián y su familia",
  },
  {
    codigo: 1003,
    nombre: "Finca Los Andes - Cooperativa Mujeres Cafeteras",
  },
  {
    codigo: 1004,
    nombre: "Finca Santa Rosa - Familia Gutiérrez",
  },
  {
    codigo: 1005,
    nombre: "Mujeres víctimas del conflicto en Rionegro, Santander",
  },
  {
    codigo: 1006,
    nombre: "ASOMUCAN",
  },
  {
    codigo: 1007,
    nombre: "Ex-combatientes de las FARC",
  },
  {
    codigo: 1008,
    nombre: "Ex-combatientes de las FARC",
  },
  {
    codigo: 1009,
    nombre: "Cordillera Company",
  },
  {
    codigo: 1010,
    nombre:  "Late Chocó",
  },
];

const ventasDB = [
  {
    codigo: 1001,
    fecha: '12/01/2025',
    num_productos: 3,
    total: 164000,
  },
  {
    codigo: 1002,
    fecha: '12/02/2025',
    num_productos: 2,
    total: 64000,
  },
  {
    codigo: 1003,
    fecha: '12/03/2025',
    num_productos: 1,
    total: 34000,
  },
  {
    codigo: 1004,
    fecha: '12/04/2025',
    num_productos: 4,
    total: 100000,
  },
  {
    codigo: 1005,
    fecha: '12/05/2025',
    num_productos: 3,
    total: 72000,
  },
  {
    codigo: 1006,
    fecha: '12/06/2025',
    num_productos: 1,
    total: 54000,
  },
  {
    codigo: 1007,
    fecha: '12/07/2025',
    num_productos: 1,
    total: 34300,
  },
  {
    codigo: 1008,
    fecha: '12/08/2025',
    num_productos: 2,
    total: 67800,
  },
  {
    codigo: 1009,
    fecha: '12/09/2025',
    num_productos: 1,
    total: 23100,
  },
  {
    codigo: 1010,
    fecha: '12/10/2025',
    num_productos: 1,
    total: 140900,
  },
  {
    codigo: 1011,
    fecha: '20/01/2025',
    num_productos: 2,
    total: 140000,
  },
  {
    codigo: 1012,
    fecha: '28/02/2025',
    num_productos: 1,
    total: 6400,
  },

];

function cargarLocalStorage() {
  let maxCodigoProductos = productos.length > 0 ? Math.max(...productos.map(p => p.codigo)) : 1000;
  let maxCodigoProductores = productores.length > 0 ? Math.max(...productores.map(p => p.codigo)) : 1000;
  let maxCodigoVentas = ventas.length > 0 ? Math.max(...ventas.map(v => v.codigo)) : 1000;
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
        medida: p["medida"],
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
  if (ventas.length === 0) {
    ventasDB.forEach(v => {
      const venta = {
        codigo: maxCodigoVentas + 1,
        fecha: v['fecha'],
        num_productos: v['num_productos'],
        total: v['total'],
      };
      ventas.push(venta);
      maxCodigoVentas++;
    });
  }
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("productores", JSON.stringify(productores));
  localStorage.setItem("ventas", JSON.stringify(ventas));
}

document.addEventListener("DOMContentLoaded", cargarLocalStorage);
