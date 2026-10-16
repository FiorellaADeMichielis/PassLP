# Memoria Técnica y Decisiones de Arquitectura — PassLP Mobile (MVP)

Este documento detalla los aspectos clave de ingeniería de software, arquitectura, gestión de estado, navegación, listas y validaciones implementadas en la aplicación móvil **PassLP (MVP)**, desarrollada con **Expo (SDK 57)**, **React Native (0.86)** con New Architecture, **Expo Router** y **TypeScript**.

---

## 1. Tipos de Navegación Utilizados

La aplicación implementa una estrategia híbrida y desacoplada de navegación moderna mediante **Expo Router** (basado en el árbol de archivos), combinando dos navegadores nativos:

### A. Root Stack Navigation (Navegación en Pila)
- **Archivo principal:** [`src/app/_layout.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/_layout.tsx)
- **Tecnología:** `<Stack>` nativo respaldado por `react-native-screens` y `@react-navigation/native-stack`.
- **Configuración:** `screenOptions={{ headerShown: false, animation: 'slide_from_right' }}`.
- **Propósito:** Maneja las pantallas de flujo completo con transiciones laterales nativas fluidas (`slide_from_right`):
  - `(tabs)`: Contenedor de la navegación principal de pestañas.
  - `event/[id]`: Pantalla de detalle de evento, tandas de entradas y estacionamiento.
  - `checkout/[id]`: Pantalla del flujo de compra con stepper interactivo.
- **Gestión de retroceso:** Botón atrás nativo de Android interceptado de manera coherente y navegación segura en Web/móvil mediante `router.canGoBack()`.

### B. Bottom Tabs Navigation (Pestañas Inferiores)
- **Archivos:** [`src/app/(tabs)/_layout.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/(tabs)/_layout.tsx) y [`src/components/navigation/AppTabBar.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/navigation/AppTabBar.tsx)
- **Tecnología:** `<Tabs>` nativo de Expo Router mediante la convención de Route Group `(tabs)`.
- **Configuración:** 
  - Barra personalizada desacoplada (`tabBar={(props) => <AppTabBar {...props} />}`).
  - Ocultamiento ante apertura del teclado (`tabBarHideOnKeyboard: true`).
  - Animación de cambio limpia con transición visual suave.
  - Safe Area Insets nativos calculados dinámicamente (`useSafeAreaInsets`).
- **Destinos activos:** `index` (Inicio / Cartelera) y `account` (Mi Cuenta), manteniendo el estado y posición de scroll de cada pantalla en memoria sin re-montajes innecesarios.

### C. Patrón de Rutas Finas (Thin Routes)
- Los archivos dentro del directorio [`src/app/`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/app/) actúan estrictamente como envoltorios declarativos de ruta (`export { default } from '@/screens/...'`), delegando la lógica de presentación y ciclo de vida a componentes aislados en `src/screens/`.

---

## 2. Tipos de Listado Utilizados y Justificación

Para asegurar un rendimiento óptimo de 60/120 FPS, bajo consumo de memoria y accesibilidad en dispositivos móviles, se seleccionó el componente de lista adecuado según el volumen y la naturaleza de los datos:

| Componente | Pantalla / Ubicación | Por qué se utilizó |
|---|---|---|
| **`FlatList` (2 columnas)** | [`src/screens/HomeScreen.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/screens/HomeScreen.tsx) (Grilla de eventos) | Virtualización de elementos en pantalla. Maneja un catálogo dinámico y potencialmente extenso con `numColumns={2}`, reciclado de celdas en memoria, `keyExtractor` estable y `ListEmptyComponent` para estados de carga y búsqueda vacía. |
| **`Animated.FlatList` (Horizontal)** | [`src/components/home/FeaturedCarousel.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/home/FeaturedCarousel.tsx) (Carrusel de destacados) | Rendimiento animado fluido a nivel nativo (`useNativeDriver: true`). Utiliza `snapToInterval`, `snapToAlignment="start"`, `disableIntervalMomentum={true}` y `getItemLayout` para centrar de forma matemática y exacta el flyer activo en el medio de la pantalla con efecto coverflow (escala y opacidad interpoladas según `scrollX`). |
| **`ScrollView` (Horizontal)** | [`src/components/home/CategoryFilter.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/home/CategoryFilter.tsx) (Fila de categorías) | La lista de categorías es pequeña y fija (5 elementos: *Todas, Recitales, Fiestas, Boliches, Festivales*). Un `ScrollView` horizontal es más liviano que una `FlatList`, no requiere overhead de virtualización y ofrece desplazamiento táctil inmediato con roles semánticos de accesibilidad (`accessibilityRole="tablist"` / `"tab"`). |
| **`FlatList` (Vertical en Modal)** | [`src/components/checkout/ProvinceSelectModal.tsx`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/components/checkout/ProvinceSelectModal.tsx) (Selector de provincia) | Las 24 jurisdicciones de Argentina (23 provincias + CABA) se presentan dentro de un modal emergente. `FlatList` asegura scroll inercial suave, touch targets mínimos accesibles (48dp) y selección visual con tilde de confirmación. |
| **Mapeos directos `.map()`** | Detalle de evento (Tandas de entradas y Vehículos agregados) | El número de tandas de entradas por evento es pequeño (2 a 4 lotes) y la cantidad de vehículos en parking es de 1 a 3. Utilizar listas virtualizadas anidadas dentro del `ScrollView` principal causaría el antipatrón de advertencia *"VirtualizedLists should never be nested inside plain ScrollViews"*. Mapear directamente sobre el array produce layouts estables y limpios. |

---

## 3. Arquitectura y Patrones de Diseño

El proyecto aplica una combinación de **Screaming Architecture**, **Clean Architecture Lite** y **Vertical Slices**, adaptada a aplicaciones móviles React Native sin sobreingeniería:

### A. Estructura de Carpetas Orientada al Dominio
```
src/
├── __tests__/            # Suite de pruebas unitarias automatizadas (Jest)
├── app/                  # Thin Routes (Expo Router, sólo rutas y layouts)
│   ├── _layout.tsx       # Root Stack Layout
│   └── (tabs)/           # Route Group con layout de Bottom Tabs
├── components/           # Componentes presentacionales desacoplados por feature
│   ├── checkout/         # Pasos y modales del checkout (Summary, Buyer, Attendees, Confirmation)
│   ├── event/            # Detalle del evento (Hero, Tandas, Estacionamiento, Acerca de)
│   ├── home/             # Cartelera (Header con buscador, Carrusel, Filtros, Tarjetas)
│   ├── navigation/       # Componentes de navegación (AppTabBar)
│   └── ui/               # Iconografía vectorial 100% SVG nativa
├── constants/            # Design Tokens institucionales centralizados (Palette, Spacing, Fonts)
├── data/                 # Dataset mock estructurado basado en la cartelera real de La Plata
├── features/             # Vertical Slices para submódulos de dominio autocontenidos
│   └── parking/          # Reglas de negocio puras de patentes y componente PatenteInput
├── hooks/                # Custom hooks (useAppTheme para paleta institucional)
├── screens/              # Screen Containers desacoplados con lógica y ciclo de vida
│   ├── HomeScreen.tsx
│   ├── AccountScreen.tsx
│   ├── EventDetailScreen.tsx
│   └── CheckoutScreen.tsx
├── services/             # Fachada de datos desacoplada (eventsService, checkoutService)
├── types/                # Modelos y contratos de TypeScript estrictos
└── utils/                # Funciones puras (formatters, validation, imageUtils, carouselUtils)
```

### B. Patrones de Diseño Implementados
1. **Container / Presentational Pattern:** 
   - Las pantallas en `screens/` actúan como contenedores inteligentes (manejan llamadas a servicios, efectos, timers y eventos).
   - Los componentes en `components/` son presentacionales o "tontos" (reciben datos por props y emiten eventos mediante callbacks).
2. **Facade Pattern (Fachada de Servicios):**
   - El archivo `src/services/index.ts` expone una API unificada (`eventsService`, `checkoutService`). La UI consume contratos y no conoce la implementación de datos, lo que permite migrar de mocks a APIs REST/GraphQL sin modificar componentes visuales.
3. **Compound Stepper Pattern:**
   - El Checkout se estructura en pasos desacoplados (`OrderSummaryStep`, `BuyerFormStep`, `AttendeesFormStep`, `OrderConfirmationStep`) orquestados por un stepper que se adapta dinámicamente de 3 a 4 pasos según si las entradas están al mismo nombre o requieren nominación individual.
4. **Thin Routes Pattern:**
   - Expo Router se reserva únicamente para el ruteo. Las pantallas se pueden reutilizar, testear o reubicar sin acoplarlas al router.
5. **Single Responsibility Principle (SRP):**
   - Los modales (`ProvinceSelectModal`, `PaymentSuccessModal`) están completamente aislados con sus propios estilos, roles y contratos.
   - El formateo de moneda se eliminó de los servicios de cálculo y se centralizó en funciones utilitarias puras (`utils/formatters.ts`).

---

## 4. Gestión de Estados: Globales y Locales

### A. Política Anti-Sobreingeniería (Sin Redux / Zustand / MobX)
Para el alcance de este MVP, **no se agregaron bibliotecas externas de estado global** como Redux Toolkit o Zustand. Esto ahorra peso en el bundle final del APK, elimina boilerplate artificial y evita re-renderizados innecesarios en la New Architecture.

### B. Estado Local Reactivo (`useState`)
Se utiliza para toda la reactividad visual inmediata acotada a cada pantalla:
- **`HomeScreen`:** Término de búsqueda, debounced query (250ms), categoría activa, lista de eventos filtrados y estados de carga/refresco.
- **`EventDetailScreen`:** Cantidad seleccionada en cada tanda de tickets, apertura del acordeón de estacionamiento y lista dinámica de vehículos agregados.
- **`CheckoutScreen`:** Paso actual del stepper, datos del comprador, datos individuales de asistentes, visibilidad del modal de provincia y confirmación de pago.

### C. Persistencia sin Re-render (`useRef`)
Se implementa en casos donde se requiere preservar valores o acceder a la API nativa sin disparar renders:
- **Temporizador de compra (`CheckoutTimer`):** Utiliza una referencia con el `timestamp` absoluto de finalización (`Date.now() + 600000`). Esto garantiza que el tiempo se descuente con exactitud matemática incluso si la app pasa a segundo plano o se bloquea el dispositivo móvil.
- **Encadenamiento de foco con teclado:** `useRef<TextInput>` en formularios para avanzar automáticamente con `onSubmitEditing={() => nextInputRef.current?.focus()}`.
- **Control de scroll:** `useRef<ScrollView>` para centrar campos de texto sobre el teclado virtual (`onFocusField`) y ejecutar pull-to-refresh.

### D. Micro-Proveedor de Tema (`useAppTheme`)
En lugar de un contexto global pesado, el hook personalizado `useAppTheme` provee los tokens de color institucionales de `Palette`, garantizando identidad de marca uniforme (modo claro con cabecera y footer oscuros institucionales `#332F2B`) y alto contraste accesible en la barra de estado superior.

### E. Estado de Navegación vía Parámetros de Ruta
Los identificadores de recursos (`/event/[id]`, `/checkout/[id]`) se transmiten mediante parámetros tipados de Expo Router, garantizando que cada pantalla sea autónoma y compatible con enlaces profundos (Deep Linking).

---

## 5. Validaciones: Enfoque y Librerías

### A. Validaciones Puras "A Mano" (Vanilla TypeScript)
**No se utilizaron librerías de formularios ni validación externa** (como Formik, React Hook Form, Yup o Zod). Todas las validaciones fueron implementadas artesanalmente con **funciones puras y expresiones regulares estrictas**.

**Beneficios de esta decisión:**
- **Cero dependencias pesadas:** Ahorro significativo en el tamaño final del archivo APK universal.
- **Rendimiento instantáneo:** Sin validadores asíncronos pesados ni capas intermedias.
- **Máxima especificidad:** Adaptadas a las reglas del mercado argentino y del Gran La Plata.

### B. Reglas y Expresiones Regulares Implementadas

| Campo | Función / Ubicación | Regla y Formato |
|---|---|---|
| **DNI Argentino** | `isValidDNI`, `formatDNI`<br>([`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)) | Admite entre **7 y 8 dígitos numéricos** (para contemplar ciudadanos mayores con documentos previos a 10M y ciudadanos actuales). Formateo automático en tiempo real con separador de miles oficial (`X.XXX.XXX` y `XX.XXX.XXX`). |
| **Nombre y Apellido** | `isValidName`, `cleanName`<br>([`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)) | Expresión regular que exige exclusivamente letras, tildes y espacios (`/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/`), mínimo 2 caracteres. Limpieza automática de caracteres numéricos o símbolos no válidos. |
| **Teléfono** | `isValidPhone`, `formatPhone`<br>([`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)) | Valida cadenas numéricas de entre **8 y 13 dígitos** para admitir prefijos locales (ej. 221 La Plata, 011 AMBA) y códigos de país. Formateo legible con guiones. |
| **Correo Electrónico** | `isValidEmail`<br>([`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)) | Validación de formato RFC 5322 simplificado (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) y verificación de coincidencia estricta entre el campo "Email" y "Confirmar Email". |
| **Patente Vehicular** | `validarPatente`, `normalizarPatente`<br>([`src/features/parking/domain/patente.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/features/parking/domain/patente.ts)) | Acepta entre **3 y 12 caracteres alfanuméricos ASCII** (`/^[A-Za-z0-9]{3,12}$/`). Normalización automática a mayúsculas descartando espacios, guiones y caracteres no alfanuméricos. Compatible con formato Mercosur (`AB123CD`), formato tradicional (`ABC123`), motos y pickups. |
| **Provincias** | `ARGENTINE_PROVINCES`<br>([`src/utils/validation.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/utils/validation.ts)) | Validación contra catálogo estático cerrado de las 23 provincias argentinas más la Ciudad Autónoma de Buenos Aires. |

### C. Blindaje con Pruebas Automatizadas (Jest)
Todas las funciones puras de formateo y validación están respaldadas por **57 pruebas unitarias automatizadas** en [`src/__tests__/validation.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/validation.test.ts) y [`src/__tests__/patente.test.ts`](file:///c:/Users/anafa/OneDrive/Escritorio/Proyectos%20Freelance/MVP-PassLP/src/__tests__/patente.test.ts), verificando casos límite, entradas maliciosas y formatos borde.
