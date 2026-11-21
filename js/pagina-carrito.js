(function () {
  "use strict";
  var cont = document.getElementById("carrito");
  var msgCupon = "";

  function itemsLinea(l, indice, n) {
    return Carrito.construirItems([{ id: l.id, cantidad: n, indice: indice }], Carrito.cuponActivo());
  }

  function pintar() {
    var ls = Carrito.lineas(), cupon = Carrito.cuponActivo();
    if (!ls.length) {
      cont.innerHTML = '<div class="vacio"><h2>Tu carrito está vacío</h2><p>Agrega algo del catálogo para empezar.</p><a class="btn" href="index.html">Ver catálogo</a></div>';
      return;
    }
    var t = Carrito.totales();
    var filas = ls.map(function (l) {
      var p = Carrito.producto(l.id), d = Carrito.descuentoUnitario(p, cupon);
      return '<div class="fila">' + visualProducto(p, "mini") + '<div class="fila-info"><b>' + p.nombre + '</b><span class="cat">' + p.categoria +
        " · " + Carrito.fmt(p.precio - d) + ' c/u</span></div>' +
        '<div class="cantidad"><button type="button" data-a="menos" data-id="' + l.id + '" aria-label="Disminuir">−</button><output>' + l.cantidad +
        '</output><button type="button" data-a="mas" data-id="' + l.id + '" aria-label="Aumentar">+</button></div>' +
        '<b class="fila-total">' + Carrito.fmt((p.precio - d) * l.cantidad) + '</b>' +
        '<button type="button" class="enlace" data-a="quitar" data-id="' + l.id + '">Quitar</button></div>';
    }).join("");
    cont.innerHTML = '<div class="dos-col"><div>' + filas + "</div>" +
      '<aside class="resumen"><h2>Resumen</h2>' +
      '<div class="cupon"><label for="cupon">Cupón de descuento</label><div class="cupon-fila"><input id="cupon" placeholder="Código" autocomplete="off" value="' + (cupon || "") + '">' +
      '<button type="button" class="btn-sec" id="aplicar">Aplicar</button></div><p class="nota" id="msg-cupon" role="status">' + msgCupon + "</p></div>" +
      '<div class="linea"><span>Subtotal</span><span>' + Carrito.fmt(t.subtotal) + "</span></div>" +
      (cupon ? '<div class="linea"><span>Descuento ' + cupon + " (10 %)</span><span>−" + Carrito.fmt(t.descuento) + "</span></div>" : "") +
      '<div class="linea total"><span>Total en productos</span><span>' + Carrito.fmt(t.productos) + "</span></div>" +
      '<p class="nota">El envío se calcula en el checkout.</p><a class="btn ancho" href="checkout.html">Ir al checkout</a></aside></div>';
  }

  var inicial = Carrito.lineas();
  if (inicial.length) {
    var items = Carrito.construirItems(inicial, Carrito.cuponActivo());
    var params = { currency: "COP", value: Carrito.valor(items), items: items };
    if (Carrito.cuponActivo()) params.coupon = Carrito.cuponActivo();
    enviarEvento("view_cart", params);
  }
  pintar();

  cont.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.id === "aplicar") {
      msgCupon = Carrito.aplicarCupon(document.getElementById("cupon").value) ? "Cupón aplicado: 10 % de descuento." : "Ese cupón no es válido. Prueba con BIENVENIDA10.";
      pintar(); return;
    }
    var a = b.dataset.a; if (!a) return;
    var ls = Carrito.lineas(), idx = ls.map(function (l) { return l.id; }).indexOf(b.dataset.id);
    if (idx < 0) return;
    var l = ls[idx], cupon = Carrito.cuponActivo(), n, items;
    if (a === "mas") {
      items = itemsLinea(l, idx, 1); Carrito.agregar(l.id, 1);
      enviarEvento("add_to_cart", { currency: "COP", value: Carrito.valor(items), items: items });
    } else {
      n = a === "quitar" ? l.cantidad : 1;
      items = itemsLinea(l, idx, n); Carrito.quitar(l.id, n);
      enviarEvento("remove_from_cart", { currency: "COP", value: Carrito.valor(items), items: items });
    }
    pintar();
  });
})();
