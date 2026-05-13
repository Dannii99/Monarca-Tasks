import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tasks/[id]/subtasks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const subtasks = await prisma.subtask.findMany({
    where: { 
      taskId: id,
      deletedAt: null // Solo subtareas no eliminadas
    },
    orderBy: { createdAt: 'asc' }
  })
  
  return NextResponse.json(subtasks)
}

// POST /api/tasks/[id]/subtasks
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  
  if (!body.title || body.title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  
  const [subtask, activity] = await prisma.$transaction([
    // Crear subtarea
    prisma.subtask.create({
      data: {
        title: body.title.trim(),
        status: body.status || 'TODO',
        taskId: id
      }
    }),
    // Registrar actividad
    prisma.activity.create({
      data: {
        action: 'subtask_added',
        details: body.title.trim(),
        taskId: id
      }
    })
  ])
  
  return NextResponse.json(subtask)
}
