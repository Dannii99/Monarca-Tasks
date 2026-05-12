import { NextRequest, NextResponse } from 'next/server'

// GET /api/tasks/[id]/activities
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Por ahora retornar array vacío - se integrará con Neon
  return NextResponse.json([])
}

// POST /api/tasks/[id]/activities
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  
  // Mock response - se integrará con Neon
  const newActivity = {
    id: `temp-${Date.now()}`,
    action: body.action || 'updated',
    details: body.details || null,
    taskId: id,
    createdAt: new Date().toISOString()
  }
  
  return NextResponse.json(newActivity)
}
