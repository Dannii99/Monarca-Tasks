import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { serializeTask } from '@/lib/serialize-task'
import { demoTasks } from '@/lib/demo-tasks'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user?.id || 'admin'

  try {
    // Si es usuario demo, verificar si necesita tareas de ejemplo
    if (userId === 'demo') {
      const demoSeed = await prisma.demoSeed.findUnique({
        where: { id: 'demo' }
      })

      // Si no tiene registro de seed, crear tareas de ejemplo
      if (!demoSeed) {
        for (const demoTask of demoTasks) {
          const task = await prisma.task.create({
            data: {
              title: demoTask.title,
              description: demoTask.description,
              status: demoTask.status,
              category: demoTask.category,
              priority: demoTask.priority,
              dueDate: demoTask.dueDate,
              userId: 'demo',
            },
          })

          // Crear subtareas si existen
          if (demoTask.subtasks && demoTask.subtasks.length > 0) {
            await prisma.subtask.createMany({
              data: demoTask.subtasks.map(st => ({
                title: st.title,
                status: st.status,
                taskId: task.id,
              })),
            })
          }
        }

        // Marcar que ya se hizo el seed
        await prisma.demoSeed.create({
          data: { id: 'demo' }
        })
      }
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
    })
    return NextResponse.json(tasks.map(serializeTask))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user?.id || 'admin'

  try {
    const body = await request.json()
    const { title, description, category, priority, dueDate } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        category: category || 'PERSONAL',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'TODO',
        userId,
      },
    })

    return NextResponse.json(serializeTask(task), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
