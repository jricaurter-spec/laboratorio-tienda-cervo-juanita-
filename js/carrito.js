/* carrito.js: carrito en localStorage, cupón, tarifas de envío y construcción de ítems GA4. */
(function () {
  "use strict";
  var KEY = "cervo_carrito", CODIGO = "BIENVENIDA10", PCT = 0.10;
  var PAISES = ["Colombia", "México", "Estados Unidos", "España", "Chile", "Perú", "Argentina", "Ecuador"];
  var TARIFAS = { "Nacional": { "Estándar": 12000, "Express": 25000 }, "Internacional": { "Estándar": 95000, "Express": 160000 } };
  var ENVIO_GRATIS_DESDE = 150000;

  function leer() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && Array.isArray(d.items)) return d;
    } catch (e) {}
    return { items: [], cupon: null };
  }
  function guardar(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} contador(); }
  function producto(id) { return window.PRODUCTOS.filter(function (p) { return p.id === id; })[0]; }
  function fmt(n) { return "$" + Number(n).toLocaleString("es-CO"); }

  function lineas() {
    return leer().items.filter(function (l) { return producto(l.id) && l.cantidad > 0; })
      .map(function (l) { return { id: l.id, cantidad: l.cantidad }; });
  }
  function cuponActivo() { return leer().cupon === CODIGO ? CODIGO : null; }
  function descuentoUnitario(p, cupon) { return cupon ? Math.round(p.precio * PCT) : 0; }

  function construirItems(ls, cupon) {
    return ls.map(function (l, i) {
      var p = producto(l.id), d = descuentoUnitario(p, cupon);
      var it = { item_id: p.id, item_name: p.nombre, item_brand: window.MARCA, item_category: p.categoria,
                 price: p.precio - d, quantity: l.cantidad, index: l.indice != null ? l.indice : i };
      if (cupon) { it.discount = d; it.coupon = CODIGO; }
      return it;
    });
  }
  function valor(items) { return items.reduce(function (s, i) { return s + i.price * i.quantity; }, 0); }

  function totales() {
    var cupon = cuponActivo(), sub = 0, desc = 0;
    lineas().forEach(function (l) {
      var p = producto(l.id);
      sub += p.precio * l.cantidad;
      desc += descuentoUnitario(p, cupon) * l.cantidad;
    });
    return { subtotal: sub, descuento: desc, productos: sub - desc };
  }

  function agregar(id, n) {
    var c = leer(), l = c.items.filter(function (x) { return x.id === id; })[0];
    if (l) l.cantidad += n; else c.items.push({ id: id, cantidad: n });
    guardar(c);
  }
  function quitar(id, n) {
    var c = leer();
    c.items = c.items.map(function (x) { if (x.id === id) x.cantidad -= n; return x; })
      .filter(function (x) { return x.cantidad > 0; });
    guardar(c);
  }
  function aplicarCupon(texto) {
    if (String(texto || CODIGO).trim().toUpperCase() !== CODIGO) return false;
    var c = leer(); c.cupon = CODIGO; guardar(c); return true;
  }
  function quitarCupon() { var c = leer(); c.cupon = null; guardar(c); }
  function vaciar() { try { localStorage.removeItem(KEY); } catch (e) {} contador(); }

  function calcularEnvio(pais, servicio, productos) {
    var tipo = pais === "Colombia" ? "Nacional" : "Internacional";
    var costo = TARIFAS[tipo][servicio];
    if (tipo === "Nacional" && servicio === "Estándar" && productos >= ENVIO_GRATIS_DESDE) costo = 0;
    return { tipo_cliente: tipo, shipping_tier: tipo + " - " + servicio, costo: costo };
  }

  function contador() {
    var n = lineas().reduce(function (s, l) { return s + l.cantidad; }, 0);
    var el = document.getElementById("contador-carrito");
    if (el) {
      el.textContent = n;
      el.classList.remove("pop");
      void el.offsetWidth;
      el.classList.add("pop");
    }
  }
  document.addEventListener("DOMContentLoaded", contador);

  window.Carrito = { CODIGO: CODIGO, PAISES: PAISES, ENVIO_GRATIS_DESDE: ENVIO_GRATIS_DESDE, leer: leer, lineas: lineas,
    producto: producto, cuponActivo: cuponActivo, descuentoUnitario: descuentoUnitario, construirItems: construirItems,
    valor: valor, totales: totales, agregar: agregar, quitar: quitar, aplicarCupon: aplicarCupon, quitarCupon: quitarCupon,
    vaciar: vaciar, calcularEnvio: calcularEnvio, fmt: fmt, TARIFAS: TARIFAS };
})();
