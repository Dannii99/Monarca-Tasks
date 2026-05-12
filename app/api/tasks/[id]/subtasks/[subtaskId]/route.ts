import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/tasks/[id]/subtasks/[subtaskId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  const { id, subtaskId } = await params
  const body = await request.json()
  
  // Mock response - se integrará con Neon
  const updatedSubtask = {
    id: subtaskId,
    title: body.title || 'Subtarea',
    completed: body.completed ?? false,
    taskId: id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  return NextResponse.json(updatedSubtask)
}

// DELETE /api/tasks/[id]/subtasks/[subtaskId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  const { subtaskId } = await params
  
  // Mock response - se integrará con Neon
  return NextResponse.json({ success: true, id: subtaskId })
}
