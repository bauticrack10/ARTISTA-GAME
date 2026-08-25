# Directrices del Proyecto - El Artista

## Reglas de Diseño e Interfaz de Usuario (UI/UX)

- **Consulta Obligatoria de design.md:** Antes de crear, modificar o proponer cualquier elemento visual, componente de interfaz, estilo CSS, maquetación o diseño, consulta el archivo design.md en la raíz del proyecto.
- **Consistencia de Estilo:** Todo cambio visual debe respetar estrictamente el sistema de diseño definido en design.md:
  - **Fondo:** Crema cálido (#f7f4ed), nunca blanco puro.
  - **Texto y Contrastes:** Charcoal (#1c1c1c) y escalas de opacidad, texto secundario #5f5f5d.
  - **Bordes y Contenedores:** 1px solid #eceae4 en tarjetas e imágenes, sin sombras pesadas.
  - **Botones:** Botón oscuro con sombra *inset* característica (gba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px), radio 6px para botones rectangulares y 9999px únicamente para píldoras/iconos.
  - **Tipografía y Jerarquía:** Camera Plain Variable (o fallbacks ui-sans-serif, system-ui), pesos 400 y 600, con espaciado negativo en titulares grandes.
