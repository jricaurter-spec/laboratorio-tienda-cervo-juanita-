(function () {
  "use strict";
  var cont = document.getElementById("gracias"), pedido = null;
  try { pedido = JSON.parse(sessionStorage.getItem("cervo_pedido")); } catch (e) {}
  if (!pedido) {
    cont.innerHTML = '<div class="vacio"><h2>No hay un pedido para mostrar</h2><p>Haz una compra simulada desde el catálogo.</p><a class="btn" href="index.html">Ir al catálogo</a></div>';
    return;
  }
  var nota;
  if (!pedido.enviado) {
    window.gtag("set", "user_properties", { tipo_cliente: pedido.tipo_cliente });
    var p = { currency: "COP", transaction_id: pedido.transaction_id, affiliation: pedido.affiliation, value: pedido.value,
              shipping: pedido.shipping, tipo_cliente: pedido.tipo_cliente, items: pedido.items };
    if (pedido.coupon) p.coupon = pedido.coupon;
    enviarEvento("purchase", p);
    pedido.enviado = true;
    try { sessionStorage.setItem("cervo_pedido", JSON.stringify(pedido)); } catch (e) {}
    Carrito.vaciar();
    nota = "El evento purchase se envió una sola vez.";
  } else {
    nota = "Este pedido ya se había registrado: recargar la página no envía otro purchase.";
  }
  cont.innerHTML = '<div class="gracias-caja">' +
    '<div class="icono-exito" aria-hidden="true">' +
    '<svg class="svg-check" viewBox="0 0 52 52"><circle class="check-circulo" cx="26" cy="26" r="24" fill="none"/><path class="check-trazo" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>' +
    '</div>' +
    '<h1>Gracias por tu compra simulada</h1><p class="sub">Pedido ' + pedido.transaction_id + '</p>' +
    pedido.items.map(function (i) {
      return '<div class="linea"><span>' + i.quantity + " × " + i.item_name + "</span><span>" + Carrito.fmt(i.price * i.quantity) + "</span></div>";
    }).join("") +
    '<div class="linea"><span>Productos</span><span>' + Carrito.fmt(pedido.value) + "</span></div>" +
    '<div class="linea"><span>Envío (' + pedido.shipping_tier + ")</span><span>" + (pedido.shipping === 0 ? "Gratis" : Carrito.fmt(pedido.shipping)) + "</span></div>" +
    '<div class="linea total"><span>Total</span><span>' + Carrito.fmt(pedido.value + pedido.shipping) + "</span></div>" +
    '<p class="nota">Pago simulado con ' + pedido.payment_type + ". " + nota + '</p><a class="btn" href="index.html">Seguir comprando</a></div>';
})();
