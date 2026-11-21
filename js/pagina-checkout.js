(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var ls = Carrito.lineas(), cupon = Carrito.cuponActivo();
  if (!ls.length) {
    $("pasos").hidden = true; $("vacio").hidden = false; return;
  }
  var items = Carrito.construirItems(ls, cupon), valor = Carrito.valor(items), envio = null;
  function base() {
    var p = { currency: "COP", value: valor, items: JSON.parse(JSON.stringify(items)) };
    if (cupon) p.coupon = cupon;
    return p;
  }
  enviarEvento("begin_checkout", base());

  // Opciones de país y servicio
  $("pais").innerHTML = Carrito.PAISES.map(function (p) { return "<option>" + p + "</option>"; }).join("");
  function pintarServicios() {
    var pais = $("pais").value, previo = (document.querySelector('input[name="servicio"]:checked') || {}).value || "Estándar";
    $("servicios").innerHTML = ["Estándar", "Express"].map(function (s) {
      var e = Carrito.calcularEnvio(pais, s, valor);
      return '<label class="opcion"><input type="radio" name="servicio" value="' + s + '"' + (s === previo ? " checked" : "") + "><span><b>" + s +
        "</b><small>" + (e.tipo_cliente === "Nacional" ? "Envío nacional" : "Envío internacional") + "</small></span><em>" +
        (e.costo === 0 ? "Gratis" : Carrito.fmt(e.costo)) + "</em></label>";
    }).join("");
    pintarResumen();
  }
  function actual() {
    var s = (document.querySelector('input[name="servicio"]:checked') || {}).value || "Estándar";
    return Carrito.calcularEnvio($("pais").value, s, valor);
  }
  function pintarResumen() {
    var e = actual(), t = Carrito.totales();
    $("resumen").innerHTML = "<h2>Tu pedido</h2>" + ls.map(function (l) {
      var p = Carrito.producto(l.id), d = Carrito.descuentoUnitario(p, cupon);
      return '<div class="linea"><span>' + l.cantidad + " × " + p.nombre + "</span><span>" + Carrito.fmt((p.precio - d) * l.cantidad) + "</span></div>";
    }).join("") +
      (cupon ? '<div class="linea"><span>Cupón ' + cupon + "</span><span>−" + Carrito.fmt(t.descuento) + "</span></div>" : "") +
      '<div class="linea"><span>Productos</span><span>' + Carrito.fmt(valor) + "</span></div>" +
      '<div class="linea"><span>Envío (' + e.shipping_tier + ')</span><span>' + (e.costo === 0 ? "Gratis" : Carrito.fmt(e.costo)) + "</span></div>" +
      '<div class="linea total"><span>Total</span><span>' + Carrito.fmt(valor + e.costo) + "</span></div>";
  }
  $("pais").addEventListener("change", pintarServicios);
  $("servicios").addEventListener("change", pintarResumen);
  pintarServicios();

  // Pagos
  var PAGOS = [["Tarjeta de crédito", "Simulado: no se pedirán datos de tarjeta."], ["PSE", "Simulado: no habrá redirección al banco."],
               ["Nequi", "Simulado: no se pedirá número de celular."], ["PayPal", "Simulado: no se abrirá ninguna cuenta."]];
  $("pagos").innerHTML = PAGOS.map(function (p, i) {
    return '<label class="opcion"><input type="radio" name="pago" value="' + p[0] + '"' + (i === 0 ? " checked" : "") + "><span><b>" + p[0] + "</b><small>" + p[1] + "</small></span></label>";
  }).join("");

  function ir(paso) {
    $("paso1").hidden = paso !== 1; $("paso2").hidden = paso !== 2;
    $("ind1").className = paso === 1 ? "activo" : "hecho"; $("ind2").className = paso === 2 ? "activo" : "";
  }

  // Paso 1: Continuar al pago
  $("btn-envio").addEventListener("click", function () {
    if (!$("nombre").value.trim()) { $("error1").textContent = "Escribe un nombre ficticio para continuar."; $("nombre").focus(); return; }
    $("error1").textContent = "";
    envio = actual();
    window.gtag("set", "user_properties", { tipo_cliente: envio.tipo_cliente });
    var p = base(); p.shipping_tier = envio.shipping_tier;
    enviarEvento("add_shipping_info", p);
    ir(2);
  });
  $("btn-volver").addEventListener("click", function () { ir(1); });

  // Paso 2: Pagar (simulado)
  $("btn-pagar").addEventListener("click", function () {
    if (!envio) { ir(1); return; }
    this.disabled = true;
    var tipo = document.querySelector('input[name="pago"]:checked').value;
    var pedido = {
      transaction_id: "CERVO-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
      affiliation: "Cervo - Tienda en línea (simulada)", currency: "COP", value: valor, shipping: envio.costo,
      tipo_cliente: envio.tipo_cliente, shipping_tier: envio.shipping_tier, payment_type: tipo,
      items: JSON.parse(JSON.stringify(items)), enviado: false
    };
    if (cupon) pedido.coupon = cupon;
    try { sessionStorage.setItem("cervo_pedido", JSON.stringify(pedido)); } catch (e) {}
    var p = base(); p.payment_type = tipo;
    enviarEventoYNavegar("add_payment_info", p, "gracias.html");
  });
})();
