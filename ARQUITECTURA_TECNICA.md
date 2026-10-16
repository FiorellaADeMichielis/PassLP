# Memoria Técnica y Decisiones de Arquitectura — PassLP Mobile (MVP)

Este documento detalla exhaustivamente los aspectos clave de ingeniería de software, arquitectura, gestión de estados, navegación, componentes de lista y validaciones implementadas en la aplicación móvil **PassLP (MVP)**, desarrollada con **Expo (SDK 57)**, **React Native (0.86)** con New Architecture, **Expo Router** y **TypeScript**.

Cada sección detalla:
1. **Qué es y cómo funciona** la solución técnica.
2. **Dónde está implementada** (archivos, componentes, funciones y líneas exactas con enlaces).
3. **Por qué se eligió (Justificación técnica, beneficios y trade-offs evaluados)**.

---

## 1. Tipos de Navegación Utilizados

La aplicación implementa una estrategia híbrida y desacoplada de navegación moderna mediante **Expo Router** (basado en el árbol de archivos), combinando dos navegadores nativos:

```
Root Stack (_layout.tsx)
├── (tabs) [Bottom Tabs]
│   ├── index (Cartelera principal de eventos)
│   └── account (Mi Cuenta y datos de usuario)
├── event/[id] [Stack Screen] (Detalle de evento y selección de entradas)
└── checkout/[id] [Stack Screen] (Embudo de compra interactivo en 4 pasos)
```

---

### A. Root Stack Navigation (Navegación en Pila Nativa)

#### 📍 Dónde está implementado:
- **Layout principal:** [`src/app/_layout.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/_layout.tsx#L37-L52)
- **Rutas administradas en la pila:**
  - `(tabs)`: Grupo de navegación inferior.
  - `event/[id]`: Pantalla de detalle de evento ([`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx)).
  - `checkout/[id]`: Pantalla de checkout ([`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx)).
- **Manejo de retroceso seguro:**
  - En [`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx#L40-L46): Verificación con `router.canGoBack() ? router.back() : router.replace('/')` para garantizar navegación predecible ante recargas o Deep Linking.
  - En [`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx#L85-L100): Retroceso controlado paso a paso entre las etapas del stepper y redirección a inicio tras la confirmación de pago.

#### 💡 Por qué se eligió (Justificación técnica):
1. **Modelo mental de embudo lineal (Funnel):** La compra de entradas y la visualización de un evento son flujos secuenciales y jerárquicos (`Cartelera → Detalle → Compra → Confirmación`). El Stack Nativo respeta la pila de pantallas del sistema operativo, permitiendo al usuario avanzar y retroceder de manera intuitiva mediante el botón atrás nativo de Android o el gesto táctil de borde (*swipe back*) en iOS.
2. **Aislamiento de la experiencia de compra:** El flujo de checkout requiere máxima concentración visual y cero distracciones. Al montarse como una pantalla en el Stack superior, la barra de pestañas inferiores desaparece de la vista, maximizando el área útil de la pantalla para los formularios y evitando que el teclado virtual tape botones de acción.
3. **Rendimiento nativo 60 FPS con `react-native-screens`:** A diferencia de navegadores simulados en JavaScript, el `<Stack>` de Expo Router utiliza vistas nativas de Android (`FragmentTransaction`) e iOS (`UINavigationController`). Las pantallas que quedan debajo de la pila se suspenden automáticamente, liberando memoria de GPU y CPU en dispositivos de gama media o baja.
4. **Transición fluida (`animation: 'slide_from_right'`):** Brinda la retroalimentación física esperada en apps móviles de ticketing de primer nivel (como Passline o Ticketek), indicando avance dimensional hacia adelante en el proceso.

---

### B. Bottom Tabs Navigation (Pestañas Inferiores Nativas)

#### 📍 Dónde está implementado:
- **Layout de pestañas:** [`src/app/(tabs)/_layout.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/(tabs)/_layout.tsx#L12-L37)
- **Componente de barra personalizada:** [`src/components/navigation/AppTabBar.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/navigation/AppTabBar.tsx#L17-L86)
- **Pestañas contenidas:**
  - `index`: Cartelera principal de eventos.
  - `account`: Mi Cuenta de usuario (datos personales y soporte).

#### 💡 Por qué se eligió (Justificación técnica):
1. **Ergonomía mobile y "Thumb Zone":** Según las guías de diseño de Material Design y Human Interface Guidelines (Apple), la zona inferior de la pantalla es el área de mayor confort biomecánico para interactuar con una sola mano en pantallas de más de 6 pulgadas. Ubicar allí las secciones principales elimina la necesidad de estirar el pulgar hacia la cabecera.
2. **Visibilidad inmediata vs. Menú Hamburguesa:** Los menús laterales ocultos (Drawer) disminuyen el descubrimiento de secciones y aumentan la fricción. La barra de pestañas expone permanentemente los dos destinos clave de la app.
3. **Preservación de estado de navegación:** Al alternar entre "Inicio" y "Mi Cuenta", las pantallas conservan intacto su estado en memoria (la búsqueda activa, la categoría filtrada y el punto de scroll) sin disparar desmontajes ni re-peticiones de datos.
4. **Comportamiento inteligente frente al teclado (`tabBarHideOnKeyboard: true`):** En formularios o filtros, la barra inferior se oculta automáticamente al abrir el teclado virtual, impidiendo que quede flotando de forma invasiva en el medio de la pantalla sobre Android.
5. **Acceso rápido al tope (Scroll-to-top):** Al presionar la pestaña "Inicio" estando ya ubicado en ella, el componente ejecuta un scroll animado suave hacia el encabezado (`scrollRef.current?.scrollTo({ y: 0, animated: true })`).

---

### C. Patrón de Rutas Finas (Thin Routes Pattern)

#### 📍 Dónde está implementado:
- [`src/app/(tabs)/index.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/(tabs)/index.tsx) $\rightarrow$ `export { default } from '@/screens/HomeScreen';`
- [`src/app/(tabs)/account.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/(tabs)/account.tsx) $\rightarrow$ `export { default } from '@/screens/AccountScreen';`
- [`src/app/event/[id].tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/event/[id].tsx) $\rightarrow$ `export { default } from '@/screens/EventDetailScreen';`
- [`src/app/checkout/[id].tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/checkout/[id].tsx) $\rightarrow$ `export { default } from '@/screens/CheckoutScreen';`

#### 💡 Por qué se eligió (Justificación técnica):
1. **Desacoplamiento total del framework de rutas:** Si la lógica, el estado y el JSX residen dentro de `src/app/`, el código queda fuertemente atado a las convenciones de Expo Router. Si en el futuro se migrase de router o se reutilizara una pantalla en un paquete compartido, el costo de refactorización sería alto.
2. **Facilidad para pruebas unitarias:** Las pantallas en `src/screens/` pueden instanciarse y probarse sin necesidad de simular el sistema completo de file-system routing de Expo.
3. **Principio de Responsabilidad Única (SRP):** La carpeta `src/app/` solo responde a la pregunta *"¿Qué URL o ruta existe?"*, mientras que `src/screens/` responde a *"¿Cómo se comporta la pantalla y qué datos muestra?"*.

---

## 2. Tipos de Listado Utilizados y Justificación

Para garantizar **60/120 FPS constantes**, mínimo consumo de memoria y accesibilidad en dispositivos móviles, se seleccionó el componente de lista adecuado según la naturaleza y el volumen de cada colección de datos:

| Tipo de Listado | Archivo de Implementación | Líneas | Justificación Técnica y "Por qué" |
|---|---|---|---|
| **`FlatList` (2 columnas)** | [`src/screens/HomeScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/HomeScreen.tsx) | Líneas 244-254 | **Virtualización y reciclado nativo:** Al ser un catálogo potencialmente extenso de eventos, `FlatList` recicla en memoria las celdas fuera del viewport, evitando saturar la memoria RAM. La grilla de 2 columnas aprovecha el ancho de pantalla para mostrar el flyer y el precio de forma atractiva duplicando la densidad de eventos visibles sin scroll excesivo. Cuenta con `ListEmptyComponent` para estados sin resultados y `scrollEnabled={false}` al estar contenido en un `ScrollView` maestro con Pull-to-Refresh. |
| **`Animated.FlatList` (Horizontal)** | [`src/components/home/FeaturedCarousel.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/home/FeaturedCarousel.tsx) | Líneas 47-154 | **Animación coverflow a 60 FPS en hilo nativo:** Se prefirió una `Animated.FlatList` con `useNativeDriver: true` sobre librerías externas pesadas (como `react-native-reanimated-carousel`), logrando cero dependencias añadidas. Implementa snap exacto (`snapToInterval`, `snapToAlignment="start"`, `disableIntervalMomentum={true}`) y cálculo centrado reactivo con `useWindowDimensions`. El evento `onScroll` interpolado escala y atenúa las tarjetas laterales suavemente sin trabar el hilo de JavaScript. |
| **`ScrollView` (Horizontal)** | [`src/components/home/CategoryFilter.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/home/CategoryFilter.tsx) | Líneas 37-83 | **Colección pequeña y estática (5 ítems):** Las categorías son exactamente 5 (*Todas, Recitales, Fiestas, Boliches, Festivales*). Usar una `FlatList` aquí añadiría sobrecarga innecesaria de virtualización y listeners de scroll para tan solo 5 elementos. Un `ScrollView` horizontal es más ligero, responde instantáneamente al deslizamiento táctil y expone roles accesibles (`tablist` y `tab`). |
| **`FlatList` (Vertical en Modal)** | [`src/components/checkout/ProvinceSelectModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/ProvinceSelectModal.tsx) | Líneas 41-76 | **Scroll inercial y reciclado en modal:** Renderiza las 24 jurisdicciones de Argentina (23 provincias + CABA). Asegura touch targets táctiles de $\ge 48$dp según normativas de accesibilidad (WCAG), scroll fluido dentro del modal y selección unívoca con confirmación visual de tilde institucional. |
| **Mapeos directos `.map()`** | - [`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx)<br>- [`src/components/event/ParkingSection.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/event/ParkingSection.tsx)<br>- [`src/components/checkout/OrderSummaryStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/OrderSummaryStep.tsx) | Líneas varias | **Prevención del error de listas virtualizadas anidadas:** En React Native, colocar una `FlatList` vertical dentro de un `ScrollView` vertical genera el error de consola *"VirtualizedLists should never be nested inside plain ScrollViews"*, degrada el rendimiento y produce saltos erráticos en el scroll. Al ser listas acotadas (1 a 4 tandas de entradas, 1 a 3 vehículos de parking), renderizarlas mediante `.map()` es $O(1)$, respeta el flujo de maquetación natural y resulta mucho más performante. |

---

## 3. Arquitectura y Patrones de Diseño

El proyecto fue estructurado bajo los principios de **Screaming Architecture**, **Clean Architecture Lite** y **Vertical Slices**, garantizando escalabilidad, facilidad de mantenimiento y legibilidad:

```
src/
├── __tests__/            # Suite de pruebas unitarias Jest (57 tests)
├── app/                  # Thin Routes (Expo Router, rutas y layouts)
├── components/           # Componentes UI organizados por feature
│   ├── checkout/         # Pasos y modales del checkout
│   ├── event/            # Detalle del evento, tandas y estacionamiento
│   ├── home/             # Header, Carrusel, Filtros, Tarjetas
│   ├── navigation/       # Barra inferior desacoplada (AppTabBar)
│   └── ui/               # Iconografía vectorial 100% SVG nativa
├── constants/            # Design Tokens (Palette, Spacing, Fonts)
├── data/                 # Mock estructurado de eventos reales
├── features/             # Vertical Slices para submódulos de dominio
│   └── parking/          # Reglas puras y componente de patente
├── hooks/                # Custom hooks (useAppTheme)
├── screens/              # Screen Containers (HomeScreen, EventDetailScreen, CheckoutScreen, AccountScreen)
├── services/             # Fachada de datos desacoplada (eventsService, checkoutService)
├── types/                # Modelos y contratos de TypeScript
└── utils/                # Funciones puras (formatters, validation, imageUtils, carouselUtils)
```

---

### Dónde está implementado cada patrón y por qué:

#### 1. Screaming Architecture (Estructura orientada al Dominio)
- **📍 Dónde:** En la jerarquía de carpetas [`src/components/home/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/home/), [`src/components/event/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/event/), [`src/components/checkout/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/) y [`src/features/parking/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/).
- **💡 Por qué:** A primera vista, la estructura "grita" de qué trata la aplicación (ticketing de eventos, checkout y estacionamiento), en lugar de ocultar la lógica de negocio detrás de carpetas técnicas genéricas como `views/` o `helpers/`. Cualquier desarrollador nuevo localiza el código del checkout en segundos.

#### 2. Container / Presentational Pattern
- **📍 Dónde:**
  - **Contenedores:** [`src/screens/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/) (`HomeScreen`, `EventDetailScreen`, `CheckoutScreen`, `AccountScreen`).
  - **Presentacionales:** [`src/components/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/) (`EventCard`, `HomeHeader`, `TicketTierItem`, `CheckoutStepper`, etc.).
- **💡 Por qué:** Los componentes de presentación son funciones puras que reciben `props` y emiten `callbacks`, sin acoplarse a APIs ni a navegación. Esto permite estilizarlos, reutilizarlos o testearlos en aislamiento sin tener que montar mocks complejos de navegación o red.

#### 3. Facade Pattern (Fachada de Servicios)
- **📍 Dónde:** [`src/services/index.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/services/index.ts) unificando [`eventsService.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/services/eventsService.ts) y [`checkoutService.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/services/checkoutService.ts).
- **💡 Por qué:** Aísla por completo las vistas de la infraestructura de datos. En este MVP los datos provienen de mocks tipados, pero cuando se integre una API REST, GraphQL o Supabase, únicamente se cambiará el código dentro de `src/services/`, dejando el 100% de la UI y los componentes intactos.

#### 4. Vertical Slice Pattern (Submódulo Autónomo)
- **📍 Dónde:** [`src/features/parking/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/)
  - Regla de dominio: [`domain/patente.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/domain/patente.ts)
  - Componente visual: [`components/PatenteInput.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/components/PatenteInput.tsx)
  - Punto de entrada público: [`index.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/index.ts)
- **💡 Por qué:** El estacionamiento vehicular tiene reglas propias y específicas (normalización de caracteres, validación alfanumérica, distinción de patentes tradicionales y Mercosur). Agrupar lógica, UI y tipos en una "rebanada vertical" evita contaminar el flujo de entradas generales y facilita su reutilización en futuros módulos de la plataforma.

#### 5. Compound Stepper Pattern (Flujo Multietapa)
- **📍 Dónde:** [`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx) orquestando:
  - [`CheckoutStepper.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/CheckoutStepper.tsx) (Barra de progreso visual).
  - [`OrderSummaryStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/OrderSummaryStep.tsx) (Paso 1: Desglose y cálculo del 15% de service fee).
  - [`BuyerFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/BuyerFormStep.tsx) (Paso 2: Datos del comprador).
  - [`AttendeesFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/AttendeesFormStep.tsx) (Paso 3: Nominación individual obligatoria).
  - [`OrderConfirmationStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/OrderConfirmationStep.tsx) (Paso 4: Confirmación y pago).
- **💡 Por qué:** Pedir todos los datos en un único formulario gigante genera fatiga y abandono de compra en pantallas móviles. Dividir el flujo en pasos progresivos valida la información etapa por etapa, mantiene enfocado al usuario y reduce los errores de carga.

#### 6. Single Responsibility Principle (SRP)
- **📍 Dónde:** Modales atómicos [`ProvinceSelectModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/ProvinceSelectModal.tsx) y [`PaymentSuccessModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/PaymentSuccessModal.tsx), y funciones de formateo en [`src/utils/formatters.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/formatters.ts).
- **💡 Por qué:** Cada archivo tiene una única razón para cambiar. Si cambia la presentación de la moneda o las provincias, se modifica un único archivo utilitario sin poner en riesgo la lógica del checkout.

---

## 4. Gestión de Estados: Globales y Locales

### A. Política Anti-Sobreingeniería (¿Por qué NO Redux / Zustand / MobX?)
Para el alcance y requerimientos de este MVP, **no se agregaron librerías externas de estado global**, debido a sólidas razones de ingeniería:
1. **Reducción radical del tamaño del bundle (APK):** Evitar dependencias de gestión global ahorra entre 50KB y 300KB de JavaScript compilado y tiempo de arranque (*cold start*).
2. **Cero boilerplate innecesario:** Redux o Zustand habrían demandado docenas de archivos adicionales de acciones, reducers, selectores o stores para pantallas que se consumen y desechan tras la compra.
3. **Flujos acotados y atómicos:** En ticketing móvil, una vez que el usuario confirma el pago de un evento, el estado del carrito no necesita persistir en un store global; se restablece para la próxima compra.

---

### B. Estado Local Reactivo (`useState`)

#### 📍 Dónde está implementado y qué resuelve:
- **`HomeScreen` ([`src/screens/HomeScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/HomeScreen.tsx)):**
  - `searchQuery` y `debouncedQuery`: Manejo de búsqueda textual con debounce de 250ms.
  - `selectedCategory`: Filtro de categoría activa.
  - `events` y `featuredEvents`: Catálogos cargados de forma asíncrona.
  - `isInitialLoading` y `refreshing`: Estados para placeholders y pull-to-refresh.
- **`EventDetailScreen` ([`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx)):**
  - `quantities`: Registro `{ [tierId: string]: number }` de entradas elegidas por tanda.
  - `parkingVehicles`: Arreglo de vehículos añadidos con patente y tipo.
- **`ParkingSection` ([`src/components/event/ParkingSection.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/event/ParkingSection.tsx)):**
  - `isExpanded`: Estado booleano de apertura del acordeón colapsable.
  - `selectedType`, `plate`, `model`: Campos transitorios del vehículo en edición.
- **`CheckoutScreen` ([`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx)):**
  - `currentStep`: Control de la pantalla activa del stepper.
  - `buyerData`: Datos del titular de la compra.
  - `attendeesData`: Nominaciones de cada entrada adquirida.
  - `isPaid` y `isSubmitting`: Flags de procesamiento y modal de éxito.

#### 💡 Por qué se eligió `useState`:
- **Aislamiento de re-renderizado:** Escribir en el campo de búsqueda de la Cartelera solo actualiza el subárbol de `HomeScreen`, sin gatillar re-renders accidentales en el resto de la aplicación.

---

### C. Persistencia y Control sin Re-render (`useRef`)

#### 📍 Dónde está implementado y por qué:
1. **Temporizador con Timestamp Absoluto ([`src/components/checkout/CheckoutTimer.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/CheckoutTimer.tsx)):**
   - **Cómo funciona:** `endTimeRef.current` guarda el milisegundo absoluto de expiración (`Date.now() + 600000` = 10 minutos).
   - **💡 Por qué `useRef`:** Si se usara un decrementador en `useState` cada 1 segundo (`timeLeft - 1`), se provocarían 60 re-renderizados por minuto en el árbol del checkout. Además, si el usuario minimiza la app o bloquea el teléfono, los timers de JavaScript se pausan; al reabrirla, `useRef` recalcula los segundos reales contra el reloj del sistema operativo sin desfasarse.
2. **Encadenamiento y Salto de Foco en Teclado:**
   - **En [`BuyerFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/BuyerFormStep.tsx):** `lastNameRef`, `dniRef`, `phoneRef`, `emailRef`, `confirmEmailRef`.
   - **💡 Por qué:** Permite que al presionar "Siguiente" en el teclado virtual, el foco salte instantáneamente al próximo campo sin intervención táctil manual.
3. **Auto-scroll Centrado sobre el Teclado:**
   - **En [`CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx) y [`EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx):** `scrollRef.current?.scrollTo({ y: offset, animated: true })`.
   - **💡 Por qué:** Garantiza que al enfocar un campo inferior, el `ScrollView` se desplace automáticamente hacia arriba para que el input no quede tapado por el teclado virtual.

---

### D. Micro-Proveedor de Tema Centralizado (`useAppTheme`)

#### 📍 Dónde está implementado:
- Hook: [`src/hooks/useAppTheme.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/hooks/useAppTheme.ts)
- Constantes: [`src/constants/theme.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/constants/theme.ts)

#### 💡 Por qué se eligió:
- Centraliza los Design Tokens institucionales (paleta de colores, espaciados, tipografías y el estilo de `StatusBar`) bajo un hook liviano de TypeScript puro con costo de ejecución cero, evitando librerías pesadas de CSS-in-JS (como Styled Components o Emotion) que degradan el rendimiento en React Native.

---

### E. Parámetros de Ruta Tipados (`useLocalSearchParams`)

#### 📍 Dónde está implementado:
- [`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx) $\rightarrow$ `useLocalSearchParams<{ id: string }>()`
- [`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx) $\rightarrow$ `useLocalSearchParams<{ id: string }>()`

#### 💡 Por qué se eligió:
- Hace que cada pantalla sea autosuficiente a partir del identificador del evento en la URL, habilitando **Deep Linking** (abrir la app directo en un evento desde un link de WhatsApp o Instagram) y eliminando el riesgo de estados globales desincronizados al salir y volver a entrar.

---

## 5. Validaciones: Enfoque y Librerías

### A. Validaciones Artesanales en TypeScript Puro (¿Por qué NO Zod / Yup / Formik?)

**No se utilizaron librerías externas de validación de esquemas ni gestores de formularios**. Todas las validaciones fueron desarrolladas de forma artesanal mediante **funciones puras y expresiones regulares estrictas**.

#### 💡 Por qué se eligió este enfoque:
1. **Cero peso agregado al APK:** Librerías como Yup o Zod añaden peso al paquete y sobrecarga de procesamiento en el arranque (*cold start*).
2. **Reglas de negocio 100% locales (Argentina y La Plata):** Ninguna librería internacional valida nativamente:
   - DNI argentino de 7 y 8 dígitos con formateo de puntos oficial.
   - Patentes vehiculares argentinas tradicionales (`ABC 123`) y Mercosur (`AB 123 CD`).
   - Prefijos telefónicos locales (código de área 221 para La Plata, 011 para AMBA).
   - Catálogo cerrado de las 23 provincias y CABA.
3. **Formateo y limpieza síncrona en tiempo real:** Permite interceptar la entrada del usuario mientras tipea (descartando números en el nombre o letras en el DNI) sin desfase visual en el input.

---

### B. Dónde está implementada cada validación y su regla técnica:

| Campo / Regla | Archivo de Implementación | Líneas | Regla Técnica y "Por qué" |
|---|---|---|---|
| **DNI Argentino** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts) | Líneas 54-74 | **`isValidDNI(dni)`:** Valida entre **7 y 8 dígitos numéricos** (`/^\d{7,8}$/`).<br>**Por qué:** Los DNI argentinos de personas mayores a ~40 años cuentan con 7 dígitos (ej. 8.XXX.XXX) y los de personas más jóvenes con 8 dígitos. Exigir exactamente 8 dígitos excluiría a miles de usuarios adultos.<br>**`formatDNI(dni)`:** Inserta automáticamente los puntos de miles (`XX.XXX.XXX`). |
| **Nombre y Apellido** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts) | Líneas 27-37 | **`isValidName(name)`:** Requiere al menos 2 caracteres y solo permite letras, espacios, apóstrofes y tildes (`/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/`).<br>**Por qué:** Evita que se introduzcan caracteres espurios, emojis o números en la nominación de tickets oficiales de acceso. |
| **Teléfono** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts) | Líneas 42-52 | **`isValidPhone(phone)`:** Admite entre **8 y 13 dígitos numéricos** (`/^\d{8,13}$/`).<br>**Por qué:** Da soporte tanto a números fijos locales (ej. 221-XXXXXXX de 9 dígitos), móviles con prefijo (10 dígitos) como a números con código de país internacional (`+54 9 ...` de hasta 13 dígitos). |
| **Email y Confirmación** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts) | Líneas 79-82 | **`isValidEmail(email)`:** Expresión regular simplificada compatible con RFC 5322 (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).<br>**Por qué:** Verifica la existencia de usuario, arroba y dominio válido sin la sobrecarga de expresiones regulares de 200 caracteres propensas a vulnerabilidades ReDoS. En [`BuyerFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/BuyerFormStep.tsx) se exige coincidencia idéntica entre email y confirmación para evitar que el comprador pierda sus entradas por un error tipográfico. |
| **Patente Vehicular** | [`src/features/parking/domain/patente.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/domain/patente.ts) | Líneas 13-26 | **`validarPatente(patente)`:** Permite entre **3 y 12 caracteres alfanuméricos ASCII** (`/^[A-Za-z0-9]{3,12}$/`).<br>**Por qué:** Es compatible con formato Mercosur (`AB123CD`), formato anterior (`ABC123`), patentes de motocicletas y pickups sin bloquear al usuario en el ingreso. Normaliza a mayúsculas de inmediato (`normalizarPatente`). |
| **Provincias Argentinas** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts) | Líneas 4-22 | **`ARGENTINE_PROVINCES`:** Array cerrado de 24 jurisdicciones oficiales.<br>**Por qué:** Alimenta al modal [`ProvinceSelectModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/ProvinceSelectModal.tsx) garantizando consistencia de datos de facturación sin errores de ortografía de tipeo libre. |

---

### C. Blindaje y Aseguramiento de Calidad con Jest (57 Pruebas Unitarias)

#### 📍 Dónde están implementadas:
- [`src/__tests__/validation.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/validation.test.ts): Pruebas de DNI (7 y 8 dígitos), nombres, teléfonos, emails y provincias.
- [`src/__tests__/patente.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/patente.test.ts): Pruebas de validación y normalización de patentes vehiculares.
- [`src/__tests__/checkoutService.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/checkoutService.test.ts): Pruebas del cálculo del 15% de service fee y subtotales monetarios.
- [`src/__tests__/formatters.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/formatters.test.ts): Pruebas de formateo de moneda institucional.
- [`src/__tests__/carouselUtils.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/carouselUtils.test.ts): Pruebas del algoritmo de centrado geométrico del carrusel.
- [`src/__tests__/eventsService.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/eventsService.test.ts): Pruebas del catálogo de eventos, búsqueda reactiva y filtros.

#### 💡 Por qué se implementó esta suite de tests:
- Al no utilizar librerías externas de validación, **las pruebas automatizadas garantizan que ninguna refactorización futura rompa las reglas matemáticas o de negocio críticas** de la aplicación (precios, comisiones y validaciones de identidad).
