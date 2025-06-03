# Especificación Técnica de Seguridad - SecureSwipe

## Información General de la Aplicación

### Descripción
SecureSwipe es una aplicación web educativa desarrollada con Astro.js que permite a los usuarios aprender conceptos de seguridad informática mediante un sistema de tarjetas tipo "swipe" (deslizar). La aplicación presenta conceptos de vulnerabilidades y buenas prácticas de seguridad de manera interactiva.

### Tecnologías Utilizadas

#### Frontend Framework
- **Astro.js v3.0.0**: Framework estático para generar sitios web modernos
- **JavaScript ES6+**: Lógica del lado del cliente
- **CSS3**: Estilos y animaciones
- **HTML5**: Estructura semántica

#### Arquitectura
- **Modelo**: Aplicación estática generada (Static Site Generation - SSG)
- **Patrón**: Component-based architecture con servicios modulares
- **Almacenamiento**: localStorage para persistencia del lado del cliente

#### Dependencias de Desarrollo
- **ESLint**: Análisis estático de código JavaScript
- **Prettier**: Formateo de código
- **TypeScript Parser**: Soporte para análisis de TypeScript

## Arquitectura de la Aplicación

### Estructura de Directorios
```
secureswipe/
├── astro.config.mjs          # Configuración de Astro
├── package.json              # Dependencias y scripts
├── public/                   # Archivos estáticos
│   ├── data/cards.json      # Base de datos de tarjetas educativas
│   ├── styles/global.css    # Estilos globales
│   └── favicon.svg          # Icono de la aplicación
└── src/                     # Código fuente
    ├── components/          # Componentes reutilizables
    │   ├── interactive/     # Componentes interactivos
    │   └── ui/             # Componentes de interfaz
    ├── layouts/            # Layouts de página
    ├── pages/              # Páginas de la aplicación
    └── services/           # Servicios de lógica de negocio
```

### Componentes Principales

#### 1. Layouts
- **MainLayout.astro**: Layout principal que incluye header, footer y navegación

#### 2. Páginas
- **index.astro**: Página principal con sistema de swipe
- **collection.astro**: Colección de tarjetas guardadas
- **challenge.astro**: Modo desafío con puntuación
- **daily.astro**: Carta diaria
- **stats.astro**: Estadísticas del usuario

#### 3. Componentes UI
- **Card.astro**: Componente base para tarjetas
- **SecurityCard.astro**: Tarjeta específica para conceptos de seguridad
- **FeedbackPanel.astro**: Panel de retroalimentación

#### 4. Componentes Interactivos
- **SwipeCard.js**: Manejo de gestos de deslizamiento

#### 5. Servicios
- **CardService.js**: Gestión de tarjetas educativas
- **StorageService.js**: Gestión de almacenamiento local
- **EvaluationService.js**: Evaluación de respuestas del usuario

## Funcionalidad de la Aplicación

### Flujos Principales

#### 1. Flujo de Aprendizaje Principal (Swipe)
1. Usuario accede a la página principal
2. Sistema carga tarjetas desde `cards.json`
3. Usuario desliza tarjetas:
   - Derecha: Identifica como buena práctica
   - Izquierda: Identifica como vulnerabilidad
4. Sistema evalúa respuesta y muestra retroalimentación
5. Progreso se guarda en localStorage

#### 2. Flujo de Colección
1. Usuario navega a la sección de colección
2. Sistema recupera tarjetas guardadas desde localStorage
3. Usuario puede filtrar por categoría y tipo
4. Visualización en grid de tarjetas guardadas

#### 3. Flujo de Desafío
1. Usuario selecciona dificultad y categoría
2. Sistema genera conjunto aleatorio de 10 tarjetas
3. Usuario responde con tiempo limitado
4. Sistema calcula puntuación basada en aciertos y tiempo
5. Resultados se almacenan localmente

#### 4. Flujo de Carta Diaria
1. Sistema verifica si ya se accedió hoy
2. Selecciona carta aleatoria (preferentemente no vista)
3. Usuario evalúa la carta
4. Sistema actualiza racha diaria

### Gestión de Datos

#### Modelo de Tarjetas
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "type": "vulnerability|good_practice",
  "codeExample": "string",
  "explanation": "string",
  "difficulty": 1|2|3
}
```

#### Almacenamiento Local
- **secureswipe_user**: Datos del usuario
- **secureswipe_progress**: Progreso y respuestas
- **secureswipe_collection**: Tarjetas guardadas
- **secureswipe_settings**: Configuraciones
- **secureswipe_daily_card**: Datos de carta diaria

### Categorías de Seguridad Cubiertas
1. **Inyección SQL**: Vulnerabilidades de inyección de código
2. **Cross-Site Scripting (XSS)**: Inyección de scripts maliciosos
3. **Autenticación y Autorización**: Control de acceso
4. **Cross-Site Request Forgery (CSRF)**: Ataques de falsificación
5. **Criptografía**: Prácticas de cifrado seguro

## Configuración y Despliegue

### Configuración de Astro
- **Sitio**: `https://secureswipe.example.com`
- **Base**: `/`
- **Output**: `static` (generación estática)
- **Integraciones**: Preparado para Tailwind CSS (comentado)

### Scripts de NPM
- `npm run dev`: Servidor de desarrollo
- `npm run build`: Construcción para producción
- `npm run preview`: Vista previa de build
- `npm run start`: Alias para dev

### Variables de Entorno
- No se utilizan variables de entorno sensibles
- Toda la configuración está en archivos de código

## Análisis de Superficie de Ataque

### Puntos de Entrada
1. **Navegador Web**: Interfaz principal de usuario
2. **Archivos Estáticos**: JSON, CSS, JS servidos directamente
3. **localStorage**: Almacenamiento persistente del lado del cliente

### Componentes Expuestos
1. **Datos de Tarjetas**: Archivo JSON público
2. **Código JavaScript**: Scripts del lado del cliente
3. **Servicios**: Lógica de negocio expuesta en el cliente

### Dependencias Externas
- Astro.js framework
- Dependencias de desarrollo (ESLint, Prettier)
- Navegador del usuario (APIs web estándar)
