/* analytics.js: carga gtag.js (solo con ID válido), envía eventos y los registra para el Monitor. */
(function () {
  "use strict";
  var cfg = window.TIENDA_CONFIG || {};
  var ID = String(cfg.GA_MEASUREMENT_ID || "").trim();
  var activo = /^G-[A-Z0-9]{4,}$/i.test(ID) && ID !== "G-XXXXXXXXXX";
  var LOG_KEY = "cervo_monitor_log";

  window.GA_ESTADO = { activo: activo, id: ID, debug: cfg.DEBUG_MODE === true };
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  if (activo) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ID);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    if (cfg.DEBUG_MODE === true) { window.gtag("config", ID, { debug_mode: true }); }
    else { window.gtag("config", ID); }
  }

  function fmt(n) { return "$" + Number(n).toLocaleString("es-CO"); }

  function resumen(nombre, p) {
    if (nombre === "page_view") return p.page_location || "";
    var a = [];
    if (p.promotion_id) a.push(p.promotion_id);
    if (p.item_list_id) a.push("lista " + p.item_list_id);
    if (p.items && p.items.length) {
      a.push(p.items.length > 3
        ? p.items.length + " productos"
        : p.items.map(function (i) { return i.item_id + " ×" + i.quantity; }).join(", "));
    }
    if (p.shipping_tier) a.push(p.shipping_tier);
    if (p.payment_type) a.push(p.payment_type);
    if (p.transaction_id) a.push(p.transaction_id);
    if (p.coupon) a.push("cupón " + p.coupon);
    if (p.value != null) a.push("value " + fmt(p.value));
    if (p.shipping != null) a.push("envío " + fmt(p.shipping));
    if (p.tipo_cliente) a.push(p.tipo_cliente);
    return a.join(" · ");
  }

  function registrar(nombre, params) {
    try {
      var lista = JSON.parse(sessionStorage.getItem(LOG_KEY) || "[]");
      lista.unshift({ t: Date.now(), n: nombre, r: resumen(nombre, params || {}), p: params || {} });
      sessionStorage.setItem(LOG_KEY, JSON.stringify(lista.slice(0, 12)));
    } catch (e) {}
    try { window.dispatchEvent(new CustomEvent("cervo:evento")); } catch (e) {}
  }

  // 1) Envía un evento (y lo muestra en el Monitor).
  window.enviarEvento = function (nombre, params) {
    params = params || {};
    registrar(nombre, JSON.parse(JSON.stringify(params)));
    if (activo) window.gtag("event", nombre, params);
  };

  // 2) Envía un evento y luego navega: espera event_callback, con tope de 1000 ms y respaldo de 1200 ms.
  window.enviarEventoYNavegar = function (nombre, params, url) {
    params = params || {};
    registrar(nombre, JSON.parse(JSON.stringify(params)));
    var fue = false;
    function ir() { if (fue) return; fue = true; window.location.href = url; }
    if (!activo) { ir(); return; }
    var conCallback = Object.assign({}, params, { event_callback: ir, event_timeout: 1000 });
    window.gtag("event", nombre, conCallback);
    setTimeout(ir, 1200);
  };

  // page_view: lo envía gtag('config') automáticamente; aquí solo se anota en el Monitor.
  registrar("page_view", { page_location: location.pathname + location.search, page_title: document.title });
})();
