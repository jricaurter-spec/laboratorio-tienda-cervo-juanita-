(function () {
  "use strict";
  var id = new URLSearchParams(location.search).get("id");
  var p = Carrito.producto(id);
  var cont = document.getElementById("detalle");
  if (!p) {
    cont.innerHTML = '<div class="vacio"><h2>No encontramos ese producto</h2><p>Revisa el enlace o vuelve al catálogo.</p><a class="btn" href="index.html">Ir al catálogo</a></div>';
    return;
  }
  document.title = p.nombre + " · Cervo";
  var cupon = Carrito.cuponActivo(), d = Carrito.descuentoUnitario(p, cupon), cantidad = 1;
  var precio = d ? "<s>" + Carrito.fmt(p.precio) + "</s> <b>" + Carrito.fmt(p.precio - d) + "</b>" : "<b>" + Carrito.fmt(p.precio) + "</b>";

  cont.innerHTML = visualProducto(p, "grande") +
    '<div class="detalle-info"><p class="cat">' + p.categoria + "</p><h1>" + p.nombre + '</h1><p class="precio grande-p">' + precio +
    "</p>" + (cupon ? '<p class="nota">Incluye tu cupón BIENVENIDA10.</p>' : "") +
    "<p>" + p.descripcion + '</p><p class="nota">Referencia ' + p.id + '</p>' +
    '<div class="cantidad" aria-label="Cantidad"><button type="button" id="menos" aria-label="Menos">−</button><output id="cant">1</output><button type="button" id="mas" aria-label="Más">+</button></div>' +
    '<button type="button" class="btn" id="agregar">Agregar al carrito</button><p id="aviso" class="aviso-ok" role="status"></p></div>';

  enviarEvento("view_item", { currency: "COP", value: p.precio - d, items: Carrito.construirItems([{ id: p.id, cantidad: 1 }], cupon) });

  document.getElementById("mas").addEventListener("click", function () { if (cantidad < 10) document.getElementById("cant").textContent = ++cantidad; });
  document.getElementById("menos").addEventListener("click", function () { if (cantidad > 1) document.getElementById("cant").textContent = --cantidad; });
  document.getElementById("agregar").addEventListener("click", function () {
    var items = Carrito.construirItems([{ id: p.id, cantidad: cantidad }], cupon);
    Carrito.agregar(p.id, cantidad);
    enviarEvento("add_to_cart", { currency: "COP", value: Carrito.valor(items), items: items });
    document.getElementById("aviso").innerHTML = "Agregaste " + cantidad + " × " + p.nombre + '. <a href="carrito.html">Ver carrito</a>';
    cantidad = 1; document.getElementById("cant").textContent = 1;
  });
})();
