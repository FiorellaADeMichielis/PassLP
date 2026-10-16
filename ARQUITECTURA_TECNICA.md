# Memoria Técnica y Decisiones de Arquitectura — PassLP Mobile (MVP)

Este documento detalla los aspectos clave de ingeniería de software, arquitectura, gestión de estado, navegación, listas y validaciones implementadas en la aplicación móvil **PassLP (MVP)**, desarrollada con **Expo (SDK 57)**, **React Native (0.86)** con New Architecture, **Expo Router** y **TypeScript**.

Cada sección incluye la **ubicación exacta de archivos y componentes** donde está implementada cada característica técnica.

---

## 1. Tipos de Navegación Utilizados

La aplicación implementa una estrategia híbrida y desacoplada de navegación moderna mediante **Expo Router** (basado en el árbol de archivos), combinando dos navegadores nativos:

### A. Root Stack Navigation (Navegación en Pila Nativa)
- **Dónde está implementado:** [`src/app/_layout.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/_layout.tsx)
- **Tecnología:** `<Stack>` nativo respaldado por `react-native-screens` y `@react-navigation/native-stack`.
- **Configuración (`screenOptions`):**
  - `headerShown: false`: Se oculta la barra por defecto del sistema para renderizar la cabecera institucional personalizada.
  - `animation: 'slide_from_right'`: Transiciones laterales fluidas nativas entre pantallas.
- **Rutas administradas:**
  - `(tabs)`: Grupo de navegación inferior de pestañas.
  - `event/[id]`: Pantalla de detalle de evento (S2).
  - `checkout/[id]`: Flujo de compra con stepper interactivo (S3/S4).
- **Gestión de retroceso seguro:**
  - En [`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx): Intercepción con `router.canGoBack() ? router.back() : router.replace('/')` para prevenir errores de navegación en Web y Android.
  - En [`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx): Navegación hacia atrás paso a paso en el stepper y retorno a `/` al confirmar pago.

### B. Bottom Tabs Navigation (Pestañas Inferiores Nativas)
- **Dónde está implementado:** 
  - Layout de pestañas: [`src/app/(tabs)/_layout.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/(tabs)/_layout.tsx)
  - Componente de barra desacoplada: [`src/components/navigation/AppTabBar.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/navigation/AppTabBar.tsx)
- **Tecnología:** `<Tabs>` nativo de Expo Router mediante la convención de Route Group `(tabs)`.
- **Configuración destacada:**
  - `tabBar={(props) => <AppTabBar {...props} />}`: Barra de navegación inferior fija institucional (`#332F2B`), con cálculo dinámico de Safe Area Insets (`useSafeAreaInsets`).
  - `tabBarHideOnKeyboard: true`: Oculta automáticamente las pestañas al desplegar el teclado virtual para maximizar el área de lectura.
  - `animation: 'fade'`: Transición visual suave entre las pantallas de tabs.
- **Pestañas contenidas:**
  - `index`: Cartelera principal de eventos.
  - `account`: Mi Cuenta de usuario (datos institucionales).
- **Preservación de estado y Scroll-to-top:**
  - Al alternar entre Inicio y Cuenta, las pantallas conservan su estado en memoria sin re-montarse.
  - Al presionar la pestaña de Inicio estando en ella, ejecuta scroll suave al inicio (`scrollRef.current?.scrollTo({ y: 0, animated: true })`).

### C. Patrón de Rutas Finas (Thin Routes Pattern)
- **Dónde está implementado:**
  - [`src/app/(tabs)/index.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/(tabs)/index.tsx) $\rightarrow$ `export { default } from '@/screens/HomeScreen';`
  - [`src/app/(tabs)/account.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/(tabs)/account.tsx) $\rightarrow$ `export { default } from '@/screens/AccountScreen';`
  - [`src/app/event/[id].tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/event/[id].tsx) $\rightarrow$ `export { default } from '@/screens/EventDetailScreen';`
  - [`src/app/checkout/[id].tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/checkout/[id].tsx) $\rightarrow$ `export { default } from '@/screens/CheckoutScreen';`
- **Propósito:** El directorio `src/app/` solo contiene la declaración de rutas de 1 línea. Toda la lógica de negocio, ciclo de vida y renderizado reside en componentes desacoplados dentro de `src/screens/`.

---

## 2. Tipos de Listado Utilizados y Justificación

Para asegurar 60/120 FPS constantes, mínimo consumo de memoria y accesibilidad en dispositivos móviles, se seleccionó el componente de lista adecuado según el volumen y naturaleza de los datos:

| Tipo de Listado | Archivo de Implementación | Justificación Técnica |
|---|---|---|
| **`FlatList` (2 columnas)** | [`src/screens/HomeScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/HomeScreen.tsx)<br>*(Líneas 244-254)* | **Virtualización nativa:** Maneja el catálogo dinámico de eventos con `numColumns={2}`, `columnWrapperStyle={styles.row}`, reciclado de celdas en memoria, `keyExtractor` determinista, `renderItem` con `EventCard` y `ListEmptyComponent` para estados de búsqueda vacía o carga. `scrollEnabled={false}` al estar contenido dentro del `ScrollView` con pull-to-refresh. |
| **`Animated.FlatList` (Horizontal)** | [`src/components/home/FeaturedCarousel.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/home/FeaturedCarousel.tsx)<br>*(Líneas 47-154)* | **Animación de alto rendimiento:** Ejecución en hilo nativo (`useNativeDriver: true`). Snap centrado geométrico exacto (`snapToInterval`, `snapToAlignment="start"`, `disableIntervalMomentum={true}`) con `getItemLayout` y ancho reactivo (`useWindowDimensions`). La interpolación de `scrollX` controla la escala y opacidad con efecto coverflow. |
| **`ScrollView` (Horizontal)** | [`src/components/home/CategoryFilter.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/home/CategoryFilter.tsx)<br>*(Líneas 37-83)* | **Colección pequeña y fija:** Las categorías son exactamente 5 (*Todas, Recitales, Fiestas, Boliches, Festivales*). Un `ScrollView` horizontal es más ligero que una `FlatList`, no requiere sobrecarga de virtualización y ofrece deslizamiento táctil con roles accesibles (`accessibilityRole="tablist"` / `"tab"`). |
| **`FlatList` (Vertical en Modal)** | [`src/components/checkout/ProvinceSelectModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/ProvinceSelectModal.tsx)<br>*(Líneas 41-76)* | **Selector modal accesible:** Renderiza las 24 jurisdicciones de Argentina (23 provincias + CABA). Asegura scroll inercial suave, áreas táctiles accesibles (touch targets $\ge 48$dp) y confirmación visual con tilde verde institucional. |
| **Mapeos directos `.map()`** | - [`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx)<br>- [`src/components/event/ParkingSection.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/event/ParkingSection.tsx)<br>- [`src/components/checkout/OrderSummaryStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/OrderSummaryStep.tsx) | **Listas cortas acotadas:** Las tandas de entradas por evento son de 1 a 4, y los vehículos de parking agregados de 1 a 3. Usar listas virtualizadas anidadas dentro de un `ScrollView` causaría la advertencia clásica de React Native (*"VirtualizedLists should never be nested inside plain ScrollViews"*). Mapear directamente el array es más performante y mantiene el layout natural. |

---

## 3. Arquitectura y Patrones de Diseño

El proyecto aplica **Screaming Architecture**, **Clean Architecture Lite** y **Vertical Slices**:

```
src/
├── __tests__/            # Suite de pruebas unitarias Jest (57 tests)
├── app/                  # Thin Routes (Expo Router, rutas y layouts)
├── components/           # Componentes UI organizados por feature
│   ├── checkout/         # Pasos y modales del checkout
│   ├── event/            # Detalle del evento, lotes y estacionamiento
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

### Dónde está implementado cada patrón:

1. **Screaming Architecture (Estructura orientada al Dominio):**
   - La estructura de carpetas refleja las entidades de negocio: [`src/components/home/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/home/), [`src/components/event/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/event/), [`src/components/checkout/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/) y [`src/features/parking/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/).
2. **Container / Presentational Pattern:**
   - **Contenedores inteligentes:** [`src/screens/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/) (`HomeScreen`, `EventDetailScreen`, `CheckoutScreen`, `AccountScreen`), responsables de llamadas a servicios, efectos y manejo de estado.
   - **Componentes de presentación puros:** [`src/components/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/) (`EventCard`, `HomeHeader`, `TicketTierItem`, `CheckoutStepper`, etc.), reciben datos por props y emiten eventos por callbacks.
3. **Facade Pattern (Fachada de Servicios):**
   - **Implementado en:** [`src/services/index.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/services/index.ts)
   - Unifica el acceso a [`eventsService.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/services/eventsService.ts) y [`checkoutService.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/services/checkoutService.ts). La UI solo conoce contratos de [`src/types/index.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/types/index.ts), permitiendo sustituir mocks por un backend real tocando únicamente la capa de servicios.
4. **Vertical Slice Pattern:**
   - **Implementado en:** [`src/features/parking/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/)
   - Contiene la regla pura de dominio ([`domain/patente.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/domain/patente.ts)), el componente visual ([`components/PatenteInput.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/components/PatenteInput.tsx)) y su API pública ([`index.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/index.ts)).
5. **Compound Stepper Pattern:**
   - **Implementado en:** [`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx)
   - Orquesta los pasos independientes:
     - [`CheckoutStepper.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/CheckoutStepper.tsx) (Barra de progreso visual)
     - [`OrderSummaryStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/OrderSummaryStep.tsx) (Paso 1: Desglose y 15% de servicio)
     - [`BuyerFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/BuyerFormStep.tsx) (Paso 2: Datos del comprador)
     - [`AttendeesFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/AttendeesFormStep.tsx) (Paso 3: Nominación individual de asistentes)
     - [`OrderConfirmationStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/OrderConfirmationStep.tsx) (Paso 4: Resumen final y botón de pago)
6. **Single Responsibility Principle (SRP):**
   - Extracción de modales independientes: [`ProvinceSelectModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/ProvinceSelectModal.tsx) y [`PaymentSuccessModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/PaymentSuccessModal.tsx).
   - Formateo de moneda desacoplado de la lógica de precios: [`src/utils/formatters.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/formatters.ts).

---

## 4. Gestión de Estados: Globales y Locales

### A. Política Anti-Sobreingeniería (Sin Redux / Zustand / MobX)
Para el alcance de este MVP, **no se agregaron dependencias pesadas de estado global**, reduciendo drásticamente el peso del APK y eliminando la complejidad de boilerplate.

### B. Estado Local Reactivo (`useState`)
- **HomeScreen ([`src/screens/HomeScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/HomeScreen.tsx)):**
  - `searchQuery` y `debouncedQuery` (búsqueda en tiempo real con debounce de 250ms).
  - `selectedCategory` (categoría activa).
  - `events` y `featuredEvents` (colecciones cargadas desde servicios).
  - `isInitialLoading` y `refreshing` (estados de carga y pull-to-refresh).
- **EventDetailScreen ([`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx)):**
  - `quantities` (registro de cantidad seleccionada por tanda de tickets).
  - `parkingVehicles` (lista dinámica de vehículos de estacionamiento agregados).
- **ParkingSection ([`src/components/event/ParkingSection.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/event/ParkingSection.tsx)):**
  - `isExpanded` (acordeón desplegable).
  - `selectedType` (Sedán o Pickup).
  - `plate` y `model` (campos de entrada de patente y modelo vehicular).
- **CheckoutScreen ([`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx)):**
  - `currentStep` (paso activo del stepper: summary, buyer, attendees, confirmation).
  - `buyerData` (nombre, apellido, DNI, teléfono, email, provincia).
  - `attendeesData` (nominación individual por ticket).
  - `isPaid` y `isSubmitting` (confirmación y modal de pago completado).

### C. Persistencia y Control sin Re-render (`useRef`)
- **Temporizador con Timestamp Absoluto ([`src/components/checkout/CheckoutTimer.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/CheckoutTimer.tsx)):**
  - `endTimeRef.current`: Almacena el `timestamp` absoluto (`Date.now() + 600000`). Calcula los minutos y segundos restantes comparando contra el reloj del sistema, sobreviviendo al paso a segundo plano o bloqueo del teléfono.
- **Salto de Foco Secuencial en Inputs:**
  - En [`BuyerFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/BuyerFormStep.tsx): `lastNameRef`, `dniRef`, `phoneRef`, `emailRef`, `confirmEmailRef`.
  - En [`AttendeesFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/AttendeesFormStep.tsx): Encadenamiento de inputs entre asistentes.
- **Auto-scroll Centrado sobre el Teclado:**
  - En [`CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx) y [`EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx): `scrollRef.current?.scrollTo({ y: offset, animated: true })` para mantener visible el campo de texto activo por encima del teclado virtual.

### D. Micro-Proveedor de Tema Centralizado (`useAppTheme`)
- **Dónde está implementado:** 
  - Hook: [`src/hooks/useAppTheme.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/hooks/useAppTheme.ts)
  - Constantes: [`src/constants/theme.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/constants/theme.ts)
- **Propósito:** Centraliza la paleta institucional (`Palette`), el contraste accesible de la barra de estado superior (`StatusBar style="light"`) y los espaciados, consumido de manera uniforme en pantallas y componentes sin prop-drilling.

### E. Parámetros de Ruta Tipados
- **Dónde está implementado:** 
  - [`src/screens/EventDetailScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/EventDetailScreen.tsx) $\rightarrow$ `useLocalSearchParams<{ id: string }>()`
  - [`src/screens/CheckoutScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/CheckoutScreen.tsx) $\rightarrow$ `useLocalSearchParams<{ id: string }>()`
- Garantiza independencia de pantallas y compatibilidad total con enlaces profundos (Deep Linking).

---

## 5. Validaciones: Enfoque y Librerías

### A. Validaciones Puras "A Mano" (Vanilla TypeScript)
**No se utilizaron librerías externas de formularios ni esquemas** (como Formik, React Hook Form, Yup o Zod). Todas las validaciones fueron implementadas artesanalmente con **funciones puras y expresiones regulares estrictas**.

**Beneficios:**
- Cero dependencias pesadas que inflen el APK universal.
- Rendimiento síncrono instantáneo sin capas intermedias.
- Reglas específicas adaptadas al mercado argentino y La Plata.

### B. Dónde está implementada cada validación:

| Campo / Regla | Archivo de Implementación | Funciones y Expresiones Regulares |
|---|---|---|
| **DNI Argentino** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)<br>*(Líneas 54-74)* | - `isValidDNI(dni)`: Valida entre **7 y 8 dígitos numéricos** (`/^\d{7,8}$/`), admitiendo tanto documentos tradicionales previos a 10M como documentos actuales.<br>- `formatDNI(dni)`: Formateo automático con separador de miles oficial (`X.XXX.XXX` y `XX.XXX.XXX`).<br>- `normalizeDNI(raw)`: Elimina espacios y puntos para almacenamiento puro. |
| **Nombre y Apellido** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)<br>*(Líneas 27-37)* | - `isValidName(name)`: Exige solo letras, tildes y espacios (`/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/`), mínimo 2 caracteres.<br>- `cleanName(raw)`: Limpieza en tiempo real descartando números y caracteres especiales. |
| **Teléfono** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)<br>*(Líneas 42-52)* | - `isValidPhone(phone)`: Rango de entre **8 y 13 dígitos numéricos** (`/^\d{8,13}$/`) para soportar prefijos locales (221 La Plata, 011 AMBA) y códigos de país.<br>- `formatPhone(raw)`: Formateo con guiones legibles. |
| **Email y Confirmación** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)<br>*(Líneas 79-82)* | - `isValidEmail(email)`: Expresión regular estándar RFC 5322 simplificada (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).<br>- Validación de coincidencia estricta entre "Email" y "Confirmar Email" en [`BuyerFormStep.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/BuyerFormStep.tsx). |
| **Patente Vehicular** | [`src/features/parking/domain/patente.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/domain/patente.ts)<br>*(Líneas 13-26)* | - `validarPatente(patente)`: Admite entre **3 y 12 caracteres alfanuméricos ASCII** (`/^[A-Za-z0-9]{3,12}$/`).<br>- `normalizarPatente(raw)`: Normalización inmediata a mayúsculas descartando espacios y símbolos.<br>- Compatible con formato Mercosur (`AB123CD`), tradicional (`ABC123`), motos y pickups. |
| **Provincias Argentinas** | [`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)<br>*(Líneas 4-22)* | - `ARGENTINE_PROVINCES`: Catálogo cerrado de las 23 provincias argentinas más la Ciudad Autónoma de Buenos Aires, consumido por [`ProvinceSelectModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/ProvinceSelectModal.tsx). |

### C. Blindaje con Pruebas Automatizadas (Jest)
Todas las reglas puras de cálculo y validación cuentan con **57 pruebas unitarias automatizadas**:
- [`src/__tests__/validation.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/validation.test.ts): Tests de DNI (7 y 8 dígitos), nombres, teléfonos, emails y provincias.
- [`src/__tests__/patente.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/patente.test.ts): Tests de validación y normalización de patentes.
- [`src/__tests__/checkoutService.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/checkoutService.test.ts): Tests de cálculo del 15% de service fee y subtotales.
- [`src/__tests__/formatters.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/formatters.test.ts): Tests de formateo monetario institucional con separador de miles.
- [`src/__tests__/carouselUtils.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/carouselUtils.test.ts): Tests de navegación y centrado de carrusel.
- [`src/__tests__/eventsService.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/eventsService.test.ts): Tests de catálogo, búsqueda y filtrado por categoría.
