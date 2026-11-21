/* ============================================================
   CONFIGURACIÓN DE LA TIENDA  (único archivo que debes editar)
   ============================================================

   1) GA_MEASUREMENT_ID
      Pega aquí tu ID de medición de Google Analytics 4.
      Dónde encontrarlo: GA4 > Administrar (engranaje) > Flujos de datos
      > tu flujo web > "ID de medición". Tiene el formato G-XXXXXXXXXX.
      Mientras el valor sea "G-XXXXXXXXXX", NO se carga gtag.js y los
      eventos solo se muestran en el Monitor de eventos (panel derecho).

   2) DEBUG_MODE
      true  -> los eventos llegan a GA4 > Administrar > DebugView.
      false -> envío normal, sin modo de depuración.
*/
window.TIENDA_CONFIG = {
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX", // <- reemplaza por tu ID, por ejemplo "G-AB12CD34EF"
  DEBUG_MODE: true                   // <- true mientras pruebas; false para el envío normal
};
