/* monitor.js: panel didáctico "Monitor de eventos". */
(function () {
  "use strict";
  var LOG_KEY = "cervo_monitor_log", UTM_KEY = "cervo_utm", OCULTO_KEY = "cervo_monitor_oculto";
  var est = window.GA_ESTADO || {};

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // Origen de la visita: se guarda al entrar a la primera página de la sesión.
  function origen() {
    var o = null;
    try { o = sessionStorage.getItem(UTM_KEY); } catch (e) {}
    if (!o) {
      var q = new URLSearchParams(location.search), s = q.get("utm_source"), m = q.get("utm_medium"), c = q.get("utm_campaign");
      o = (s || m || c) ? (s || "(sin source)") + " / " + (m || "(sin medium)") + " · " + (c || "(sin campaign)") : "directo (sin UTM)";
      try { sessionStorage.setItem(UTM_KEY, o); } catch (e) {}
    }
    return o;
  }

  var panel = document.createElement("div");
  panel.innerHTML =
    '<aside id="monitor" aria-label="Monitor de eventos">' +
      '<div class="mon-cab"><strong>Monitor de eventos</strong><button type="button" id="mon-ocultar">Ocultar</button></div>' +
      '<div id="mon-estado" class="mon-estado"></div>' +
      '<div class="mon-tit">Origen de la visita</div><div id="mon-origen" class="mon-origen"></div>' +
      '<div class="mon-tit">Últimos 12 eventos</div><ol id="mon-lista" class="mon-lista"></ol>' +
      '<div class="mon-pie"><button type="button" id="mon-reset">Simular nuevo visitante</button></div>' +
    '</aside><button type="button" id="mon-abrir">Mostrar monitor</button>';
  while (panel.firstChild) document.body.appendChild(panel.firstChild);

  var $ = function (id) { return document.getElementById(id); };

  var estado = $("mon-estado");
  if (est.activo) {
    estado.className = "mon-estado ok";
    estado.innerHTML = '<span class="mon-dot"></span><span>Conectado a ' + esc(est.id) + (est.debug ? " · modo depuración" : "") + '</span>';
  } else {
    estado.className = "mon-estado error";
    estado.innerHTML = '<span class="mon-dot"></span><span>Sin ID de medición: los eventos solo se muestran aquí. Edita js/config.js.</span>';
  }
  $("mon-origen").textContent = origen();

  function pintar() {
    var lista = [];
    try { lista = JSON.parse(sessionStorage.getItem(LOG_KEY) || "[]"); } catch (e) {}
    $("mon-lista").innerHTML = lista.length ? lista.map(function (e, idx) {
      return '<li class="' + (idx === 0 ? "mon-nuevo" : "") + '"><span class="mon-hora">' + new Date(e.t).toLocaleTimeString("es-CO", { hour12: false }) +
        '</span> <b class="mon-nombre">' + esc(e.n) + '</b><div class="mon-res">' + esc(e.r) + "</div></li>";
    }).join("") : '<li class="mon-res">Aún no hay eventos.</li>';
  }
  pintar();
  window.addEventListener("cervo:evento", pintar);

  function aplicarVisibilidad(oculto) {
    document.body.classList.toggle("mon-cerrado", oculto);
    document.body.classList.toggle("mon-abierto", !oculto);
    try { localStorage.setItem(OCULTO_KEY, oculto ? "1" : "0"); } catch (e) {}
  }
  var inicial = false;
  try { inicial = localStorage.getItem(OCULTO_KEY) === "1"; } catch (e) {}
  aplicarVisibilidad(inicial);
  $("mon-ocultar").addEventListener("click", function () { aplicarVisibilidad(true); });
  $("mon-abrir").addEventListener("click", function () { aplicarVisibilidad(false); });

  function borrarCookiesGA() {
    var host = location.hostname, partes = host.split("."), dominios = [null, host, "." + host];
    for (var i = 1; i < partes.length; i++) { var d = partes.slice(i).join("."); dominios.push(d, "." + d); }
    document.cookie.split(";").map(function (c) { return c.split("=")[0].trim(); })
      .filter(function (n) { return n.indexOf("_ga") === 0; })
      .forEach(function (n) {
        dominios.forEach(function (d) {
          document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
        });
      });
  }
  $("mon-reset").addEventListener("click", function () {
    borrarCookiesGA();
    try { localStorage.removeItem("cervo_carrito"); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    window.location.href = "index.html";
  });
})();
