# UI Visual Guidelines - Mis Compromisos Task Manager

## 1. Fuente visual
- **ID del proyecto/diseño de Stitch usado**: 17997651674137774989
- **Nombre del diseño**: Mis Compromisos - Task Management App
- **Fecha de creación del documento**: 2026-05-11

## 2. Identidad visual general
- **Descripción del estilo visual**: Estilo "Functional Modernist" con enfoque en claridad y utilidad para usuarios productivos que gestionan múltiples dominios de vida (Trabajo, Hogar, Personal). Interfaz de alto rendimiento que prioriza densidad de tareas sin sacrificar legibilidad.
- **Tono de la interfaz**: Organizado, confiable y sin fricciones. Alto contraste con Flat UI, uso de espacios en blanco intencionales para reducir carga cognitiva y alineación estructural para transmitir orden.
- **Nivel de modernidad**: Alto - diseño contemporáneo con estética minimalista y disciplinada.
- **Minimalismo**: Alto - evita elementos decorativos innecesarios, enfocado en funcionalidad.
- **Densidad visual**: Media-alta - permite alta densidad de información manteniendo claridad.
- **Personalidad**: Profesional, técnica y eficiente, como una herramienta de alto rendimiento más que una experiencia social.

## 3. Paleta de colores
- **Colores primarios**:
  - Trabajo (Work): #2563eb (azul)
  - Hogar (Home): #10b981 (verde)
  - Personal: #8b5cf6 (púrpura)
- **Secundarios**:
  - Verde secundario: #6cf8bb (para contenedores)
  - Púrpura secundario: #7d4ce7 (para contenedores)
- **Colores de fondo**:
  - Fondo principal: #f8f9fa (gris claro frío)
  - Superficies: #ffffff (blanco puro)
  - Contenedores de superficie: #f3f4f5, #edeeef, #e7e8e9, #e1e3e4 (escala de grises)
- **Colores de texto**:
  - Texto principal: #191c1d (gris oscuro)
  - Texto secundario: #434655 (gris medio)
  - Texto en superficies: #191c1d
- **Bordes**:
  - Bordes estándar: #e5e7eb (gris claro, 0.5px-1px)
  - Bordes outline: #737686
  - Bordes outline-variant: #c3c6d7
- **Estados hover, active, disabled, success, warning, error**:
  - Hover: sutil aumento de peso de borde o glow primario sutil
  - Active: glow primario (#0053db)
  - Disabled: opacidad reducida (50-60%)
  - Success: verde (#10b981)
  - Warning: amarillo/naranja estándar (no detectado, usar #f59e0b)
  - Error: rojo (#ba1a1a) con contenedor #ffdad6
- **Uso recomendado de cada color**:
  - Azul (Trabajo): Identificación de tareas laborales, botones primarios de acción
  - Verde (Hogar): Identificación de tareas domésticas, estados de éxito
  - Púrpura (Personal): Identificación de tareas personales, elementos terciarios
  - Grises: Fondos, texto, separadores, contenedores neutros
  - Blanco: Tarjetas, superficies principales

## 4. Tipografía
- **Familia tipográfica**: Inter (Sans-serif)
- **Jerarquía de títulos**:
  - Display: 24px, 700 weight, line-height 32px, letter-spacing -0.02em (títulos principales)
  - Task Title: 16px, 600 weight, line-height 24px, letter-spacing -0.01em (nombres de tareas)
- **Tamaños sugeridos para heading, body, caption, labels y botones**:
  - Heading: 24px (display)
  - Body: 14px, 400 weight, line-height 20px, letter-spacing 0
  - Caption/Metadata: 12px, 500 weight, line-height 16px, letter-spacing 0.02em
  - Labels (caps): 11px, 700 weight, line-height 12px, letter-spacing 0.05em
  - Botones: 14px body o 16px task-title según importancia
- **Pesos visuales**:
  - Regular: 400 (texto normal)
  - Medium: 500 (metadata, énfasis secundario)
  - SemiBold: 600 (títulos de tareas, énfasis)
  - Bold: 700 (títulos principales, labels caps)
- **Line-height recomendado**: Compacto para alta densidad - 20px para body, 24px para títulos

## 5. Layout y composición
- **Estructura general de pantallas**: Layout de tablero Kanban con 3 columnas principales (Por hacer, En progreso, Completadas). Barra superior con navegación y controles. Sidebar opcional en desktop para filtros.
- **Ancho máximo de contenedores**: 1200px
- **Uso de grid/flex**: Grid fijo en desktop, fluid en mobile. Flex para alineaciones y distribución.
- **Alineaciones**: Izquierda para contenido principal, centrado para headers y elementos focales.
- **Radios de borde**: 4px (0.25rem) para cards/inputs/buttons, full (9999px) para badges/chips.
- **Sombras**: Suaves, nivel único - 0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03). Evitar sombras pesadas.
- **Separación entre secciones**: Múltiplos de 4px (base 4px).

## 6. Sistema de espaciado
- **Escala de spacing recomendada**: Base 4px, escala x2: 4px (xs), 8px (sm), 16px (md), 24px (lg), 32px (xl)
- **Paddings comunes**: 16px mobile horizontal, 24-32px desktop
- **Gaps entre componentes**: 8px (sm) entre elementos relacionados, 16px (md) entre grupos
- **Márgenes entre bloques**: 16px (md) entre secciones, 24px (lg) entre bloques mayores

## 7. Componentes visuales
- **Botones**:
  - Estilo principal: Ghost (sin fill, solo icono) para acciones secundarias
  - Botón primario "Add Task": Fill con azul trabajo (#2563eb)
  - Radio: 4px, altura consistente con texto
  - Iconos: Tabler Icons (stroke-width: 2)
- **Cards**:
  - Fondo blanco (#ffffff), borde 1px #e5e7eb, radio 4px
  - Contenido alineado izquierda, badge categoría arriba derecha
  - Padding interno: 16px
- **Inputs**:
  - Radio 4px, borde sutil por defecto
  - On focus: fondo blanco, borde azul primario 1px
  - Placeholder: gris medio
- **Formularios**:
  - Campos en columna vertical, gap 8px
  - Labels arriba de inputs
- **Navegación**:
  - Tabs horizontales con borde inferior 2px en activo
  - Inactivos: text-muted
  - Sidebar: 280px ancho en desktop
- **Headers**:
  - Barra superior con search, filtros, stats en tiempo real
  - Altura consistente, padding horizontal responsive
- **Tablas**: No detectado en diseño actual - usar si necesario con filas alternas sutiles
- **Modales**: No detectado - usar si necesario con sombra suave, fondo semi-transparente
- **Badges/Tags**:
  - Altura compacta 20px
  - Fondo: color surface categoría con 10-20% opacidad
  - Texto: color main de categoría
  - Radio: full (pill)
- **Estados vacíos**: Mensajes centrados con iconos descriptivos
- **Loaders/Skeletons**: Indicadores sutiles durante carga, placeholders con animación pulse

## 8. Responsive design
- **Comportamiento en mobile**: Layout fluid, columnas Kanban apiladas verticalmente, navegación colapsada en menú hamburguesa
- **Comportamiento en tablet**: Columnas lado a lado con scroll horizontal si necesario, sidebar opcional
- **Comportamiento en desktop**: 3 columnas fijas, sidebar 280px, max-width 1200px
- **Reglas de adaptación del layout**: Mantener proporciones, ajustar paddings (16px mobile, 24-32px desktop), preservar jerarquía visual

## 9. Reglas para implementación en Next.js
- **Cómo traducir el diseño a componentes reutilizables**: Crear componentes base (Button, Card, Badge) con variants para categorías, usar composición para layouts complejos
- **Recomendaciones para Tailwind/CSS Modules/SCSS**: Usar Tailwind para utilidad rápida, CSS Modules para componentes específicos, SCSS para variables globales de diseño
- **Estructura recomendada de componentes**: /components/ui/ para base, /components/features/ para específicos, /layouts/ para estructuras
- **Nombres de clases o tokens visuales sugeridos**: Usar tokens como --color-work, --spacing-md, clases como .card-work, .btn-ghost
- **Buenas prácticas para mantener consistencia**: Definir design tokens en CSS custom properties, usar componentes wrapper para categorías, validar contra guidelines antes de commits

## 10. Do and Don't
- **Qué sí se debe respetar del diseño**:
  - Usar estrictamente colores categóricos para Trabajo/Hogar/Personal
  - Mantener Inter como única fuente
  - Aplicar espaciado en múltiplos de 4px
  - Usar radio 4px para elementos rectangulares, full para badges
  - Priorizar claridad sobre decoración
- **Qué no se debe alterar**:
  - No cambiar paleta de colores sin aprobación
  - No usar fuentes diferentes a Inter
  - No aumentar densidad visual innecesariamente
  - No agregar sombras pesadas o efectos 3D
  - No ignorar jerarquía tipográfica
- **Errores visuales que el agente debe evitar**:
  - Mezclar colores categóricos incorrectamente
  - Usar espaciado inconsistente
  - Crear layouts que rompan la estructura Kanban
  - Agregar elementos decorativos no funcionales
  - Ignorar estados responsive

## 11. Checklist antes de implementar una pantalla
- [ ] Revisar esta guía visual
- [ ] Validar colores: ¿Usa paleta correcta para categorías?
- [ ] Validar spacing: ¿Múltiplos de 4px?
- [ ] Validar tipografía: ¿Inter con pesos y tamaños correctos?
- [ ] Validar responsive: ¿Adapta correctamente mobile/tablet/desktop?
- [ ] Validar consistencia: ¿Mantiene identidad "Productive Precision"?
- [ ] Verificar componentes: ¿Usa patrones establecidos (cards, badges, buttons)?
- [ ] Confirmar layout: ¿Respeta estructura Kanban de 3 columnas?