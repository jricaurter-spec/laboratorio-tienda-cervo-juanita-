(function () {
  "use strict";
  var cupon = Carrito.cuponActivo();
  var grilla = document.getElementById("grilla");

  grilla.innerHTML = PRODUCTOS.map(function (p, i) {
    var d = Carrito.descuentoUnitario(p, cupon);
    var precio = d ? '<s>' + Carrito.fmt(p.precio) + '</s> <b>' + Carrito.fmt(p.precio - d) + '</b>' : '<b>' + Carrito.fmt(p.precio) + '</b>';
    return '<a class="tarjeta" href="producto.html?id=' + p.id + '" data-id="' + p.id + '" data-i="' + i + '">' +
      visualProducto(p) + '<div class="tarjeta-info"><h3>' + p.nombre + '</h3><p class="cat">' + p.categoria +
      '</p><p class="precio">' + precio + '</p></div></a>';
  }).join("");

  var listaParams = {
    currency: "COP", item_list_id: "catalogo_principal", item_list_name: "Catálogo principal",
    items: Carrito.construirItems(PRODUCTOS.map(function (p, i) { return { id: p.id, cantidad: 1, indice: i }; }), cupon)
  };
  enviarEvento("view_item_list", listaParams);

  grilla.addEventListener("click", function (e) {
    var a = e.target.closest("a.tarjeta");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    enviarEventoYNavegar("select_item", {
      currency: "COP", item_list_id: "catalogo_principal", item_list_name: "Catálogo principal",
      items: Carrito.construirItems([{ id: a.dataset.id, cantidad: 1, indice: Number(a.dataset.i) }], cupon)
    }, a.getAttribute("href"));
  });

  // Banner del cupón
  var banner = document.getElementById("banner");
  if (cupon) {
    banner.innerHTML = '<div class="banner banner-ok"><div><h2>Cupón BIENVENIDA10 aplicado</h2><p>Los precios ya muestran tu 10 % de descuento.</p></div>' +
      '<a class="btn" href="carrito.html">Ver carrito</a></div>';
    return;
  }
  var promo = {
    currency: "COP", promotion_id: "BIENVENIDA10", promotion_name: "Cupón de bienvenida",
    creative_name: "banner_inicio_bienvenida", creative_slot: "inicio_superior",
    items: Carrito.construirItems([{ id: "CER-001", cantidad: 1 }], null)
  };
  banner.innerHTML = '<button type="button" class="banner" id="btn-banner"><div><h2>10 % de descuento en tu primera compra</h2>' +
    '<p>Usa el cupón BIENVENIDA10 con un solo toque.</p></div><span class="btn">Aplicar cupón</span></button>';
  enviarEvento("view_promotion", promo);
  document.getElementById("btn-banner").addEventListener("click", function () {
    Carrito.aplicarCupon();
    enviarEventoYNavegar("select_promotion", promo, "carrito.html");
  });
})();
