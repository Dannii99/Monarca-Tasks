import { NextRequest, NextResponse } from 'next/server'

// GET /api/tasks/[id]/subtasks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Por ahora retornar array vacío - se integrará con Neon
  return NextResponse.json([])
}

// POST /api/tasks/[id]/subtasks
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  
  // Mock response - se integrará con Neon
  const newSubtask = {
    id: `temp-${Date.now()}`,
    title: body.title,
    completed: false,
    taskId: id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  return NextResponse.json(newSubtask)
}
