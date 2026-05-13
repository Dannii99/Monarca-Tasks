/**
 * Tareas de ejemplo para el usuario demo
 * Se crean automáticamente cuando un usuario demo inicia sesión por primera vez
 */

import { TaskCategory, TaskPriority, TaskStatus } from '@/types/task'

export interface DemoTask {
  title: string
  description: string | null
  status: TaskStatus
  category: TaskCategory
  priority: TaskPriority
  dueDate: Date | null
  subtasks?: { title: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE' }[]
}

export const demoTasks: DemoTask[] = [
  {
    title: 'Aprender a usar Monarca Tasks',
    description: 'Explorar las funcionalidades básicas: crear tareas, mover tarjetas entre columnas, y establecer fechas límite.',
    status: 'DONE',
    category: 'PERSONAL',
    priority: 'HIGH',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
    subtasks: [
      { title: 'Ver el tablero Kanban', status: 'DONE' },
      { title: 'Crear una tarea de prueba', status: 'DONE' },
      { title: 'Mover tarea entre columnas', status: 'DONE' },
    ],
  },
  {
    title: 'Comprar víveres para la semana',
    description: 'Leche, huevos, pan, frutas, verduras y café.',
    status: 'TODO',
    category: 'HOME',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Mañana
    subtasks: [
      { title: 'Hacer lista de compras', status: 'DONE' },
      { title: 'Ir al supermercado', status: 'TODO' },
      { title: 'Guardar todo en la nevera', status: 'TODO' },
    ],
  },
  {
    title: 'Llamar al dentista',
    description: 'Agendar chequeo de rutina. Tel: 555-0123',
    status: 'TODO',
    category: 'PERSONAL',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
  },
  {
    title: 'Preparar presentación para el cliente',
    description: 'Crear slides con los resultados del proyecto Q4 y propuestas para el próximo trimestre.',
    status: 'IN_PROGRESS',
    category: 'WORK',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // En 5 días
    subtasks: [
      { title: 'Recolectar datos del Q4', status: 'DONE' },
      { title: 'Crear slides', status: 'IN_PROGRESS' },
      { title: 'Revisar con el equipo', status: 'TODO' },
      { title: 'Enviar al cliente', status: 'TODO' },
    ],
  },
  {
    title: 'Revisar documentación del proyecto',
    description: 'Leer los requisitos técnicos y confirmar alcance con el equipo de desarrollo.',
    status: 'TODO',
    category: 'WORK',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En una semana
  },
  {
    title: 'Hacer ejercicio 3 veces esta semana',
    description: 'Correr, yoga o gimnasio. Mantener rutina saludable.',
    status: 'IN_PROGRESS',
    category: 'PERSONAL',
    priority: 'LOW',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // En 6 días
    subtasks: [
      { title: 'Lunes: Correr 30 min', status: 'DONE' },
      { title: 'Miércoles: Yoga', status: 'TODO' },
      { title: 'Viernes: Gimnasio', status: 'TODO' },
    ],
  },
  {
    title: 'Limpiar el garaje',
    description: 'Organizar herramientas, botar cosas viejas, barrer y desempolvar.',
    status: 'TODO',
    category: 'HOME',
    priority: 'LOW',
    dueDate: null, // Sin fecha límite
  },
  {
    title: 'Pagar facturas del mes',
    description: 'Electricidad, agua, internet y teléfono.',
    status: 'DONE',
    category: 'HOME',
    priority: 'HIGH',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Hace 5 días
  },
]
