import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tasks/[id]/activities
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
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
  const { id } = await params
  const body = await request.json()
  
  const activity = await prisma.activity.create({
    data: {
      action: body.action,
      details: body.details,
      taskId: id
    }
  })
  
  return NextResponse.json(activity)
}
