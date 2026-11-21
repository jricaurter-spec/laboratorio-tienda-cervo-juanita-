/* Catálogo ficticio de Cervo. Precios enteros en COP. Sin imágenes externas: bloques de color con siglas. */
window.MARCA = "Cervo";
window.PRODUCTOS = [
  { id: "CER-001", nombre: "Camiseta Aire Pro", categoria: "Camisetas", precio: 89000, siglas: "AP", colores: ["#2563eb", "#7c3aed"],
    descripcion: "Camiseta técnica de secado rápido, costuras planas y tejido ventilado para correr bajo el sol de Bogotá o Barranquilla." },
  { id: "CER-002", nombre: "Top Impulso", categoria: "Tops", precio: 79000, siglas: "TI", colores: ["#f43f5e", "#fb923c"],
    descripcion: "Top deportivo de soporte medio con tela elástica en cuatro direcciones, ideal para yoga, ciclismo indoor y entrenamiento funcional." },
  { id: "CER-003", nombre: "Leggings Cumbre", categoria: "Leggings", precio: 139000, siglas: "LC", colores: ["#059669", "#0284c7"],
    descripcion: "Leggings de cintura alta que no se transparentan, con bolsillo lateral para el celular y compresión suave." },
  { id: "CER-004", nombre: "Short Ráfaga 2 en 1", categoria: "Shorts", precio: 99000, siglas: "SR", colores: ["#f59e0b", "#ef4444"],
    descripcion: "Short con malla interior integrada, cintura con cordón y bolsillos con cierre para llevar llaves y tarjeta." },
  { id: "CER-005", nombre: "Chaqueta Páramo Ligera", categoria: "Chaquetas", precio: 229000, siglas: "PL", colores: ["#6366f1", "#0f172a"],
    descripcion: "Cortavientos repelente al agua que se guarda en su propio bolsillo. Pensada para madrugar en clima frío." },
  { id: "CER-006", nombre: "Buzo Cálido Andes", categoria: "Buzos", precio: 189000, siglas: "CA", colores: ["#0284c7", "#4f46e5"],
    descripcion: "Buzo con interior afelpado y capucha ajustable para el calentamiento previo y la recuperación después de entrenar." },
  { id: "CER-007", nombre: "Medias Pulso x3", categoria: "Accesorios", precio: 45000, siglas: "MP", colores: ["#9333ea", "#e11d48"],
    descripcion: "Pack de tres pares de medias acolchadas en la planta, con zona de ventilación en el empeine." },
  { id: "CER-008", nombre: "Gorra Trote", categoria: "Accesorios", precio: 59000, siglas: "GT", colores: ["#16a34a", "#15803d"],
    descripcion: "Gorra liviana con banda absorbente y cierre ajustable, para salir a trotar con protección solar." }
];
window.visualProducto = function (p, clase) {
  return '<div class="visual ' + (clase || "") + '" style="background:linear-gradient(135deg,' + p.colores[0] + "," + p.colores[1] +
    ')" role="img" aria-label="' + p.nombre + '"><span class="visual-siglas">' + p.siglas + '</span><span class="visual-brillo" aria-hidden="true"></span></div>';
};
