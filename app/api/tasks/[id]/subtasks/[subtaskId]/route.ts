import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/tasks/[id]/subtasks/[subtaskId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  const { id, subtaskId } = await params
  const body = await request.json()
  
  // Obtener subtarea actual
  const currentSubtask = await prisma.subtask.findFirst({
    where: { 
      id: subtaskId,
      taskId: id,
      deletedAt: null
    }
  })
  
  if (!currentSubtask) {
    return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
  }
  
  const updates: { title?: string; status?: string } = {}
  const activities = []
  
  // Si cambió el título
  if (body.title !== undefined && body.title !== currentSubtask.title) {
    updates.title = body.title
    activities.push({
      action: 'subtask_edited',
      details: `${currentSubtask.title} → ${body.title}`,
      taskId: id
    })
  }
  
  // Si cambió el estado
  if (body.status !== undefined && body.status !== currentSubtask.status) {
    updates.status = body.status
    activities.push({
      action: 'subtask_status_changed',
      details: `${currentSubtask.title}: ${currentSubtask.status} → ${body.status}`,
      taskId: id
    })
  }
  
  // Si no hay cambios, retornar la subtarea actual
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(currentSubtask)
  }
  
  // Ejecutar actualización y crear actividades
  const [updatedSubtask] = await prisma.$transaction([
    prisma.subtask.update({
      where: { id: subtaskId },
      data: updates
    }),
    ...activities.map(act => prisma.activity.create({ data: act }))
  ])
  
  return NextResponse.json(updatedSubtask)
}

// DELETE /api/tasks/[id]/subtasks/[subtaskId] - Soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  const { id, subtaskId } = await params
  
  const subtask = await prisma.subtask.findFirst({
    where: { 
      id: subtaskId,
      taskId: id,
      deletedAt: null
    }
  })
  
  if (!subtask) {
    return NextResponse.json({ error: 'Subtask not found' }, { status: 404 })
  }
  
  await prisma.$transaction([
    // Soft delete: actualizar deletedAt en lugar de eliminar
    prisma.subtask.update({
      where: { id: subtaskId },
      data: { deletedAt: new Date() }
    }),
    // Registrar actividad
    prisma.activity.create({
      data: {
        action: 'subtask_deleted',
        details: subtask.title,
        taskId: id
      }
    })
  ])
  
  return NextResponse.json({ success: true, deleted: true })
}
