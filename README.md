# Cervo · Tienda ficticia para el laboratorio de GA4

Sitio **académico de simulación** (Diplomado en E-commerce y Negocios Internacionales Digitales). Vende ropa deportiva ficticia, no procesa pagos, no guarda datos personales y usa Google Analytics 4. Solo HTML, CSS y JavaScript puros: sin servidor, sin base de datos, sin npm.

## Qué debes editar
Solo `js/config.js`:
```js
window.TIENDA_CONFIG = { GA_MEASUREMENT_ID: "G-XXXXXXXXXX", DEBUG_MODE: true };
```
Pega tu ID de medición (GA4 > Administrar > Flujos de datos > tu flujo web). Con `G-XXXXXXXXXX` no se carga gtag.js y el monitor muestra un aviso rojo. Con `DEBUG_MODE: true` verás los eventos en **GA4 > Administrar > DebugView**.

## Estructura
`index.html` (catálogo) · `producto.html?id=CER-001` · `carrito.html` · `checkout.html` · `gracias.html` · `css/estilos.css` · `js/` (`config`, `analytics`, `productos`, `carrito`, `monitor` y un archivo `pagina-*.js` por página).

## Reglas de negocio
- Cupón `BIENVENIDA10`: 10 % de descuento, desde el carrito o con el banner del inicio.
- Envío: Nacional Estándar $12.000, Nacional Express $25.000, Internacional Estándar $95.000, Internacional Express $160.000. Nacional Estándar es gratis cuando los productos (ya con descuento) suman $150.000 o más.
- Países: Colombia (Nacional) y otros siete (Internacional).

## Eventos (contrato de medición)
`view_item_list`, `view_promotion`, `select_promotion`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`. Todos con `currency: "COP"`. Con cupón, cada ítem lleva `price` con descuento, `discount` por unidad y `coupon`. `purchase.value` = suma de `price × quantity` (sin envío). La propiedad de usuario `tipo_cliente` se define al confirmar el envío y otra vez en `gracias.html`, antes de `purchase`, porque la página nueva empieza sin ella.

`purchase` se envía una sola vez por pedido: el pedido queda en `sessionStorage` y se marca como enviado.

## Monitor de eventos
Panel derecho de 380 px (abajo, 300 px, en pantallas menores de 820 px). Muestra el estado de la conexión, el origen UTM de la primera página de la sesión y los últimos 12 eventos. **Simular nuevo visitante** borra las cookies `_ga*`, el carrito y `sessionStorage`, y vuelve al inicio. Para probar UTM: `index.html?utm_source=linkedin&utm_medium=social&utm_campaign=lab_ga4`.

## Publicar (GitHub + Vercel)
1. En github.com: **New repository**, nombre `cervo`, público, **Create repository**.
2. Descomprime el .zip. En el repositorio: **Add file > Upload files** y arrastra **el contenido** de la carpeta (que `index.html` quede en la raíz, junto a `css/` y `js/`). **Commit changes**.
3. En vercel.com: **Add New > Project**, importa el repositorio `cervo`.
4. **Framework Preset: Other**. Deja Build Command y Output Directory vacíos. **Deploy**.
5. Para cambiar el ID más tarde, edita `js/config.js` en GitHub (lápiz > Commit); Vercel republica solo.
