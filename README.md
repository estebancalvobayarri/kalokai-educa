# Kalokai Educa

Web de Kalokai Educa, la línea de Kalokai para centros educativos: formación para profesorado, alumnado y familias de colegios de primaria y secundaria. «Bienestar y formación para toda la comunidad educativa».

## Estructura

- `index.html`: inicio, con los tres públicos, las dos líneas de formación, los programas y cómo trabajamos.
- `formaciones.html`: catálogo de las 28 formaciones, con filtro por público.
- `privacidad.html` y `aviso-legal.html`: páginas legales.
- `styles.css`: paleta, tipografía y maquetación.
- `script.js`: menú de móvil, cabecera al desplazarse, formulario de contacto y filtro del catálogo.
- `favicon.svg`: icono del sitio.

Es una web estática, sin dependencias ni compilación. Para verla en local, abre `index.html` en el navegador.

## Identidad visual

Fondos claros y un único acento azul. Tipografías: Bricolage Grotesque para titulares y Figtree para textos, como en Kalokai.

| Nombre | Color | Uso |
| --- | --- | --- |
| Blanco | `#FFFFFF` | Fondo principal |
| Tiza | `#F4F6FA` | Secciones alternas y pie |
| Celeste | `#E8EEFB` | Fondos suaves del acento |
| Tinta | `#0E1726` | Texto principal (el azul noche de Kalokai) |
| Pizarra | `#5B6678` | Texto secundario |
| Azul Educa | `#2456C9` | Botones, enlaces y detalles |

Logo: el símbolo de Kalokai (arco en tinta y círculo en azul) junto a «kalokai» y «educa» en azul.

## Contacto

El formulario prepara un correo a `hola@kalokai.es` (en `script.js`). WhatsApp: 653 803 390.

## Publicación

La web se publica con GitHub Pages desde la rama `main` en el dominio `educa.kalokai.es` (archivo `CNAME`). En el proveedor del dominio hace falta un registro CNAME para `educa` que apunte a `estebancalvobayarri.github.io`.
