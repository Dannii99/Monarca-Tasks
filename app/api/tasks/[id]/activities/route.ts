import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/tasks/[id]/activities
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user?.id || 'admin'
  const { id } = await params

  // Verificar que la tarea padre pertenece al usuario
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }
  if (task.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  const activities = await prisma.activity.findMany({
    where: { taskId: id },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
  
  return NextResponse.json(activities)
}

// POST /api/tasks/[id]/activities
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user?.id || 'admin'
  const { id } = await params
  const body = await request.json()

  // Verificar que la tarea padre pertenece al usuario
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }
  if (task.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  const activity = await prisma.activity.create({
    data: {
      action: body.action,
      details: body.details,
      taskId: id
    }
  })
  
  return NextResponse.json(activity)
}
