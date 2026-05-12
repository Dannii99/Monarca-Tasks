import 'dotenv/config'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../generated/prisma'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.task.deleteMany({})

  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const lastWeek = new Date(now)
  lastWeek.setDate(lastWeek.getDate() - 7)
  const twoDaysAgo = new Date(now)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  const threeDaysFromNow = new Date(now)
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

  await prisma.task.createMany({
    data: [
      {
        title: 'Preparar presentación para cliente',
        description: 'Crear slides del proyecto Q4 para la reunión del viernes',
        status: 'TODO',
        category: 'WORK',
        priority: 'HIGH',
        dueDate: tomorrow,
      },
      {
        title: 'Revisar propuesta de presupuesto',
        description: 'Analizar costos del nuevo proyecto y enviar feedback',
        status: 'TODO',
        category: 'WORK',
        priority: 'MEDIUM',
        dueDate: nextWeek,
      },
      {
        title: 'Comprar materiales de limpieza',
        description: 'Detergente, suavizante y productos de cocina',
        status: 'IN_PROGRESS',
        category: 'HOME',
        priority: 'LOW',
        dueDate: tomorrow,
      },
      {
        title: 'Arreglar grifo del baño',
        description: 'Gotea constantemente, llamar al plomero o hacerlo uno mismo',
        status: 'TODO',
        category: 'HOME',
        priority: 'MEDIUM',
        dueDate: twoDaysAgo,
      },
      {
        title: 'Leer capítulo 5 de Clean Code',
        description: 'Tomar notas sobre patrones de diseño',
        status: 'IN_PROGRESS',
        category: 'PERSONAL',
        priority: 'LOW',
        dueDate: nextWeek,
      },
      {
        title: 'Actualizar portafolio web',
        description: 'Agregar últimos proyectos y mejorar sección de contacto',
        status: 'TODO',
        category: 'PERSONAL',
        priority: 'HIGH',
        dueDate: threeDaysFromNow,
      },
      {
        title: 'Enviar reporte semanal al equipo',
        description: 'Resumen de avances y blockers de la semana',
        status: 'DONE',
        category: 'WORK',
        priority: 'HIGH',
        dueDate: yesterday,
      },
      {
        title: 'Organizar escritorio y archivos',
        description: 'Limpiar documentos viejos y organizar carpetas',
        status: 'DONE',
        category: 'HOME',
        priority: 'LOW',
        dueDate: lastWeek,
      },
    ],
  })

  console.log('8 sample tasks seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
