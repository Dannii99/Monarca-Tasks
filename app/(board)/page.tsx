import { prisma } from '@/lib/prisma'
import { Board } from '@/components/board/board'
import { serializeTask } from '@/lib/serialize-task'
import type { Task } from '@/types/task'

export default async function BoardPage() {
  const tasks = await prisma.task.findMany({
    orderBy: [
      {
        priority: 'asc',
      },
      {
        createdAt: 'desc',
      },
    ],
  })

  const serializedTasks = tasks.map(serializeTask) as Task[]

  return <Board initialTasks={serializedTasks} />
}
