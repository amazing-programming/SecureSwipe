# Modelado de Amenazas STRIDE - SecureSwipe

## Información del Sistema

### Descripción del Sistema
SecureSwipe es una aplicación web educativa que utiliza Astro.js para enseñar conceptos de seguridad mediante tarjetas interactivas. La aplicación es completamente del lado del cliente con almacenamiento en localStorage.

### Límites del Sistema
- **Frontend**: Aplicación web estática servida desde servidor web
- **Datos**: Archivo JSON estático y localStorage del navegador
- **Usuario**: Navegador web del usuario final

### Activos Críticos
1. **Datos de Progreso del Usuario**: Estadísticas, respuestas, colección
2. **Contenido Educativo**: Tarjetas con información de seguridad
3. **Lógica de Evaluación**: Algoritmos de puntuación y evaluación
4. **Identidad del Usuario**: ID único y datos de sesión

## Diagramas de Flujo de Datos

### Componentes Principales
1. **Usuario/Navegador**
2. **Aplicación SecureSwipe (Frontend)**
3. **Archivo cards.json**
4. **localStorage**
5. **Servidor Web Estático**

### Flujos de Datos
```
Usuario → Navegador → SecureSwipe App → cards.json (lectura)
Usuario → Navegador → SecureSwipe App → localStorage (lectura/escritura)
Servidor Web → Navegador → SecureSwipe App (carga inicial)
```

## Análisis STRIDE

### S - Spoofing (Suplantación de Identidad)

#### Amenaza S1: Suplantación de Usuario
- **Descripción**: Un atacante puede suplantar a otro usuario modificando el ID en localStorage
- **Componente Afectado**: StorageService.js
- **Impacto**: Alto
- **Probabilidad**: Alta
- **Vector de Ataque**: 
  ```javascript
  // Atacante modifica localStorage
  localStorage.setItem('secureswipe_user', '{"id":"victim_user_123"}');
  ```
- **Mitigación**: Implementar autenticación robusta con tokens seguros

#### Amenaza S2: Falsificación de Contenido
- **Descripción**: Modificación del archivo cards.json para presentar información falsa
- **Componente Afectado**: CardService.js
- **Impacto**: Medio
- **Probabilidad**: Baja (requiere acceso al servidor)
- **Mitigación**: Implementar firma digital del contenido

### T - Tampering (Manipulación)

#### Amenaza T1: Manipulación de Progreso del Usuario
- **Descripción**: Alteración de datos de progreso, puntuaciones y colección en localStorage
- **Componente Afectado**: StorageService.js
- **Impacto**: Alto
- **Probabilidad**: Muy Alta
- **Vector de Ataque**:
  ```javascript
  // Atacante modifica progreso
  let progress = JSON.parse(localStorage.getItem('secureswipe_progress'));
  progress.correctAnswers = ['all_card_ids']; // Marca todas como correctas
  localStorage.setItem('secureswipe_progress', JSON.stringify(progress));
  ```
- **Mitigación**: Cifrado de datos, validación del lado del servidor

#### Amenaza T2: Manipulación de Lógica de Evaluación
- **Descripción**: Modificación del código JavaScript de evaluación en tiempo de ejecución
- **Componente Afectado**: EvaluationService.js
- **Impacto**: Alto
- **Probabilidad**: Alta
- **Vector de Ataque**:
  ```javascript
  // Atacante redefine función de evaluación
  EvaluationService.prototype.evaluateSwipe = function() { return true; };
  ```
- **Mitigación**: Validación del lado del servidor, obfuscación de código

#### Amenaza T3: Manipulación de DOM
- **Descripción**: Inyección de código malicioso a través de innerHTML sin sanitización
- **Componente Afectado**: index.astro, múltiples componentes
- **Impacto**: Alto
- **Probabilidad**: Media
- **Vector de Ataque**:
  ```javascript
  // Si cards.json es comprometido
  {
    "title": "<script>alert('XSS')</script>Título Malicioso",
    "description": "Contenido malicioso"
  }
  ```
- **Mitigación**: Sanitización de entrada, uso de textContent en lugar de innerHTML

### R - Repudiation (Repudio)

#### Amenaza R1: Negación de Actividad
- **Descripción**: Los usuarios pueden negar sus acciones debido a la falta de logging inmutable
- **Componente Afectado**: Sistema completo
- **Impacto**: Bajo
- **Probabilidad**: Media
- **Mitigación**: Implementar logging con timestamps y hashing

#### Amenaza R2: Falta de Auditoría
- **Descripción**: No existe rastro auditabe de cambios en datos del usuario
- **Componente Afectado**: StorageService.js
- **Impacto**: Medio
- **Probabilidad**: Alta
- **Mitigación**: Sistema de auditoría con blockchain local o firma digital

### I - Information Disclosure (Divulgación de Información)

#### Amenaza I1: Exposición de Datos en localStorage
- **Descripción**: Cualquier script en el mismo origen puede acceder a todos los datos del usuario
- **Componente Afectado**: StorageService.js
- **Impacto**: Alto
- **Probabilidad**: Alta
- **Vector de Ataque**:
  ```javascript
  // Script malicioso puede leer todos los datos
  for(let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if(key.startsWith('secureswipe_')) {
      console.log(key + ': ' + localStorage.getItem(key));
    }
  }
  ```
- **Mitigación**: Cifrado de datos sensibles, uso de sessionStorage para datos temporales

#### Amenaza I2: Exposición de Lógica de Negocio
- **Descripción**: Todo el código fuente está expuesto al cliente
- **Componente Afectado**: Todos los archivos JavaScript
- **Impacto**: Medio
- **Probabilidad**: Muy Alta
- **Mitigación**: Obfuscación de código, lógica crítica en servidor

#### Amenaza I3: Fuga de Información en Logs
- **Descripción**: Errores detallados en consola del navegador revelan información del sistema
- **Componente Afectado**: Múltiples servicios
- **Impacto**: Bajo
- **Probabilidad**: Alta
- **Vector de Ataque**:
  ```javascript
  console.error('Error cargando datos de tarjetas:', error); // Revela estructura interna
  ```
- **Mitigación**: Logging controlado sin información sensible

### D - Denial of Service (Denegación de Servicio)

#### Amenaza D1: Agotamiento de localStorage
- **Descripción**: Llenar localStorage hasta el límite impide el funcionamiento de la aplicación
- **Componente Afectado**: StorageService.js
- **Impacto**: Medio
- **Probabilidad**: Media
- **Vector de Ataque**:
  ```javascript
  // Atacante llena localStorage
  for(let i = 0; i < 10000; i++) {
    localStorage.setItem('spam_' + i, 'x'.repeat(1000));
  }
  ```
- **Mitigación**: Validación de límites de almacenamiento, limpieza periódica

#### Amenaza D2: Manipulación de Datos para Causar Errores
- **Descripción**: Corromper datos en localStorage para causar errores de aplicación
- **Componente Afectado**: StorageService.js
- **Impacto**: Medio
- **Probabilidad**: Alta
- **Vector de Ataque**:
  ```javascript
  // Corromper JSON en localStorage
  localStorage.setItem('secureswipe_progress', 'invalid_json');
  ```
- **Mitigación**: Validación robusta de datos, manejo de errores

#### Amenaza D3: Sobrecarga de DOM
- **Descripción**: Crear tarjetas con contenido excesivamente largo puede afectar el rendimiento
- **Componente Afectado**: SwipeCard.js, componentes UI
- **Impacto**: Bajo
- **Probabilidad**: Baja
- **Mitigación**: Límites en longitud de contenido, paginación

### E - Elevation of Privilege (Elevación de Privilegios)

#### Amenaza E1: Ejecución de Código Arbitrario via XSS
- **Descripción**: Inyección de scripts maliciosos a través de contenido no sanitizado
- **Componente Afectado**: Componentes que usan innerHTML
- **Impacto**: Muy Alto
- **Probabilidad**: Media
- **Vector de Ataque**:
  ```javascript
  // Si se compromete cards.json
  {
    "codeExample": "</code></pre><script>/* código malicioso */</script><pre><code>"
  }
  ```
- **Mitigación**: Content Security Policy estricta, sanitización de contenido

#### Amenaza E2: Acceso a APIs del Navegador
- **Descripción**: Scripts maliciosos pueden acceder a APIs sensibles del navegador
- **Componente Afectado**: Sistema completo
- **Impacto**: Alto
- **Probabilidad**: Media
- **Mitigación**: CSP restrictiva, feature policy

## Matriz de Riesgo

| Amenaza | Impacto | Probabilidad | Riesgo | Prioridad |
|---------|---------|--------------|--------|-----------|
| T1 - Manipulación de Progreso | Alto | Muy Alta | Crítico | 1 |
| I1 - Exposición de localStorage | Alto | Alta | Alto | 2 |
| E1 - XSS via Contenido | Muy Alto | Media | Alto | 3 |
| T2 - Manipulación de Lógica | Alto | Alta | Alto | 4 |
| S1 - Suplantación de Usuario | Alto | Alta | Alto | 5 |
| T3 - Manipulación de DOM | Alto | Media | Medio | 6 |
| I2 - Exposición de Lógica | Medio | Muy Alta | Medio | 7 |
| D1 - Agotamiento de Storage | Medio | Media | Medio | 8 |
| D2 - Corrupción de Datos | Medio | Alta | Medio | 9 |
| R2 - Falta de Auditoría | Medio | Alta | Medio | 10 |

## Contramedidas Recomendadas

### Inmediatas (Críticas)
1. **Implementar cifrado para localStorage** - Mitiga T1, I1
2. **Sanitización estricta de contenido** - Mitiga T3, E1
3. **Content Security Policy** - Mitiga E1, E2
4. **Validación robusta de datos** - Mitiga T1, D2

### Corto Plazo (Altas)
1. **Autenticación robusta** - Mitiga S1
2. **Obfuscación de código crítico** - Mitiga T2, I2
3. **Rate limiting del cliente** - Mitiga D1
4. **Manejo mejorado de errores** - Mitiga I3, D2

### Medio Plazo (Medias)
1. **Sistema de auditoría** - Mitiga R1, R2
2. **Límites de almacenamiento** - Mitiga D1
3. **Logging seguro** - Mitiga I3
4. **Validación de integridad** - Mitiga S2

## Conclusiones

El modelo STRIDE revela que SecureSwipe presenta vulnerabilidades significativas, especialmente en las categorías de **Tampering** e **Information Disclosure**. Las amenazas de mayor prioridad están relacionadas con la manipulación de datos del usuario y la exposición de información sensible a través de localStorage sin protección.

La implementación de las contramedidas recomendadas en orden de prioridad reducirá significativamente el perfil de riesgo de la aplicación.
