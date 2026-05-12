# UI Visual Guidelines — Monarca Tasks
**Versión**: 2.0 | **Actualizado**: 2026-05-11  
**Stack de UI**: shadcn/ui · Lucide React · Tailwind CSS · SCSS · Motion (Framer Motion)

---

## 1. Identidad visual

| Atributo | Valor |
|----------|-------|
| Estilo | Functional Modernist |
| Tono | Organizado, confiable, sin fricciones |
| Modernidad | Alta — minimalista y disciplinado |
| Densidad | Media-alta — información densa sin perder claridad |
| Personalidad | Herramienta de alto rendimiento, no experiencia social |

> **Espacio creativo**: El agente puede proponer micro-detalles visuales (transiciones, empty states ilustrados, variaciones de hover) siempre que respeten la paleta, tipografía y espaciado definidos. La creatividad vive en los detalles, no en los fundamentos.

---

## 2. Paleta de colores

### Colores categóricos — NO negociables
```css
--color-work:     #2563eb;   /* Azul    — Trabajo   */
--color-home:     #10b981;   /* Verde   — Hogar     */
--color-personal: #8b5cf6;   /* Púrpura — Personal  */
```

### Superficies y fondos
```css
--bg-base:        #f8f9fa;   /* Fondo principal */
--bg-surface:     #ffffff;   /* Cards, modales  */
--bg-subtle:      #f3f4f5;   /* Columnas Kanban */
--bg-muted:       #edeeef;   /* Hover suave     */
```

### Texto
```css
--text-primary:   #191c1d;
--text-secondary: #434655;
--text-muted:     #737686;
```

### Bordes
```css
--border-default: #e5e7eb;
--border-strong:  #c3c6d7;
--border-focus:   #2563eb;
```

### Estados semánticos
```css
--color-success:  #10b981;
--color-warning:  #f59e0b;
--color-error:    #ba1a1a;
--bg-error:       #ffdad6;
--color-active:   #0053db;
```

### Badges por categoría
```css
/* Work */
--badge-work-bg:   rgba(37, 99, 235, 0.12);
--badge-work-text: #2563eb;

/* Home */
--badge-home-bg:   rgba(16, 185, 129, 0.12);
--badge-home-text: #10b981;

/* Personal */
--badge-personal-bg:   rgba(139, 92, 246, 0.12);
--badge-personal-text: #8b5cf6;
```

---

## 3. Tipografía

**Familia única**: `Inter` — importar desde Google Fonts o `next/font/google`.

```css
/* En globals.scss o layout.tsx */
font-family: 'Inter', sans-serif;
```

### Escala tipográfica
| Rol | Tamaño | Peso | Line-height | Letter-spacing |
|-----|--------|------|-------------|----------------|
| Display / H1 | 24px | 700 | 32px | -0.02em |
| Task Title | 16px | 600 | 24px | -0.01em |
| Body | 14px | 400 | 20px | 0 |
| Caption / Meta | 12px | 500 | 16px | 0.02em |
| Label caps | 11px | 700 | 12px | 0.05em |
| Botón primario | 14px | 500 | — | 0 |

---

## 4. Sistema de espaciado

Base **4px** — usar siempre múltiplos.

```css
--spacing-xs:  4px;
--spacing-sm:  8px;
--spacing-md:  16px;
--spacing-lg:  24px;
--spacing-xl:  32px;
--spacing-2xl: 48px;
```

**En Tailwind**: usar clases `p-1 p-2 p-4 p-6 p-8 p-12` que corresponden a 4px, 8px, 16px, 24px, 32px, 48px.

---

## 5. Layout y composición

- **Max width**: `1200px` centrado
- **Columnas Kanban**: 3 fijas en desktop, apiladas en mobile
- **Sidebar filtros**: 280px en desktop, colapsado en mobile
- **Grid desktop**: `grid-cols-3 gap-4`
- **Padding horizontal**: `px-4` mobile · `px-6 lg:px-8` desktop

### Radios de borde
```css
--radius-sm:   4px;    /* inputs, buttons, cards */
--radius-full: 9999px; /* badges, chips, avatars */
```

### Sombras
```css
--shadow-card: 0px 4px 6px -1px rgba(0,0,0,0.05),
               0px 2px 4px -1px rgba(0,0,0,0.03);
--shadow-modal: 0px 20px 40px -8px rgba(0,0,0,0.12);
```

---

## 6. Stack de componentes UI

### shadcn/ui — componentes permitidos y configuración

Instalar con tema `neutral` y radio `sm` (4px):

```bash
npx shadcn@latest init
# style: default | base color: neutral | radius: 0.25rem
```

| Componente shadcn | Uso en Monarca Tasks |
|-------------------|----------------------|
| `Button` | Acciones primarias y secundarias |
| `Input` | Búsqueda, formularios de tarea |
| `Select` | Filtros de categoría y prioridad |
| `Dialog` | Modal de crear/editar tarea |
| `Badge` | Etiquetas de categoría y prioridad |
| `Separator` | Divisores entre secciones |
| `Skeleton` | Loading states de cards |
| `Tooltip` | Labels en botones icon-only |
| `DropdownMenu` | Menú de acciones en tarjeta |
| `ScrollArea` | Columnas Kanban con overflow |

> **Regla**: Siempre sobreescribir los colores por defecto de shadcn con los tokens categóricos del proyecto. No usar el azul por defecto de shadcn, usar `--color-work`.

**Personalizar `globals.css`** (generado por shadcn):
```css
:root {
  --primary: 37 99% 45%;      /* mapear al azul trabajo */
  --radius: 0.25rem;
}
```

---

### Lucide React — iconografía

Instalar: `npm install lucide-react`

#### Iconos por contexto

| Contexto | Icono Lucide |
|----------|-------------|
| Trabajo | `<Briefcase />` |
| Hogar | `<Home />` |
| Personal | `<User />` |
| Prioridad alta | `<AlertCircle />` color `#ba1a1a` |
| Prioridad media | `<Minus />` color `#f59e0b` |
| Prioridad baja | `<ArrowDown />` color `#10b981` |
| Agregar tarea | `<Plus />` |
| Eliminar | `<Trash2 />` |
| Editar | `<Pencil />` |
| Completar | `<CheckCircle2 />` |
| Buscar | `<Search />` |
| Filtros | `<SlidersHorizontal />` |
| Ordenar | `<ArrowUpDown />` |
| Drag handle | `<GripVertical />` |
| Fecha | `<Calendar />` |
| Vacío | `<ClipboardList />` |
| Cerrar sesión | `<LogOut />` |

#### Uso estándar
```tsx
import { Briefcase } from 'lucide-react'

// Tamaño estándar: 16px inline, 20px decorativo
<Briefcase size={16} strokeWidth={2} className="text-[#2563eb]" />
```

---

### Tailwind CSS — convenciones

Usar Tailwind como capa de utilidades. Evitar clases que contradigan los tokens del proyecto.

#### Clases base por componente

**Card de tarea**:
```
bg-white rounded-[4px] border border-[#e5e7eb] p-4 
shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)]
```

**Badge categoría**:
```
inline-flex items-center gap-1 px-2 py-0.5 
rounded-full text-[11px] font-bold uppercase tracking-[0.05em]
```

**Input**:
```
rounded-[4px] border border-[#e5e7eb] bg-white px-3 py-2 
text-sm text-[#191c1d] placeholder:text-[#737686]
focus:border-[#2563eb] focus:ring-0 focus:outline-none
```

**Columna Kanban**:
```
flex flex-col gap-2 bg-[#f3f4f5] rounded-[4px] p-4 min-h-[400px]
```

---

### SCSS — cuándo usarlo

SCSS complementa Tailwind para casos que las utilidades no cubren bien:

```scss
// src/styles/_tokens.scss — fuente de verdad de tokens
:root {
  --color-work:     #2563eb;
  --color-home:     #10b981;
  --color-personal: #8b5cf6;
  --spacing-md:     16px;
  // ... resto de tokens
}

// src/styles/_mixins.scss
@mixin category-accent($color) {
  border-left: 3px solid $color;
  &:hover { box-shadow: 0 0 0 1px #{$color}22; }
}

// src/components/TaskCard/TaskCard.module.scss
.card {
  &--work     { @include category-accent(#2563eb); }
  &--home     { @include category-accent(#10b981); }
  &--personal { @include category-accent(#8b5cf6); }
}
```

**Usar SCSS para**: animaciones complejas, mixins de categoría, variantes de estado anidadas, keyframes personalizados.  
**Usar Tailwind para**: espaciado, layout, colores simples, tipografía, display/flex/grid.

---

## 7. Motion (Framer Motion) — animaciones

Instalar: `npm install motion`

### Principios de animación

- **Duración**: corta (150-300ms) — app de productividad, no landing page
- **Easing**: `easeOut` para entradas, `easeIn` para salidas
- **No animar**: cambios de datos en tiempo real, contadores, filtros
- **Sí animar**: entrada de cards, modales, drag & drop, empty states, notificaciones

### Presets reutilizables

```tsx
// src/lib/motion.ts — exportar y reusar

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: 'easeOut' }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.96 },
  transition: { duration: 0.15, ease: 'easeOut' }
}

export const slideInRight = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: 16 },
  transition: { duration: 0.2, ease: 'easeOut' }
}

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06 }
  }
}
```

### Uso por componente

| Componente | Animación | Preset |
|------------|-----------|--------|
| TaskCard al crear | Entrada suave desde abajo | `fadeInUp` |
| TaskCard al eliminar | Salida con escala | `scaleIn` exit |
| Lista de cards | Entrada escalonada | `staggerContainer` |
| Modal crear/editar | Escala desde centro | `scaleIn` |
| Sidebar filtros | Deslizar desde izquierda | `slideInRight` |
| Empty state | Fade in | `fadeInUp` |
| Toast / notificación | Deslizar desde arriba | `slideInRight` |
| Drag overlay | Scale up sutil (1.02) | custom inline |

```tsx
// Ejemplo TaskCard
import { motion, AnimatePresence } from 'motion'
import { fadeInUp } from '@/lib/motion'

<motion.div {...fadeInUp} layout>
  <TaskCard task={task} />
</motion.div>
```

> **Nota**: Usar `layout` prop de Motion para animar reordenamientos en drag & drop sin código adicional.

---

## 8. Componentes — guía de implementación

### TaskCard
```
Estructura:
├── Accent bar izquierda (3px, color categoría)
├── Header: nombre tarea + badge categoría
├── Meta: fecha + prioridad icon + estado
└── Footer: acciones (editar, completar, eliminar)

shadcn: Card, Badge, Tooltip, DropdownMenu
Lucide: GripVertical, Pencil, Trash2, CheckCircle2, Calendar
Motion: fadeInUp, layout
```

### BoardColumn
```
Estructura:
├── Header: label columna + count badge + btn agregar
├── ScrollArea (shadcn) con lista de TaskCards
└── EmptyState si no hay tareas

shadcn: ScrollArea, Button
Lucide: Plus, icono representativo del estado
Motion: staggerContainer en la lista
```

### TaskFormModal
```
shadcn: Dialog, Input, Select, Button, Separator
Lucide: X (close), Calendar, Flag
Motion: scaleIn para el Dialog
Campos: nombre, categoría, prioridad, fecha límite
```

### BoardHeader
```
shadcn: Input (search), Select (filtros), Button
Lucide: Search, SlidersHorizontal, ArrowUpDown, LogOut
Stats en tiempo real: pills con conteo por estado
```

### EmptyState
```
Lucide: ClipboardList (grande, muted)
Motion: fadeInUp
Texto: mensaje contextual por columna
CTA: botón agregar primera tarea
```

---

## 9. Responsive design

| Breakpoint | Layout | Comportamiento |
|------------|--------|----------------|
| `< 768px` mobile | 1 columna | Kanban apilado, nav hamburguesa, tabs para cambiar columna |
| `768px` tablet | 2-3 columnas | Scroll horizontal opcional, sidebar colapsado |
| `> 1024px` desktop | 3 columnas fijas | Sidebar 280px, max-width 1200px |

```tsx
// Clases responsive Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 10. Do & Don't

### ✅ Sí hacer
- Usar tokens CSS para colores en lugar de valores hardcodeados en Tailwind
- Sobreescribir el tema de shadcn con los colores categóricos del proyecto
- Usar `lucide-react` exclusivamente para iconos (no mezclar con otras librerías)
- Animar con Motion solo entradas, salidas y drag — nunca datos en tiempo real
- Mantener Inter como única fuente
- Espaciado siempre en múltiplos de 4px
- Usar `layout` de Motion en listas que se reordenan

### ❌ No hacer
- No usar colores por defecto de shadcn sin sobreescribir
- No usar sombras pesadas ni efectos 3D
- No mezclar Tabler Icons con Lucide — solo Lucide
- No animar más de lo necesario (app de productividad, no portfolio visual)
- No cambiar la paleta categórica
- No usar fuentes diferentes a Inter
- No crear layouts que rompan la estructura Kanban de 3 columnas

---

## 11. Estructura de archivos recomendada

```
src/
├── styles/
│   ├── _tokens.scss        ← CSS custom properties
│   ├── _mixins.scss        ← mixins de categoría y utilidad
│   └── globals.scss        ← imports + shadcn overrides
├── lib/
│   └── motion.ts           ← presets de animación reutilizables
├── components/
│   ├── ui/                 ← componentes shadcn (auto-generados)
│   ├── board/
│   │   ├── TaskCard/
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskCard.module.scss
│   │   ├── BoardColumn/
│   │   └── BoardHeader/
│   └── shared/
│       ├── EmptyState/
│       └── CategoryBadge/
```

---

## 12. Checklist antes de implementar una pantalla

- [ ] Leer esta guía completa antes de escribir código
- [ ] ¿Los colores categóricos usan los tokens, no valores hardcodeados?
- [ ] ¿El componente shadcn fue sobreescrito con la paleta del proyecto?
- [ ] ¿Los iconos son de Lucide React exclusivamente?
- [ ] ¿Las animaciones usan los presets de `src/lib/motion.ts`?
- [ ] ¿El espaciado es múltiplo de 4px?
- [ ] ¿La tipografía usa Inter con los pesos correctos?
- [ ] ¿El layout responde correctamente en mobile, tablet y desktop?
- [ ] ¿Los empty states tienen icono + mensaje + CTA?
- [ ] ¿Los loading states usan Skeleton de shadcn?