# PassLP — Mobile App (MVP)

Aplicación móvil frontend para la cartelera, selección y compra de entradas a eventos y estacionamiento en La Plata, desarrollada con **Expo (SDK 57)**, **React Native (0.86)** con New Architecture, **Expo Router** y **TypeScript**.

---

## 📋 Requisitos previos

- **Node.js:** Versión `>= 20.x` (Recomendada: `v22.x`)
- **Gestor de paquetes:** `npm` (versión `>= 10.x`)
- **Dispositivo o entorno de pruebas:**
  - Teléfono físico con la aplicación **Expo Go** instalada (Android o iOS).
  - O emulador Android (Android Studio) / simulador iOS (Xcode en macOS).

---

## 🚀 Instalación y Puesta en Marcha

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/MVP-PassLP.git
   cd MVP-PassLP
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo (Metro Bundler):**
   ```bash
   npx expo start
   ```
   o mediante el script de npm:
   ```bash
   npm start
   ```

4. **Ejecutar en tu dispositivo:**
   - **En dispositivo físico con Expo Go:** Escanea el código QR que aparece en la terminal con la app Expo Go (en Android) o con la Cámara nativa (en iOS).
   - **En emulador Android:** Presiona `a` en la terminal (o ejecuta `npm run android`).
   - **En simulador iOS:** Presiona `i` en la terminal (o ejecuta `npm run ios`).
   - **En navegador Web:** Presiona `w` en la terminal (o ejecuta `npm run web`).

---

## 🛠️ Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `npm start` | `expo start` | Inicia el bundler Metro con recarga en vivo |
| `npm run android` | `expo start --android` | Inicia y abre directamente en el emulador Android |
| `npm run ios` | `expo start --ios` | Inicia y abre directamente en el simulador iOS |
| `npm run web` | `expo start --web` | Inicia la versión web para desarrollo rápido |
| `npm test` | `jest` | Ejecuta la suite de pruebas unitarias automatizadas |
| `npm run type-check`| `tsc --noEmit` | Verifica tipado estricto sin emitir archivos |
| `npm run lint` | `expo lint` | Ejecuta linter ESLint con reglas de Expo |

---

## 🏛️ Arquitectura del Proyecto

El código fuente se encuentra en la carpeta `src/`, siguiendo una arquitectura modular por capas desacopladas con rutas finas:

```
src/
├── __tests__/            # Pruebas unitarias automatizadas con Jest
├── app/                  # Rutas declarativas ultrafinas (Expo Router)
│   ├── _layout.tsx       # Root Stack Layout con transiciones de navegación
│   ├── (tabs)/           # Agrupación de pestañas inferiores (Bottom Tabs)
│   │   ├── _layout.tsx   # Layout de tabs con AppTabBar personalizada
│   │   ├── index.tsx     # Ruta fina que delega en HomeScreen
│   │   └── account.tsx   # Ruta fina que delega en AccountScreen
│   ├── event/[id].tsx    # Ruta fina que delega en EventDetailScreen
│   └── checkout/[id].tsx # Ruta fina que delega en CheckoutScreen
├── components/           # Componentes UI organizados por contexto
│   ├── checkout/         # Pasos del checkout (Resumen, Comprador, Asistentes, Confirmación, ProvinceSelectModal, PaymentSuccessModal)
│   ├── event/            # Componentes de evento (Hero, Acerca de, Lotes de entradas, Estacionamiento)
│   ├── home/             # Componentes de cartelera (Header, Carrusel, Filtros, Tarjetas)
│   ├── navigation/       # Componentes de navegación (AppTabBar)
│   └── ui/               # Componentes transversales e Iconos vectoriales nativos SVG
├── constants/            # Tokens de diseño y constantes de tema (Palette, Spacing, Fonts)
├── data/                 # Datos mock representativos de la cartelera real
├── features/             # Módulos de dominio autocontenidos
│   └── parking/          # Componentes y validadores de patentes de estacionamiento
├── hooks/                # Custom hooks (tema institucional useAppTheme)
├── screens/              # Pantallas desacopladas con lógica y presentación
│   ├── AccountScreen.tsx
│   ├── CheckoutScreen.tsx
│   ├── EventDetailScreen.tsx
│   └── HomeScreen.tsx
├── services/             # Fachada de servicios desacoplados (eventsService, checkoutService)
├── types/                # Contratos y tipos de dominio en TypeScript
└── utils/                # Utilidades de imágenes, carrusel, formateo y validación
```

---

## ✨ Funcionalidades Principales

1. **Cartelera institucional (Inicio):**
   - Búsqueda en tiempo real de eventos por título, lugar y categoría.
   - Filtro interactivo por categorías (Todas, Recitales, Fiestas, Boliches, Festivales) con transición suave.
   - Carrusel de eventos destacados con auto-scroll y banner visual.
   - Tarjetas con flyer en proporción 3:4, badges y precios actualizados.
   - Barra de navegación inferior fija (`AppTabBar`) integrada a Bottom Tabs de Expo Router con Safe Areas nativas.

2. **Detalle de Evento:**
   - Hero visual con flyer oficial y paleta adaptativa de fondo.
   - Selector interactivo de lotes de entradas con control de stock y topes máximos por persona.
   - Acordeón de compra de estacionamiento con agregado dinámico de vehículos (Sedán, Pickup) y validación de patente.
   - Barra inferior fija flotante con resumen de total en tiempo real y botón de continuar al checkout.

3. **Flujo de Compra (Checkout):**
   - **Stepper interactivo:** Se adapta dinámicamente a 3 o 4 pasos según si las entradas están a nombre del mismo titular o requieren nominación individual.
   - **Paso 1 (Resumen):** Desglose de entradas, vehículos y cálculo transparente del 15% de service fee.
   - **Paso 2 (Datos del Comprador):** Validación estricta de nombres sin caracteres especiales, DNI formateado con puntos, teléfono argentino, email válido y selector modal de provincias (`ProvinceSelectModal`).
   - **Paso 3 (Datos de Asistentes - Condicional):** Nominación de cada entrada individual cuando no es el mismo titular.
   - **Paso 4 (Confirmación):** Resumen final con sello de seguridad.
   - **Temporizador de 10 minutos:** Notificación de expiración y persistencia.
   - **Modal de pago integrado:** Simulación de éxito de pago con limpieza de carrito y retorno automático a cartelera.

4. **Identidad visual y Accesibilidad:**
   - Tema institucional claro uniforme con cabecera y footer oscuros institucionales (`Palette.charcoal`).
   - Sincronización de contraste de `StatusBar` para máxima legibilidad de hora y batería en cualquier modo del SO.
   - Iconografía 100% vectorial con `react-native-svg` (sin dependencia de fuentes pesadas).
   - Accesibilidad completa con roles semánticos, `accessibilityLabel` y `accessibilityState` en botones, steppers y acordeones.

---

## 🔄 Integración Continua (CI)

El proyecto cuenta con validación automatizada mediante **GitHub Actions** en `.github/workflows/ci.yml`, asegurando que cada cambio compile limpiamente (`npm run type-check`), ejecute la suite de tests (`npm test`) y respete las guías de estilo (`npm run lint`).
